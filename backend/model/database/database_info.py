from typing import List

from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model import User
from backend.model.database.database_server_info import DatabaseServerInfo


class DatabaseInfo(SQLModel, table = True):
    __tablename__ = "database_info"
    id: UUID | None = Field(default_factory = uuid4, primary_key = True)
    db_name: str
    database_server_info_id: UUID = Field(foreign_key = "database_server_info.id", ondelete = "CASCADE")
    database_server_info: DatabaseServerInfo = Relationship(back_populates = "database_infos")
    table_infos: List["TableInfo"] = Relationship(back_populates = "database_info", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    queries: List["Query"] = Relationship(back_populates = "database_info", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)


