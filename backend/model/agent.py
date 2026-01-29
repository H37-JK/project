from sqlmodel import SQLModel
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql.json import JSONB
from backend.model.user import User
from typing import Dict, Any, List
from sqlalchemy import Column
from datetime import datetime

class Agent(SQLModel, table = True):
    id: int | None = Field(default = None, primary_key = True)
    prompt: str
    history:  List[str] = Field(default_factory = list, sa_column = Column(JSONB))
    result: str
    user_id: int | None = Field(default = None, foreign_key = "user.id")
    user: User | None = Relationship(back_populates = "agents")
    create_at: datetime  = Field(default_factory = datetime.utcnow)
