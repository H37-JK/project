from typing import List, Dict, Any, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.api.api_collection import ApiCollection
from backend.model.user import User


class ApiRequest(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    name: str
    method: str = Field(index = True)
    url: str
    headers: List[Dict[str, Any]] = Field(default_factory = list, sa_column = Column(JSONB))
    params: List[Dict[str, Any]] = Field(default_factory = list, sa_column =  Column(JSONB))
    body_type: str | None = Field(default_factory = None)
    body_content: Dict[str, Any] | None = Field(default_factory = None, sa_column = Column(JSONB))
    auth_type: str | None = Field(default_factory = None)
    auth_content: Dict[str, Any] | None = Field(default_factory = None, sa_column = Column(JSONB))
    user_id:  UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "api_requests")
    api_collection_id: UUID | None = Field(default_factory = None, foreign_key = "apicollection.id", ondelete = "CASCADE")
    api_collection: ApiCollection | None = Relationship(back_populates = "api_requests")
    api_request_history: Optional["ApiRequestHistory"] = Relationship(back_populates = "api_request", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)



