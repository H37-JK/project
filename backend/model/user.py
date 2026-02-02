from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship
from typing import List
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now


class User(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    email: EmailStr = Field(index = True)
    password: str
    name: str | None = Field(nullable = True)
    agents: List["Agent"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    monitors: List["Monitor"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    web_analyzes: List["WebAnalyze"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    api_environments: List["ApiEnvironment"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    api_collections: List["ApiCollection"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    api_requests: List["ApiRequest"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    api_request_histories: List["ApiRequestHistory"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    files: List["File"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    file_collections: List["FileCollection"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)

