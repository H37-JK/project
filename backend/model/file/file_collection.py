from uuid import UUID, uuid4
from typing import List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.user.user import User


class FileCollection(SQLModel, table = True):
    __tablename__ = "file_collection"
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    name: str
    parent_id: UUID | None = Field(default = None, foreign_key = "file_collection.id", ondelete = "CASCADE")
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "file_collections")
    files: List["File"] = Relationship(back_populates = "file_collection", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)


class FileCollectionCreate(SQLModel):
    name: str
    parent_id: UUID | None = Field(default = None)


class FileCollectionCreateResponse(SQLModel):
    id: UUID
    name: str
    parent_id: UUID | None = Field(default = None)
    create_at: datetime


class FileCollectionUpdate(SQLModel):
    name: str | None = Field(default = None)
    parent_id: UUID | None = Field(default = None)


class FileCollectionUpdateResponse(SQLModel):
    id: UUID
    name: str
    parent_id: UUID | None = Field(default = None)
    update_at: datetime