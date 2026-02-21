from uuid import UUID, uuid4
from typing import Dict, Any, List

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model.api.api_request import ApiRequest
from backend.model.user.user import User


class ApiRequestHistory(SQLModel, table = True):
    __tablename__ = "api_request_history"
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    method: str
    url: str
    header_sent: Dict[str, Any] | None = Field(default = None, sa_column = Column(JSONB))
    body_sent: Dict[str, Any] | None= Field(default = None, sa_column = Column(JSONB))
    status_code: int
    duration_ms: int
    response_size: int
    response_body: List[Dict[str, Any]] = Field(default_factory = list, sa_column =  Column(JSONB))
    response_headers: List[Dict[str, Any]] = Field(default_factory = list, sa_column =  Column(JSONB))
    error_message: Dict[str, Any] | None = Field(default = None, sa_column =  Column(JSONB))
    api_request_id: UUID = Field(foreign_key = "api_request.id", ondelete = "CASCADE")
    api_request: ApiRequest = Relationship(back_populates = "api_request_history")
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "api_request_histories")
    create_at: datetime  = Field(default_factory = get_utc_now)


class ApiRequestHistoryResponse(SQLModel):
    method: str
    url: str
    header_sent: Dict[str, Any] | None = Field(default = None)
    body_sent: Dict[str, Any] | None = Field(default = None)
    status_code: int
    duration_ms: int
    response_size: int
    response_body: List[Dict[str, Any]] = Field(default_factory = list, sa_column =  Column(JSONB))
    response_headers: List[Dict[str, Any]] = Field(default_factory = list, sa_column =  Column(JSONB))
    error_message: Dict[str, Any] | None = Field(default = None)

