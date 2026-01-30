from typing import List, Dict, Any
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.api.api_collection import ApiCollection
from backend.model.user import User


class ApiRequest(SQLModel, table = True):
    id: UUID = Field(default = uuid4, primary_key = True)
    name: str
    method: str = Field(index = True)
    url: str
    headers: List[Dict[str, any]] = Field(default = [], sa_column = Column(JSONB))
    params: List[Dict[str, any]] = Field(default = [], sa_column =  Column(JSONB))
    body_type: str = Field(default = "none")
    body_content: Dict[str, Any] | None = Field(default = None, sa_column = Column(JSONB))
    auth_type: str = Field(default = "none")
    auth_content: Dict[str, Any] | None = Field(default = None, sa_column = Column(JSONB))
    user_id:  UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "api_requests")
    api_collection_id: str | None = Field(default = None, foreign_key = "api_collection.id", ondelete = "CASCADE")
    api_collection: ApiCollection | None = Relationship(back_populates = "api_requests")
    create_at: datetime  = Field(default_factory = get_utc_now)
    update_at: datetime  = Field(default_factory = get_utc_now)



