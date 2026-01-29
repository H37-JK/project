from sqlmodel import SQLModel, Field, Relationship
from typing import Dict, Any
from backend.model.user import User
from sqlalchemy.dialects.postgresql.json import JSONB


class WebAnalyze(SQLModel, table = True):
    id: int | None = Field(default = None, primary_key = True)
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
    user_id: int | None = Field(default = None, foreign_key = "user.id")
    user: User | None  = Relationship(back_populates = "webAnalyzes")