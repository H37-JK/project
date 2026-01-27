from fastapi import APIRouter
from backend.db.engine import SessionDep
from sqlmodel import text

from backend.logs.logging_route import LoggingRoute
from backend.query.schema_query import column_schema_query

router = APIRouter (
    prefix = "/db",
    tags = ["db"],
    responses = {404: {"description" : "Not Found"}},
    route_class = LoggingRoute,
)

@router.post("/table_schema")
async def table_schema(session: SessionDep, table_schema = 'public'):
    query = text("SELECT table_schema, table_name, table_type FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = :table_schema")
    return session.execute(query, {"table_schema": table_schema}).mappings().all()

@router.post("/table_column")
async def table_column(session: SessionDep, table_name, table_schema = 'public'):
    query = text(column_schema_query)
    return session.execute(query, {"table_name": table_name, "table_schema": table_schema}).mappings().all()

