from sqlalchemy import Column
from sqlmodel import SQLModel, Field, Relationship
from typing import Dict, Any

from backend.helper.date import get_utc_now
from backend.model.user.user import User
from sqlalchemy.dialects.postgresql.json import JSONB
from uuid import UUID, uuid4
from datetime import datetime


class Monitor(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    host: str = Field(max_length = 50)
    port: int = Field(ge = 1, le = 65535, max_length = 50)
    username: str = Field(max_length = 50)
    password: str | None = Field(default = None, max_length = 50)
    key: str | None = Field(default = None, max_length = 100)
    result: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "monitors")
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime = Field(default_factory = get_utc_now)


class MonitorCreate(SQLModel):
    host: str = Field(max_length = 50)
    port: int = Field(ge = 1, le = 65535,max_length = 50)
    username: str = Field(max_length = 50)
    password: str | None = Field(default = None, max_length = 50)
    key: str | None = Field(default = None, max_length = 100)


class MonitorCreateResponse(SQLModel):
    id: UUID
    host: str
    port: int
    username: str
    password: str | None = Field(default = None)
    key: str | None = Field(default = None)
    create_at: datetime


class MonitorUpdate(SQLModel):
    host: str | None = Field(default = None, max_length = 50)
    port: int | None = Field(default = None, ge = 1, le = 65535, max_length = 50)
    username: str | None = Field(default = None, max_length = 50)
    password: str | None = Field(default = None, max_length = 50)
    key: str | None = Field(default = None, max_length = 100)


class MonitorUpdateResponse(SQLModel):
    id: UUID
    host: str
    port: int
    username: str
    password: str | None = Field(default = None)
    key: str | None = Field(default = None)
    update_at: datetime


