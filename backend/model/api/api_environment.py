from typing import Any, Dict
from uuid import UUID, uuid4

from sqlalchemy.dialects.postgresql.json import JSONB
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.user import User


class ApiEnvironment(SQLModel, table = True):
    id: UUID  = Field(default_factory = uuid4, primary_key = True)
    name: str
    variables: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "api_environments")
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)

