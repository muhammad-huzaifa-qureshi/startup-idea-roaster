import httpx
from config import TAVILY_API_KEY
from constants import TAVILY_URL

async def tavily_search(query: str, max_results: int = 3) -> str:
    """Search web via Tavily and return formatted results string."""
    print(f"SEARCHING WEB => {query}...")
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            TAVILY_URL,
            json={
                "api_key": TAVILY_API_KEY,
                "query": query,
                "max_results": max_results,
                "search_depth": "basic",
            },
            timeout=10.0,
        )
        resp.raise_for_status()
        data = resp.json()

    results = data.get("results", [])
    if not results:
        return "No results found."

    formatted = []
    for r in results:
        formatted.append(
            f"Title: {r.get('title', '')}\nURL: {r.get('url', '')}\nSnippet: {r.get('content', '')[:300]}"
        )
    return "\n\n".join(formatted)


TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "tavily_search",
            "description": "Search the web for current technical information, API details, library availability, or implementation complexity.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to look up",
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Number of search results to return (default 3)",
                        "default": 3
                    }
                },
                "required": ["query"],
            },
        },
    }
]
