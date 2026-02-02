from uuid import UUID
from datetime import datetime

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import Annotated

from backend.helper.date import get_utc_now
from backend.helper.server_info import extract_domain, extract_domain_https
from backend.model.api.api_request_history import ApiRequestHistory
from backend.model.user import User
from backend.passlib.jwt_token import get_current_user
from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model.api.api_request import ApiRequest
from backend.httpx.httpx_api import get, post, patch, delete, client
from backend.routers.api.api_request_history import create_api_request_history

router = APIRouter (
    prefix = "/api-request",
    tags = ["api-request"],
    responses = {404: {"description": "Nou Found"}},
    route_class = LoggingRoute,
)

def build_options(option_list):
    options = {}
    for option in option_list:
        if option.get("active", True) and option.get("key"):
            options[option["key"]] = option["value"]
    return options


@router.get("/get/api-requests")
async def get_api_requests (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    return session.exec(select(ApiRequest).where(ApiRequest.user_id == current_user.id)).all()


@router.get("/get/api-request/{id}")
async def get_api_request (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: int
):
    return session.exec(select(ApiRequest).where(ApiRequest.id == id, ApiRequest.user_id == current_user.id)).one_or_none()


@router.post("/call/api-request")
async def call_api_request (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    request_api_request: ApiRequest,
) -> ApiRequest:
    api_request: ApiRequest = session.exec(select(ApiRequest).where(ApiRequest.user_id == current_user.id, ApiRequest.id == request_api_request.id)).one_or_none()
    if not api_request:
      raise HTTPException(status_code = 404, detail = "Request not found")

    url = extract_domain_https(api_request.url)
    method = api_request.method
    headers = build_options(api_request.headers)
    params = build_options(api_request.params)


    request_args = {}
    if api_request.body_type == "json":
        request_args["json"] = api_request.body_content
    elif api_request.body_type == "x-www-form-urlencoded":
        request_args["data"] = api_request.body_content

    start_time = get_utc_now()
    response: httpx.Response | None = None
    response_body = None
    response_headers = None
    response_data = None
    response_size = 0
    status_code = 0
    error_message = None

    try:
        client.headers = headers
        client.params = params
        client.timeout = 10.0
        request = client.build_request(method.upper(), url, **request_args)
        response = await client.send(request, follow_redirects = True)
        response.raise_for_status()

        status_code = response.status_code
        response_size = len(response.content)
        response_headers = dict(response.headers)
        try:
            response_body = response.json()
        except Exception:
            response_body = {"raw_content": response.text}
    except httpx.RequestError as e:
        error_message = {"error": f"Request failed: {e.__class__.__name__}", "detail": str(e)}
        raise HTTPException(status_code = 500, detail = error_message)
    except Exception as e:
        error_message = {"error": f"An unexpected error occurred: {e.__class__.__name__}", "detail": str(e)}
        raise HTTPException(status_code = 500, detail = error_message)
    finally:
        end_time = get_utc_now()
        duration_ms = int((end_time - start_time).total_seconds() * 1000)

    update_data = request_api_request.model_dump(exclude_unset = True)
    api_request.sqlmodel_update(update_data)

    api_request_history = ApiRequestHistory(
        method = method.upper(),
        url = url,
        header_sent = headers,
        body_sent = request_args.get("json") or request_args.get("data"),
        status_code = status_code,
        duration_ms = duration_ms,
        response_size = response_size,
        response_body = response_body,
        response_headers = response_headers,
        error_message = error_message,
        api_request_id = api_request.id,
        api_collection_id = None,
        user_id = current_user.id
    )

    try:
        session.add(api_request)
        session.add(api_request_history)
        session.commit()
        session.refresh(api_request)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code = 500, detail = f"DataBase Error: {e}")

    return api_request



@router.post("/create/api-request")
async def create_api_request (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_request: ApiRequest,
) -> ApiRequest:
    api_request.user_id = current_user.id
    api_request.api_collection_id = None
    session.add(api_request)
    session.commit()
    session.refresh(api_request)

    return api_request


@router.patch("/update/api-request/{id}")
async def update_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    request_api_request: ApiRequest,
    id: UUID
) -> ApiRequest:
    api_request = session.exec(select(ApiRequest).where(ApiRequest.user_id == current_user.id, ApiRequest.id == id)).one_or_noe()
    if not api_request:
        raise HTTPException(status_code = 404, detail = "Request not found")

    update_data = request_api_request.model_dump(exclude_unset = True)
    api_request.sqlmodel_update(update_data)

    session.add(api_request)
    session.commit()
    session.refresh(api_request)

    return api_request


@router.delete("/delete/api-request/{id}")
async def delete_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    api_request = session.exec(select(ApiRequest).where(ApiRequest.user_id == current_user.id, ApiRequest.id == id)).one_or_noe()
    if not api_request:
        raise HTTPException(status_code = 404, detail = "Request not found")

    session.delete(api_request)
    session.commit()

    return None