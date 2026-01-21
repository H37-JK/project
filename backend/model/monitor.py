
from sqlmodel import SQLModel, Field, Relationship
from backend.model.user import User


class Monitor(SQLModel, table = True):
    id: int | None = Field(default = None, primary_key = True)
    host: str
    port: int
    username: str
    password: str | None
    key: str | None
    result: str | None
    user_id: int | None = Field(default = None, foreign_key = "user.id")
    user: User | None = Relationship(back_populates = "monitors")