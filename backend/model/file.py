from sqlmodel import SQLModel, Field, Relationship

from backend.model.user import User


class File(SQLModel, table = True):
    id: int | None = Field(default = None, primary_key = True)
    filename: str | None
    content_type: str | None
    size: int | None
    url: str | None
    user_id: int | None = Field(default = None, foreign_key = "user.id")
    user: User | None = Relationship(back_populates = "files")