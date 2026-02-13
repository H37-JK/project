from uuid import UUID, uuid4
from typing import List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.user.user import User

class ApiCollection(SQLModel, table = True):
    __tablename__ = "api_collection"
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    name: str = Field(default = "Untitled", max_length = 50)
    parent_id: UUID | None = Field(default = None, foreign_key = "api_collection.id", ondelete = "CASCADE")
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "api_collections")
    api_requests: List["ApiRequest"] = Relationship(back_populates = "api_collection", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)


class ApiCollectionCreate(SQLModel):
    name: str = Field(default = "Untitled",max_length = 50)
    parent_id: UUID | None = Field(default = None)


class ApiCollectionCreateResponse(SQLModel):
    id: UUID
    name: str
    parent_id: UUID | None = Field(default = None)
    create_at: datetime


class ApiCollectionUpdate(SQLModel):
    name: str | None = Field(default = None, max_length = 50)
    parent_id: UUID | None = Field(default = None)


class ApiCollectionUpdateResponse(SQLModel):
    id: UUID
    name: str
    parent_id: UUID = Field(default = None)
    update_at: datetime

