from typing import Union
from pydantic import BaseModel
from dataclasses import dataclass

@dataclass
class FormData(BaseModel):
    email: str
    password: str
    model_config = {"extra": "forbid"}