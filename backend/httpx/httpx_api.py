import httpx

client = httpx.AsyncClient()

async def get(url: str, params: dict = None):
      if params is None:
        response = await client.get(url)
      else:
        response = await client.get(url, params = params)
      return response.json()

async def post(url: str, data: dict):
        return await client.post(url, data = data)
