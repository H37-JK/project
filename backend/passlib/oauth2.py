from fastapi.security import OAuth2PasswordBearer
from fastapi import Request

class OAuth2PasswordBearerWithCookie(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> str | None:
        header_authorization = request.headers.get("Authorization")
        if header_authorization:
            schema, _, param = header_authorization.partition(" ")
            if schema.lower() == "bearer":
                return param

        token_from_cookie = request.cookies.get("access_token")
        if token_from_cookie:
            return token_from_cookie

        return await super().__call__(request)




oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl = "/login")