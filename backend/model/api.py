from typing import Dict, Any

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlmodel import SQLModel, Field


class API(SQLModel, table = True):
    id: int | None = Field(default = None, primary_key = True)
    url: str
    method: str
    headers: Dict[str, Any] = Field(sa_column = Column(JSONB))
    body: str | None