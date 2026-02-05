from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql.json import JSONB
from backend.model.user.user import User
from backend.helper.date import get_utc_now
from typing import List
from sqlalchemy import Column
from datetime import datetime
from uuid import UUID, uuid4

class Agent(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    name: str = Field(default = "none")
    prompt: str
    history:  List[str] = Field(default_factory = list, sa_column = Column(JSONB))
    result: str | None = Field(default = None)
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "agents")
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)


class AgentCreate(SQLModel):
    name: str = Field(default = "none")
    prompt: str


class AgentCreateResponse(SQLModel):
    id: UUID
    name: str = Field(default = "none")
    prompt: str
    history: List[str] = Field(default_factory = list)
    result: str | None = Field(default = None)
    create_at: datetime


class AgentUpdate(SQLModel):
    name: str = Field(default = "none")
    prompt: str | None = Field(default = None)


class AgentUpdateResponse(SQLModel):
    id: UUID
    name: str
    prompt: str
    update_at: datetime



