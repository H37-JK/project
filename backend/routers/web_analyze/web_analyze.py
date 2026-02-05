import asyncio
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from backend.db.engine import SessionDep
from backend.helper.server_info import extract_domain, get_server_info, get_ssl_info, get_headers_info, get_whois_info, \
    get_dns_records_info, get_server_status_info, get_port_status_info, get_tech_stack_info
from backend.logs.logging_route import LoggingRoute
from backend.model.user.user import User
from backend.model.web_analyze.web_analyze import WebAnalyze, WebAnalyzeCreateResponse, WebAnalyzeCreate
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    tags = ["/web-analyze"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
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
    return session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id, WebAnalyze.id == id)).one_or_none()


@router.post("/create/web-analyze", response_model = WebAnalyzeCreateResponse)
async def create_web_analyze (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    web_analyze_create: WebAnalyzeCreate,
):
    domain = extract_domain(web_analyze_create.domain)
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

    web_analyze = WebAnalyze.model_validate (
        web_analyze_create,
        update = {
            "user_id": current_user.id
        }
    )

    exist_web = session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id, WebAnalyze.domain == domain)).one_or_none()
    if exist_web is not None:
        web = exist_web

    web_analyze.user_id = current_user.id
    web_analyze.domain = domain
    web_analyze.ip = results[0].get("query", "none")
    web_analyze.server_info = results[0]
    web_analyze.headers_info = results[1]
    web_analyze.ssl_info = results[2]
    web_analyze.dns_record_info = results[3]
    web_analyze.server_status_info = results[4]
    web_analyze.port_status_info = results[5]
    web_analyze.tech_stack_info = results[6]
    web_analyze.whois_info = results[7]

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
    web_analyze = session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id, WebAnalyze.id == id)).one_or_none()
    if not web_analyze:
        raise HTTPException(status_code = 404, detail = "해당 웹분석이 존재 하지 않습니다.")

    session.delete(web_analyze)
    session.commit()

    return True



# @router.patch("/update/web-analyze/{id}")
# async def update_web_analyze (
#     session: SessionDep,
#     current_user: Annotated[User, Depends(get_current_user)],
#     request_web_analyze: WebAnalyze,
#     id: UUID
# ) -> WebAnalyze:
#     web_analyze = session.exec(select(WebAnalyze).where(WebAnalyze.user_id == current_user.id, WebAnalyze.id == id)).one_or_none()
#     if not web_analyze:
#         raise HTTPException(status_code = 404, detail = "해당 웹분석이 존재 하지 않습니다.")
#
#     update_data = request_web_analyze.model_dump(exclude_unset = True)
#     web_analyze.sqlmodel_update(update_data)
#
#     session.add(web_analyze)
#     session.commit()
#     session.refresh(web_analyze)
#
#     return web_analyze