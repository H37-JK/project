from sqlalchemy import Column
from sqlmodel import SQLModel, Field, Relationship
from typing import Dict, Any
from backend.model.user.user import User
from sqlalchemy.dialects.postgresql.json import JSONB
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now

class WebAnalyze(SQLModel, table = True):
    __tablename__ = "web_analyze"
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    domain: str
    ip: str | None = Field(default = None)
    server_info: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    server_status_info: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    port_status_info: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    headers_info: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    whois_info: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    ssl_info: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    dns_record_info: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    tech_stack_info: Dict[str, Any] = Field(default_factory = dict, sa_column = Column(JSONB))
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "web_analyzes")
    create_at: datetime  = Field(default_factory = get_utc_now)


class WebAnalyzeCreate(SQLModel):
    domain: str


class WebAnalyzeCreateResponse(SQLModel):
    id: UUID
    domain: str
    ip: str | None = Field(default = None)
    server_info: Dict[str, Any] = Field(default_factory = dict)
    server_status_info: Dict[str, Any] = Field(default_factory = dict)
    port_status_info: Dict[str, Any] = Field(default_factory = dict)
    headers_info: Dict[str, Any] = Field(default_factory = dict)
    whois_info: Dict[str, Any] = Field(default_factory = dict)
    ssl_info: Dict[str, Any] = Field(default_factory = dict)
    dns_record_info: Dict[str, Any] = Field(default_factory = dict)
    tech_stack_info: Dict[str, Any] = Field(default_factory = dict)
    create_at: datetime