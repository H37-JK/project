from typing import List

from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model import User


class DatabaseServerInfo(SQLModel, table = True):
    __tablename__ = "database_server_info"
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    host: str
    port: int
    db_type: str
    username: str
    password: str
    database: str | None = Field(default = None)
    driver: str | None = Field(default = None)
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "database_server_infos")
    database_infos: List["DatabaseInfo"] = Relationship(back_populates = "database_server_info", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)


class DatabaseServerInfoCreate(SQLModel):
    host: str
    port: int
    db_type: str
    username: str
    password: str
    database: str | None = Field(default = None)
    driver: str | None = Field(default = None)


class DatabaseServerInfoCreateResponse(SQLModel):
    id: UUID
    host: str
    port: int
    db_type: str
    username: str
    password: str
    database: str | None = Field(default = None)
    driver: str | None = Field(default = None)
    create_at: datetime


class DatabaseServerInfoUpdate(SQLModel):
    host: str | None = Field(default = None)
    port: int | None = Field(default = None)
    db_type: str | None = Field(default = None)
    username: str | None = Field(default = None)
    password: str | None = Field(default = None)
    database: str | None = Field(default = None)
    driver: str | None = Field(default = None)


class DatabaseServerInfoUpdateResponse(SQLModel):
    id: UUID
    host: str
    port: int
    db_type: str
    username: str
    password: str
    database: str | None = Field(default = None)
    driver: str | None = Field(default = None)
    update_at: datetime