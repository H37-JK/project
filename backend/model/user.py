from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship
from typing import List



class User(SQLModel, table = True):
    id: int | None = Field(default = None, primary_key = True)
    email: EmailStr = Field(index = True)
    password: str
    name: str | None = Field(nullable = True)
    agents: List["Agent"] = Relationship(back_populates = "user")
    monitors: List["Monitor"] = Relationship(back_populates = "user")
    webAnalyzes: List["WebAnalyze"] = Relationship(back_populates= "user")
    files: List["File"] = Relationship(back_populates = "user")
