from typing import Annotated

from fastapi import Header, HTTPException


async def get_token_header(x_token: Annotated[str, Header()]):
    if x_token != 'test':
        raise HTTPException(status_code = 400, detail = '토큰 값이 유효 하지 않습니다.')


async def get_query_token(token: str):
    if token != 'test':
        raise HTTPException(status_code = 400, detail = '토큰 값이 유효 하지 않습니다.')