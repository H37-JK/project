from pydantic import BaseModel
from dataclasses import dataclass


@dataclass
class ResponseTableSchema(BaseModel):
    table_schema: str
    table_name: str
    table_type: str

@dataclass
class ResponseTableColumn(BaseModel):
    table_schema: str
    table_name: str
    column_name: str