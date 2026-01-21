import httpx


async def get(url: str, params: dict = None):
    async with httpx.AsyncClient() as client:
      if params is None:
        response = await client.get(url)
      else:
        response = await client.get(url, params = params)
      return response.json()

async def post(url: str, data: dict):
    async with httpx.AsyncClient() as client:
        return await client.post(url, data = data)
