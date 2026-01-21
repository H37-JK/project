from sqlmodel import SQLModel, Field


class DB(SQLModel, table = True):
    id: int = Field(primary_key =  True)
    table_schema: str = Field(nullable = False)
    table_name: str = Field(nullable = False)
    table_type: str = Field(nullable = False)
