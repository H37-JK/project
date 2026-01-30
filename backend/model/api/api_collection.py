from uuid import UUID, uuid4
from typing import List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.user import User

class ApiCollection(SQLModel, table = True):
    id: UUID = Field(default = uuid4, primary_key = True),
    name: str
    parent_id: UUID | None = Field(default = None, foreign_key = "collection.id")
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "api_collections")
    api_requests: List["ApiRequest"] = Relationship(back_populates = "api_collection", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)

