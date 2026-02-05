import asyncio
import urllib
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import create_engine, text
from sqlmodel import select

from backend.db.engine import SessionDep
from backend.helper.date import get_utc_now
from backend.logs.logging_route import LoggingRoute
from backend.model import User
from backend.model.database.database_info import DatabaseInfo
from backend.model.database.database_server_info import DatabaseServerInfo, DatabaseServerInfoCreate, \
    DatabaseServerInfoCreateResponse, DatabaseServerInfoUpdateResponse, DatabaseServerInfoUpdate
from backend.model.database.table_info import TableInfo
from backend.passlib.jwt_token import get_current_user
from sqlalchemy import inspect

router = APIRouter (
    tags = ["database-server-info"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute,
)

def generate_db_url (database_server_info: DatabaseServerInfo):
    if database_server_info.db_type.lower() == 'mysql':
         url = f"mysql+pymysql://{database_server_info.user_name}:{database_server_info.password}@{database_server_info.host}:{database_server_info.port}/{database_server_info.database}"
    elif database_server_info.db_type.lower() == 'postgres':
         db_name = database_server_info.database if database_server_info.databse else "postgres"
         url = f"postgresql://{database_server_info.user_name}:{database_server_info.password}@{database_server_info.host}:{database_server_info.port}/{db_name}"
    elif database_server_info.db_type.lower() == 'mssql':
         params = urllib.parse.quote_plus (
             f"DRIVER={{{database_server_info.driver}}};"
             f"SERVER={database_server_info.host},{database_server_info.port};"
             f"DATABASE={database_server_info.database};"
             f"UID={database_server_info.username};"
             f"PWD={database_server_info.password};"
             f"Encrypt=no;"
             f"TrustServerCertificate=yes;"
         )
         url = f"mssql+pyodbc:///?odbc_connect={params}"
    else:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "지원 하지 않는 DB 타입 입니다.")
    return url


@router.get("/get/database-server-infos")
async def get_database_server_infos (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
): 
    return session.exec(select(DatabaseServerInfo).where(DatabaseServerInfo.user_id == current_user.id)).all()


@router.get("/get/database-server-info/{id}")
async def get_database_server_info (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    return session.exec(select(DatabaseServerInfo).where(DatabaseServerInfo.user_id == current_user.id, DatabaseServerInfo.id == id)).one_or_none()


@router.post("/create/database-server-info")
async def create_database_server_info (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    database_server_info_create: DatabaseServerInfoCreate
):
    database_server_info = DatabaseServerInfo.model_validate (
        database_server_info_create,
        update = {
            "user_id": current_user.id
        }
    )

    session.add(database_server_info)
    session.flush()
    session.refresh(database_server_info)

    url = generate_db_url(database_server_info)
    engine = create_engine(url, echo = False)

    if database_server_info.db_type.lower() == 'mysql' or database_server_info.db_type.lower() == 'postgres':
        inspector = inspect(engine)
        db_names = inspector.get_schema_names()

        for db_name in db_names:
            if db_name in ['information_schema', 'performance_schema', 'mysql', 'sys', 'pg_catalog', 'pg_toast']:
                continue

            database_info = DatabaseInfo (
                db_name = db_name,
                database_server_info_id = database_server_info.id
            )
            session.add(database_info)
            session.flush()
            session.refresh(database_info)

            try:
                table_names = inspector.get_table_names(schema = db_name)
                for table_name in table_names:
                    table_info = TableInfo (
                        table_name = table_name,
                        database_info_id = database_info.id
                    )
                    session.add(table_info)
                    session.flush()
                    session.refresh(table_info)
            except Exception:
                continue
    else:
        with engine.connect() as connection:
            if not database_server_info.database:
                database_query = """
                SELECT name FROM sys.databases 
                WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')
                """
                params = {}
            else:
                database_query = """
                SELECT name FROM sys.databases 
                WHERE name = :database
                """
                params = {"database": database_server_info.database}
            db_query = text(database_query)
            db_names = connection.execute(db_query, params).scalars().all()
            for db_name in db_names:
                database_info = DatabaseInfo (
                    db_name = db_name,
                    database_server_info_id = database_server_info.id
                )
                session.add(database_info)
                session.flush()
                session.refresh(database_info)
                table_query = text(f"""
                    SELECT TABLE_NAME 
                    FROM [{db_name}].INFORMATION_SCHEMA.TABLES 
                """)
                table_names = connection.execute(table_query).scalars().all()
                for table_name in table_names:
                    table_info = TableInfo (
                        table_name = table_name,
                        database_info_id = database_info.id
                    )
                    session.add(table_info)
                    session.flush()
                    session.refresh(table_info)

    session.commit()
    return {"detail": "연결에 성공 하였습니다."}


@router.patch("/update/database-server-info/{id}", response_model = DatabaseServerInfoUpdateResponse)
async def update_database_server_info (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    database_server_info_update: DatabaseServerInfoUpdate,
    id: UUID
):
    database_server_info = session.exec(select(DatabaseServerInfo.id == id, DatabaseServerInfo.user_id == current_user.id)).one_or_none()
    if not database_server_info:
        raise HTTPException(status_code = 404, detail = "해당 데이터베이스 정보가 존재 하지 않습니다.")

    update_data = database_server_info_update.model_dump(exclude_unset = True, exclude_none = True)
    update_data["update_at"] = get_utc_now()
    database_server_info.sqlmodel_update(update_data)

    session.add(database_server_info)
    session.commit()
    session.refresh(database_server_info)

    return database_server_info


@router.delete("/delete/database-server-info/{id}")
async def delete_database_server_info (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    database_server_info = session.exec(select(DatabaseServerInfo.id == id, DatabaseServerInfo.user_id == current_user.id)).one_or_none()
    if not database_server_info:
        raise HTTPException(status_code = 404, detail = "해당 데이터베이스 정보가 존재 하지 않습니다.")

    session.delete(database_server_info)
    session.commit()

    return True