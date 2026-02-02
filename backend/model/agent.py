from sqlmodel import SQLModel
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql.json import JSONB
from backend.model.user import User
from backend.helper.date import get_utc_now
from typing import Dict, Any, List
from sqlalchemy import Column
from datetime import datetime
from uuid import UUID, uuid4

class Agent(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    prompt: str
    history:  List[str] = Field(default_factory = list, sa_column = Column(JSONB))
    result: str
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "agents")
    create_at: datetime  = Field(default_factory = get_utc_now)
