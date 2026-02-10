from typing import List

from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model import User


class DatabaseServerInfo(SQLModel, table = True):
    __tablename__ = "database_server_info"
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    host: str = Field(max_length = 50)
    port: int = Field(ge = 1, le = 65535, max_length = 50)
    db_type: str = Field(max_length = 50)
    username: str = Field(max_length = 50)
    password: str = Field(max_length = 50)
    database: str | None = Field(default = None, max_length = 50)
    driver: str | None = Field(default = None, max_length = 100)
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "database_server_infos")
    database_infos: List["DatabaseInfo"] = Relationship(back_populates = "database_server_info", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)


class DatabaseServerInfoCreate(SQLModel):
    host: str = Field(max_length = 50)
    port: int = Field(ge = 1, le = 65535, max_length = 50)
    db_type: str = Field(max_length = 50)
    username: str = Field(max_length = 50)
    password: str = Field(max_length = 50)
    database: str | None = Field(default = None, max_length = 50)
    driver: str | None = Field(default = None, max_length = 100)


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
    host: str | None = Field(default = None, max_length = 50)
    port: int | None = Field(ge = 1, le = 65535, default = None, max_length = 50)
    db_type: str | None = Field(default = None, max_length = 50)
    username: str | None = Field(default = None, max_length = 50)
    password: str | None = Field(default = None, max_length = 50)
    database: str | None = Field(default = None, max_length = 50)
    driver: str | None = Field(default = None, max_length = 100)


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