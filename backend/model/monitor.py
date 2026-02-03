
from sqlmodel import SQLModel, Field, Relationship
from typing import Dict, Any

from backend.helper.date import get_utc_now
from backend.model.user import User
from sqlalchemy.dialects.postgresql.json import JSONB
from uuid import UUID, uuid4
from datetime import datetime


class Monitor(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    host: str
    port: int
    username: str
    password: str | None = Field(default = None)
    key: str | None = Field(default = None)
    result: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "monitors")
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime = Field(default_factory = get_utc_now)


class MonitorCreate(SQLModel):
    host: str
    port: int
    username: str
    password: str | None = Field(default = None)
    key: str | None = Field(default = None)


class MonitorCreateResponse(SQLModel):
    id: UUID
    host: str
    port: int
    username: str
    password: str | None = Field(default = None)
    key: str | None = Field(default = None)
    create_at: datetime


class MonitorUpdate(SQLModel):
    host: str | None = Field(default = None)
    port: int | None = Field(default = None)
    username: str | None = Field(default = None)
    password: str | None = Field(default = None)
    key: str | None = Field(default = None)


class MonitorUpdateResponse(SQLModel):
    id: UUID
    host: str
    port: int
    username: str
    password: str | None = Field(default = None)
    key: str | None = Field(default = None)
    update_at: datetime


