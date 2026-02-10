from uuid import UUID

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str
    id: UUID
    email: EmailStr

class TokenData(BaseModel):
    id: int