from sqlmodel import SQLModel, Field, Relationship

from backend.helper.date import get_utc_now
from backend.model.file.file_collection import FileCollection
from backend.model.user.user import User
from uuid import UUID, uuid4
from datetime import datetime

class File(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    filename: str | None = Field(default = None)
    content_type: str | None = Field(default = None)
    size: int | None = Field(default = None)
    url: str | None = Field(default = None)
    file_collection_id: UUID | None = Field(default = None, foreign_key = "file_collection.id", ondelete = "CASCADE")
    file_collection: FileCollection = Relationship(back_populates = "files")
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "files")
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)


class FileCreateResponse(SQLModel):
    id: UUID
    filename: str | None = Field(default = None)
    content_type: str | None = Field(default = None)
    size: int | None = Field(default = None)
    url: str | None = Field(default = None)
    file_collection_id: UUID | None = Field(default = None)
    create_at: datetime


class FileUpdate(SQLModel):
    filename: str | None = Field(default = None)
    file_collection_id: UUID | None = Field(default = None)


class FileUpdateResponse(SQLModel):
    id: UUID
    filename: str | None = Field(default = None)
    content_type: str | None = Field(default = None)
    size: int | None = Field(default = None)
    url: str | None = Field(default = None)
    file_collection_id: UUID | None = Field(default = None)
    update_at: datetime