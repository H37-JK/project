from datetime import datetime
from typing import List, Dict, Any

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4

from backend.helper.date import get_utc_now
from backend.model.database.database_info import DatabaseInfo
from backend.model.database.database_server_info import DatabaseServerInfo


class Query(SQLModel, table = True):
    id: UUID | None = Field(default_factory = uuid4, primary_key = True)
    query: str
    query_type: str
    status: str
    affected_rows: int = Field(default = 0)
    result_data: List[Dict[str, Any]] = Field(default_factory= list, sa_column = Column(JSONB))
    error_message: str | None = Field(default = None)
    execution_time_ms: float = Field(default = 0.0)
    database_info_id: UUID = Field(foreign_key = "database_info.id", ondelete = "CASCADE")
    database_info: DatabaseInfo = Relationship(back_populates = "queries")
    create_at: datetime  = Field(default_factory = get_utc_now)


class QueryCreate(SQLModel):
    query: str


class QueryCreateResponse(SQLModel):
    id: UUID | None = Field(default = uuid4, primary_key = True)
    query: str
    query_type: str
    status: str
    affected_rows: int = Field(default = 0)
    result_data: List[Dict[str, Any]] = Field(default_factory= list, sa_column = Column(JSONB))
    error_message: str | None = Field(default = None)
    execution_time_ms: float = Field(default = 0.0)
    create_at: datetime  = Field(default_factory = get_utc_now)