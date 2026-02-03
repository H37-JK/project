import asyncio
import asyncssh
from sqlmodel import select

from backend.celery.tasks import save_monitor_result_task
from backend.db.engine import get_context_session
from backend.model import User, Agent, Monitor, WebAnalyze, ApiEnvironment, ApiCollection, ApiRequest, ApiRequestHistory, File, FileCollection


async def run_collector_for_server(server):
    connect_args = {
        'host': server.host,
        'port': server.port,
        'username': server.username,
        'known_hosts': None,
        'connect_timeout': 5
    }
    if server.password:
        connect_args['password'] = server.password
    elif server.key_path:
        connect_args['client_keys'] = server.key_path
    else:
        return  {"status": "error", "msg": "인증 정보 없음"}
    while True:
        try:
            async with asyncssh.connect(**connect_args) as conn:
                cmd_disk = await conn.run("df -h / | tail -1 | awk '{print $5}'", timeout = 10)
                cmd_cpu = await conn.run("cat /proc/loadavg | awk '{print $1}'", timeout = 10)

                result =  {
                    "host": server.host,
                    "status": "success",
                    "disk": cmd_disk.stdout.strip(),
                    "cpu_load": cmd_cpu.stdout.strip()
                }
                save_monitor_result_task.delay(result)
                await asyncio.sleep(5)
        except Exception as e:
             error_data = {"host": server.host, "status": "error", "msg": str(e)}
             save_monitor_result_task().delay(error_data)
             await asyncio.sleep(10)

async def main():
    with get_context_session() as session:
        servers = session.exec(select(Monitor)).all()
    collect_tasks = [run_collector_for_server(server) for server in servers]
    await asyncio.gather(*collect_tasks)


if __name__ == "__main__":
    asyncio.run(main())
