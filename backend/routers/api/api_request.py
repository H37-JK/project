from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, desc
from typing import Annotated, Union, Dict, Any, List

from backend.helper.date import get_utc_now
from backend.helper.server_info import extract_domain_https
from backend.model.api.api_request_history import ApiRequestHistory, ApiRequestHistoryResponse
from backend.model.user.user import User
from backend.passlib.jwt_token import get_current_user
from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model.api.api_request import ApiRequest, ApiRequestCreateResponse, ApiRequestCreate, ApiRequestCall, \
    ApiRequestUpdate
from backend.httpx.httpx_api import client

router = APIRouter (
    tags = ["api-request"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute,
)

def build_options(option_list):
    options = {}
    for option in option_list:
        if option.get("active", True) and option.get("key"):
            options[option["key"]] = option["value"]
    return options

def ensure_list_of_dicts(v: Union[None, Dict[str, Any], List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    if v is None:
        return []
    if isinstance(v, list):
        return v
    if isinstance(v, dict):
        return [v]
    raise TypeError(f"response_headers must be list[dict], got {type(v)}")

@router.get("/get/tab-active-api-requests")
async def get_api_requests (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    return session.exec(select(ApiRequest).where(ApiRequest.user_id == current_user.id, ApiRequest.tab_active == True).order_by(ApiRequest.create_at)).all()

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
    id: UUID
):
    return session.exec(select(ApiRequest).where(ApiRequest.id == id, ApiRequest.user_id == current_user.id)).one_or_none()


@router.post("/call/api-request", response_model = ApiRequestHistoryResponse)
async def call_api_request (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_request_call: ApiRequestCall,
):
    api_request: ApiRequest = session.exec(select(ApiRequest).where(ApiRequest.user_id == current_user.id, ApiRequest.id == api_request_call.id)).one_or_none()
    if not api_request:
      raise HTTPException(status_code = 404, detail = "해당 API가 존재하지 않습니다.")

    url = extract_domain_https(api_request_call.url)
    method = api_request_call.method
    headers = build_options(api_request_call.headers)
    params = build_options(api_request_call.params)


    request_args = {}
    if api_request_call.body_type == "application/json":
        request_args["json"] = api_request_call.body_content
    elif api_request_call.body_type == "x-www-form-urlencoded":
        request_args["data"] = api_request_call.body_content

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
    except httpx.HTTPStatusError as error:
        status_code = error.response.status_code
        try:
            error_detail = error.response.json()
        except:
            error_detail = error.response.text
        error_message= {"에러": f"{error.__class__.__name__}", "메시지": str(error_detail), "상태 코드": status_code}
    except httpx.RequestError as error:
        error_message = {"에러": f"Request failed: {error.__class__.__name__}", "detail": str(error), "상태 코드": 500}
    finally:
        end_time = get_utc_now()
        duration_ms = int((end_time - start_time).total_seconds() * 1000)

    update_data = api_request_call.model_dump(exclude_unset = True, exclude_none = True)
    api_request.sqlmodel_update(update_data)

    api_request_history = ApiRequestHistory (
        method = method.upper(),
        url = url,
        header_sent = headers,
        body_sent = request_args.get("json") or request_args.get("data"),
        status_code = status_code,
        duration_ms = duration_ms,
        response_size = response_size,
        response_body = ensure_list_of_dicts(response_body),
        response_headers = ensure_list_of_dicts(response_headers),
        error_message = error_message,
        api_request_id = api_request.id,
        api_collection_id = None,
        user_id = current_user.id
    )

    session.add(api_request)
    session.add(api_request_history)
    session.commit()
    session.refresh(api_request)
    session.refresh(api_request_history)

    return api_request_history



@router.post("/create/api-request", response_model = ApiRequestCreateResponse)
async def create_api_request (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_request_create: ApiRequestCreate,
):
    api_request = ApiRequest.model_validate (
        api_request_create,
        update={
            "user_id": current_user.id,
            "api_collection_id": None
        }
    )
    session.add(api_request)
    session.commit()
    session.refresh(api_request)

    return api_request

@router.patch("/update/api-request/{id}")
async def update_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    update_api_request: ApiRequestUpdate,
    id: UUID
) -> ApiRequest:
    api_request = session.exec(select(ApiRequest).where(ApiRequest.user_id == current_user.id, ApiRequest.id == id)).one_or_none()
    if not api_request:
        raise HTTPException(status_code = 404, detail = "Request not found")

    update_data = update_api_request.model_dump(exclude_unset = True, exclude_none = True)
    api_request.sqlmodel_update(update_data)
    print(api_request)

    session.add(api_request)
    session.commit()
    session.refresh(api_request)

    return api_request

@router.delete("/delete/api-request/{id}")
async def delete_api_request (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    api_request = session.exec(select(ApiRequest).where(ApiRequest.user_id == current_user.id, ApiRequest.id == id)).one_or_none()
    if not api_request:
        raise HTTPException(status_code = 404, detail = "해당 API가 존재하지 않습니다.")

    session.delete(api_request)
    session.commit()

    return True


