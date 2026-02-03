from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship
from typing import List
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now


class User(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    email: EmailStr = Field(index = True, unique = True)
    password: str
    name: str
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
    update_at: datetime  = Field(default_factory = get_utc_now)


class UserCreate(SQLModel):
    email: EmailStr
    password: str
    name: str


class UserCreateResponse(SQLModel):
    id: UUID
    email: EmailStr
    password: str
    name: str
    create_at: datetime


class UserUpdate(SQLModel):
    email: EmailStr | None = Field(default = None)
    password: str | None = Field(default = None)
    name: str | None = Field(default = None)


class UserUpdateResponse(SQLModel):
    id: UUID
    email: EmailStr
    password: str
    name: str
    update_at: datetime