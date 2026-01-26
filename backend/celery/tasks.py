import asyncio
import json

import asyncssh
from sqlmodel import select

from backend.model.monitor import Monitor
from backend.db.engine import SessionDep, get_context_session
from backend.celery.celery_config import app
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


async def _async_monitor(host, port, username, password, key_path):
    connect_args = {
        'host': host,
        'port': port,
        'username': username,
        'known_hosts': None,
        'connect_timeout': 5
    }

    if password:
        connect_args['password'] = password
    elif key_path:
        connect_args['client_keys'] = [key_path]
    else:
        return {"status": "error", "msg": "인증 정보 없음"}

    try:
        async with asyncssh.connect(**connect_args) as conn:
            cmd_disk = await conn.run("df -h / | tail -1 | awk '{print $5}'", timeout = 10)
            cmd_cpu = await conn.run("cat /proc/loadavg | awk '{print $1}'", timeout = 10)

            return {
                "host": host,
                "status": "success",
                "disk": cmd_disk.stdout.strip(),
                "cpu_load": cmd_cpu.stdout.strip()
            }
    except Exception as e:
        return {"host": host, "status": "error", "msg": str(e)}

@app.task
def monitor_server_task(host, port, username, password = None, key_path = None):
    try:
        result = asyncio.run(_async_monitor(host, port, username, password, key_path))
        with get_context_session() as session:

            if result.get("status") == "success":
                server = session.exec(select(Monitor).where(Monitor.host == host)).one_or_none()
                if server:
                   server.result = json.dumps(result)
                   session.add(server)
                   session.commit()
        return result
    except Exception as e:
        return {"status": "critical_error", "msg": str(e)}

@app.task
def schedule_monitoring_tasks():
    with get_context_session() as session:
        servers = session.exec(select(Monitor)).all()
        for server in servers:
            monitor_server_task.delay (
                host = server.host,
                port = server.port,
                username = server.username,
                password = server.password,
                key_path = server.key,
            )

@app.task
def save_monitor_result_task(result: dict):
    host = result.get("host")
    if not host:
        return

    with get_context_session() as session:
        server = session.exec(select(Monitor).where(Monitor.host == host)).one_or_none()
        if server:
            server.result = json.dumps(result)
            session.add(server)
            session.commit()