from sqlmodel import SQLModel, Field, Relationship

from backend.helper.date import get_utc_now
from backend.model.user import User
from uuid import UUID, uuid4
from datetime import datetime

class File(SQLModel, table = True):
    id: UUID = Field(default = uuid4, primary_key = True)
    filename: str | None
    content_type: str | None
    size: int | None
    url: str | None
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "files")
    create_at: datetime  = Field(default_factory = get_utc_now)
