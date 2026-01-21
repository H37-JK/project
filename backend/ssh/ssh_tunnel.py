from sshtunnel import SSHTunnelForwarder
import pymssql

ssh_host = ''
ssh_port = ''
ssh_user = ''
ssh_password = ''

db_host = ''
db_user = ''
db_password = ''

with SSHTunnelForwarder (
    (ssh_host, ssh_port),
    ssh_username = ssh_user,
    ssh_private_key_password = ssh_password,
    remote_bind_address=(db_host, 1433)
) as tunnel:
    print(f"로컬 포트: {tunnel.local_bind_port}")

    conn = pymssql.connect (
        server = '127.0.0.1',
        port = tunnel.local_bind_port,
        user = db_user,
        password = db_password,
        database = ''
    )

    cursor = conn.cursor(as_dict = True)
    cursor.execute("")
