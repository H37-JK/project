from typing import Any, Dict
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.user.user import User


class ApiEnvironment(SQLModel, table = True):
    __tablename__ = "api_environment"
    id: UUID  = Field(default_factory = uuid4, primary_key = True)
    name: str
    variables: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "api_environments")
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)


class ApiEnvironmentCreate(SQLModel):
    name: str
    variables: Dict[str, Any] = Field(default_factory = dict)


class ApiEnvironmentCreateResponse(SQLModel):
    id: UUID
    name: str
    variables: Dict[str, Any] = Field(default_factory = dict)
    create_at: datetime


class ApiEnvironmentUpdate(SQLModel):
    name: str | None = Field(default = None)
    variables: Dict[str, Any] | None = Field(default = None)


class ApiEnvironmentUpdateResponse(SQLModel):
    id: UUID
    name: str
    variables: Dict[str, Any] | None = Field(default = None)
    update_at: datetime
