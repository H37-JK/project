from pydantic import EmailStr, AfterValidator
from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING, Annotated
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now
import re


if TYPE_CHECKING:
    from backend.model.agent.agent import Agent
    from backend.model.monitor.monitor import Monitor
    from backend.model.web_analyze.web_analyze import WebAnalyze
    from backend.model.api.api_environment import ApiEnvironment
    from backend.model.api.api_collection import ApiCollection
    from backend.model.api.api_request import ApiRequest
    from backend.model.api.api_request_history import ApiRequestHistory
    from backend.model.file.file import File
    from backend.model.file.file_collection import FileCollection
    from backend.model.database.database_server_info import DatabaseServerInfo


def validate_password(value: str) -> str:
    has_letter = re.search(r"[a-zA-Z]", value)
    has_digit = re.search(r"\d", value)
    if not has_letter or not has_digit:
        raise ValueError("비밀번호는 영문자와 숫자를 최소 한 개씩 포함해야 합니다.")
    return value

passwordStr = Annotated [
    str,
    Field(min_length = 6),
    AfterValidator(validate_password)
]

def validate_name(value: str) -> str:
    has_str = re.search(r"^[a-zA-Z가-힣0-9]+$", value)
    if not has_str:
        raise ValueError("이름은 한글이나 영문, 숫자만 가능 합니다.")
    return value

nameStr = Annotated [
    str,
    Field(min_length = 2, max_length = 10),
    AfterValidator(validate_name)
]



class User(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    email: EmailStr = Field(index = True, unique = True, max_length = 50)
    password: passwordStr | None = Field(default = None)
    name: nameStr = Field(unique = True)
    provider: str | None = Field(default = None)
    provider_id: str | None = Field(default = None)
    agents: List["Agent"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    monitors: List["Monitor"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    web_analyzes: List["WebAnalyze"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    api_environments: List["ApiEnvironment"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    api_collections: List["ApiCollection"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    api_requests: List["ApiRequest"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    api_request_histories: List["ApiRequestHistory"] = Relationship(back_populates= "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    files: List["File"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    file_collections: List["FileCollection"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    database_server_infos: List["DatabaseServerInfo"] = Relationship(back_populates = "user", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    login_at: datetime   = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)



class UserCreate(SQLModel):
    email: EmailStr = Field(max_length = 50)
    password: passwordStr
    name: nameStr


class UserCreateResponse(SQLModel):
    id: UUID
    email: EmailStr
    password: passwordStr
    name: nameStr
    create_at: datetime


class UserUpdate(SQLModel):
    email: EmailStr | None = Field(default = None, max_length = 50)
    password: passwordStr | None = Field(default = None)
    name: nameStr | None = Field(default = None)


class UserUpdateResponse(SQLModel):
    id: UUID
    email: EmailStr
    password: passwordStr
    name: nameStr
    update_at: datetime