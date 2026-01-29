
from sqlmodel import SQLModel, Field, Relationship
from typing import Dict, Any
from backend.model.user import User
from sqlalchemy.dialects.postgresql.json import JSONB

class Monitor(SQLModel, table = True):
    id: int | None = Field(default = None, primary_key = True)
    host: str
    port: int
    username: str
    password: str | None
    key: str | None
    result: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    user_id: int | None = Field(default = None, foreign_key = "user.id")
    user: User | None = Relationship(back_populates = "monitors")