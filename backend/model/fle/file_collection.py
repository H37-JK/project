from uuid import UUID, uuid4
from typing import List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.user import User


class FileCollection(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    name: str
    parent_id: UUID | None = Field(default_factory = None, foreign_key = "filecollection.id")
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "file_collections")
    files: List["File"] = Relationship(back_populates = "file_collection", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)
