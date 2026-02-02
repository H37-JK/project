from sqlmodel import SQLModel, Field, Relationship
from typing import Dict, Any
from backend.model.user import User
from sqlalchemy.dialects.postgresql.json import JSONB
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now

class WebAnalyze(SQLModel, table = True):
    id: UUID = Field(default_factory = uuid4, primary_key = True)
    domain: str
    ip: str
    server_info: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    server_status_info: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    port_status_info: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    headers_info: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    whois_info: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    ssl_info: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    dns_record_info: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    tech_stack_info: Dict[str, Any] = Field(default_factory = dict, sa_type = JSONB)
    user_id: UUID = Field(foreign_key = "user.id", ondelete = "CASCADE")
    user: User = Relationship(back_populates = "web_analyzes")
    create_at: datetime  = Field(default_factory = get_utc_now)
