import asyncio
import time
from typing import Annotated
from uuid import UUID

import sqlparse
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import create_engine
from sqlmodel import select, text

from backend.db.engine import SessionDep
from backend.helper.date import get_utc_now
from backend.logs.logging_route import LoggingRoute
from backend.model import User
from backend.model.database.database_info import DatabaseInfo
from backend.model.database.database_server_info import DatabaseServerInfo
from backend.model.database.query import Query, QueryCreateResponse, QueryCreate
from backend.passlib.jwt_token import get_current_user
from backend.routers.database.database_server_info import generate_db_url

router = APIRouter (
    tags = ["query"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute,
)


def get_valid_query_type(query: str):
    parsed = sqlparse.parse(query)
    if not parsed:
        return "UNKNOWN"

    stmt = parsed[0]
    return stmt.get_type()


@router.get("/get/queries")
async def get_queries (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    data = session.exec(select(Query, DatabaseServerInfo, DatabaseInfo)
                        .join(DatabaseInfo, Query.database_info_id == DatabaseInfo.id)
                        .join(DatabaseServerInfo, DatabaseInfo.database_server_info_id == DatabaseServerInfo.id)
                        .where(DatabaseServerInfo.user_id == current_user.id)).all()
    response_data = []
    for query, server, database in data:
        response_data.append({
            "query": query
        })
    return response_data


@router.get("/get/query/{id}")
async def get_query (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    return session.exec(select(Query.id == id)).one_or_none()


@router.post("/execute/query/{id}")
async def execute_query (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    query_create: QueryCreate,
    id: UUID
):
    data = session.exec(select(DatabaseServerInfo, DatabaseInfo).join(
        DatabaseInfo, DatabaseServerInfo.id == DatabaseInfo.database_server_info_id # type: ignore
    ).where(DatabaseServerInfo.id == id)).one_or_none()

    if not data:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "해당 데이터베이스가 존재 하지 않습니다.")

    database_server_info, database_info = data
    url = generate_db_url(database_server_info)

    engine = create_engine(url)
    start_time = time.time()

    query = Query.model_validate (
        query_create,
        update = {
            "query_type": get_valid_query_type(query_create.query),
            "database_info_id": database_info.id,
            "status": "fail"
        }
    )

    try:
        with engine.connect() as conn:
            result = conn.execute(text(query.query))

            if result.returns_rows:
                rows = [dict(row._mapping) for row in result.all()]
                query.result_data = rows
                query.affected_rows = len(rows)
            else:
                conn.commit()
                query.affected_rows = result.rowcount

            query.status = "success"
    except Exception as error:
        query.status = "fail"
        query.error_message = str(error)
    finally:
        query.execution_time_ms = (time.time() - start_time) * 1000
        session.add(query)
        session.commit()
        session.refresh(query)

    return query


@router.delete("/delete/query/{id}")
async def delete_query (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    query = session.exec(select(Query.id == id)).one_or_none()
    if not query:
        raise HTTPException(status_code = 404, detail = "해당 쿼리가 존재 하지 않습니다.")

    session.delete(query)
    session.commit()

    return True








