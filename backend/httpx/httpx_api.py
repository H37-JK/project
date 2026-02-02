import httpx

client = httpx.AsyncClient()

async def get(url: str):
    response = await client.get(url)
    return response.json()


async def post(url: str, data: dict):
    return await client.post(url, data = data)


async def patch(url: str, data: dict):
    return await client.patch(url, data = data)


async def delete(url: str):
    return await client.delete(url)