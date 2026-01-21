from passlib.context import CryptContext

argon2 = CryptContext(schemes=["argon2"], deprecated="auto")

def encode_password(plain_password: str) -> str:
    return argon2.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return argon2.verify(plain_password, hashed_password)

