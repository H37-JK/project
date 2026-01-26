from sqlmodel import SQLModel, Field, Relationship

from backend.model.user import User


class WebAnalyze(SQLModel, table = True):
    id: int | None = Field(default = None, primary_key = True)
    domain: str
    ip: str
    server_info: str | None
    server_status_info: str | None
    port_status_info: str | None
    headers_info: str | None
    whois_info: str | None
    ssl_info: str | None
    dns_record_info: str | None
    tech_stack_info: str | None
    user_id: int | None = Field(default = None, foreign_key = "user.id")
    user: User | None  = Relationship(back_populates = "WebAnalyzes")