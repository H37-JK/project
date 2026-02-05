from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from backend.helper.date import get_utc_now
from backend.model import User
from backend.model.database.database_info import DatabaseInfo
from backend.model.database.database_server_info import DatabaseServerInfo



class TableInfo(SQLModel, table = True):
    __tablename__ = "table_info"
    id: UUID | None = Field(default_factory = uuid4, primary_key = True)
    table_name: str
    database_info_id: UUID = Field(foreign_key = "database_info.id", ondelete = "CASCADE")
    database_info: DatabaseInfo = Relationship(back_populates = "table_infos")
    create_at: datetime  = Field(default_factory = get_utc_now)

