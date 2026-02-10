from typing import List, Dict, Any, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.api.api_collection import ApiCollection
from backend.model.user.user import User


class ApiRequest(SQLModel, table = True):
    __tablename__ = "api_request"
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    name: str = Field(default = "none", max_length = 50)
    method: str | None = Field(default = None, index = True, max_length = 50)
    url: str | None = Field(default = None, max_length = 50)
    headers: List[Dict[str, Any]] = Field(default_factory = list, sa_column = Column(JSONB))
    params: List[Dict[str, Any]] = Field(default_factory = list, sa_column =  Column(JSONB))
    body_type: str | None = Field(default = None, max_length = 50)
    body_content: Dict[str, Any] | None = Field(default = None, sa_column = Column(JSONB))
    auth_type: str | None = Field(default = None, max_length = 50)
    auth_content: Dict[str, Any] | None = Field(default = None, sa_column = Column(JSONB))
    user_id:  UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "api_requests")
    api_collection_id: UUID | None = Field(default = None, foreign_key = "api_collection.id", ondelete = "CASCADE")
    api_collection: ApiCollection | None = Relationship(back_populates = "api_requests")
    api_request_history: Optional["ApiRequestHistory"] = Relationship(back_populates = "api_request", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)


class ApiRequestCreate(SQLModel):
    name: str = Field(default = "none", max_length = 50)


class ApiRequestCreateResponse(SQLModel):
    id: UUID
    name: str
    create_at: datetime = Field(default_factory= get_utc_now)


class ApiRequestCall(SQLModel):
    id: UUID
    method: str = Field(max_length = 50)
    url: str = Field(max_length = 50)
    headers: List[Dict[str, Any]]  = Field(default_factory = list)
    params: List[Dict[str, Any]] = Field(default_factory = list)
    body_type: str | None = Field(default = None, max_length = 50)
    body_content: Dict[str, Any] | None = Field(default = None)
    auth_type: str | None = Field(default = None, max_length = 50)
    auth_content: Dict[str, Any] | None = Field(default = None)




