import uuid
import time

from fastapi.responses import StreamingResponse, FileResponse
from fastapi import FastAPI, Request, Response
from backend.logs.logs import logger
from typing import Callable, Coroutine, Any

from fastapi.routing import APIRoute

class LoggingRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            request_id = str(uuid.uuid4())
            with logger.contextualize(request_id = request_id):
                start_time = time.time()
                logger.info(f"요청 시작 | {request.method} {request.url.path}")
                logger.info(f"  > 클라이언트 IP: {request.client.host}")
                logger.info(f"  > 파라미터: {request.query_params}")

                response = await original_route_handler(request)

                process_time = (time.time() - start_time) * 1000
                formatted_process_time = f'{process_time:.2f}ms'

                if isinstance(response, (StreamingResponse, FileResponse)):
                    logger.info("  < 응답 본문: (스트리밍 응답 이므로 내용 로깅 안 함)")
                else:
                    response_body = b""
                    if hasattr(response, "body"):
                        response_body = response.body
                    elif hasattr(response, "body_iterator"):
                        async for chunk in response.body_iterator:
                            response_body += chunk
                        
                        response = Response (
                            content = response_body,
                            status_code = response.status_code,
                            headers = dict(response.headers),
                            media_type = response.media_type
                        )

                    try:
                        logged_body = response_body.decode("utf-8")
                    except UnicodeDecodeError:
                        logged_body = "(바이너리 응답이므로 디코딩 불가)"

                    if logged_body:
                        logger.info(f"  < 응답 본문: {logged_body}")
                    else:
                        logger.info(f"  < 응답 본문: (내용 없음)")
                
                logger.info(f"요청 완료 | 상태 코드: {response.status_code} | 처리 시간: {formatted_process_time}")
                return response
        return custom_route_handler