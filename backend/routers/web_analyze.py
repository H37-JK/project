import asyncio
import json
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic.v1 import UUID1
from sentry_sdk.utils import json_dumps
from sqlmodel import select

from backend.db.engine import SessionDep
from backend.helper.server_info import extract_domain, get_server_info, get_ssl_info, get_headers_info, get_whois_info, \
    get_dns_records_info, get_server_status_info, get_port_status_info, get_tech_stack_info
from backend.logs.logging_route import LoggingRoute
from backend.model.user import User
from backend.model.web_analyze import WebAnalyze
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    prefix = "/web-analyze",
    tags = ["/web-analyze"],
    responses = {404: {"description" : "Not Found"}},
    route_class = LoggingRoute,
)

@router.get("/get/web-analyzes")
async def get_web_analyzes (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id)).all()


@router.get("/get/web-analyze/{id}")
async def get_web_analyze (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    return session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id, WebAnalyze.id == id)).one_or_noe()


@router.post("/create/web-analyze")
async def create_web_analyze (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    web: WebAnalyze,
):
    domain = extract_domain(web.domain)
    results = await asyncio.gather (
        get_server_info(domain),
        get_headers_info(domain),
        get_ssl_info(domain),
        get_dns_records_info(domain),
        get_server_status_info(domain),
        get_port_status_info(domain),
        get_tech_stack_info(domain),
        get_whois_info(domain),
    )

    exist_web = session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id, WebAnalyze.domain == domain)).one_or_none()
    if exist_web is not None:
        web = exist_web

    web.user_id = current_user.id
    web.domain = domain
    web.ip = results[0].get("query", "Unknown")
    web.server_info = results[0]
    web.headers_info = results[1]
    web.ssl_info = results[2]
    web.dns_record_info = results[3]
    web.server_status_info = results[4]
    web.port_status_info = results[5]
    web.tech_stack_info = results[6]
    web.whois_info = results[7]

    session.add(web)
    session.commit()
    session.refresh(web)

    return web


@router.patch("/update/web-analyze/{id}")
async def update_web_analyze (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    request_web_analyze: WebAnalyze,
    id: UUID
) -> WebAnalyze:
    web_analyze = session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id, WebAnalyze.id == id)).one_or_noe()
    if not web_analyze:
        raise HTTPException(status_code = 404, detail = "Request not found")

    update_data = request_web_analyze.model_dump(exclude_unset = True)
    web_analyze.sqlmodel_update(update_data)

    session.add(web_analyze)
    session.commit()
    session.refresh(web_analyze)

    return web_analyze


@router.delete("/delete/web-analyze/{id}")
async def delete_web_analyze (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    web_analyze = session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id, WebAnalyze.id == id)).one_or_noe()
    if not web_analyze:
        raise HTTPException(status_code = 404, detail = "Request not found")

    session.delete(web_analyze)
    session.commit()

    return None
