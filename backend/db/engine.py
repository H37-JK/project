import os
from contextlib import contextmanager
from dotenv import load_dotenv
from typing import Annotated
from fastapi import Depends
from sqlmodel import create_engine, SQLModel, Session

load_dotenv()

# 데이터베이스 정보 가져 오기
def get_engine():
    sql_url = os.getenv("DATABASE_URL")
    return create_engine(sql_url)

# 메타 데이터로 테이블 생성
def create_db_and_tables():
    SQLModel.metadata.create_all(get_engine())

def get_remote_engine(sql_url):
    return create_engine(sql_url)

# 세션 가져 오기
def get_session():
    with Session(get_engine()) as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

def get_remote_session(sql_url):
    with Session(get_remote_engine(sql_url)) as session:
        yield session

@contextmanager
def get_context_session():
    with Session(get_engine()) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
remoteSessionDep = Annotated[Session, Depends(get_remote_session)]
