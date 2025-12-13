"""ASGI app that mounts the FastMCP streamable-http endpoint at /mcp and
exposes lightweight JSON endpoints so n8n 或其它 Agent 可以通过 HTTP 调用书籍工具。

Run with: `uvicorn src.bookstore_mcp_mysql.asgi_app:app --host 0.0.0.0 --port 8000`
or use the provided convenience command in README.
"""
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Mount, Route
from sqlalchemy import text

from . import server as mcp_server

# Ensure streamable path is /mcp so clients can use http://host:8000/mcp
mcp = mcp_server.mcp
mcp.settings.streamable_http_path = "/mcp"

# Create the FastMCP HTTP ASGI app which exposes a `lifespan` that must be
# passed to the parent Starlette app so FastMCP can initialize its task group.
# Use `http_app()` which returns an ASGI app suitable for mounting.
mcp_http_app = mcp.http_app()


async def homepage(_: Request):
    return JSONResponse(
        {
            "service": "BookStore MCP",
            "mcp_endpoint": "/mcp",
            "tools": [
                "get_all_books",
                "get_book_by_id",
                "search_books",
                "search_books_by_author",
                "search_books_by_stock",
                "get_stock_by_title",
            ],
            "http_proxy": {
                "query": "POST /tools/books/query",
                "payload": {
                    "action": "search | author | id | all | stock_range | stock_by_title",
                    "query": "关键词",
                },
            },
        }
    )


async def health(_: Request):
    status = {"status": "ok", "mcp": getattr(mcp, "name", "BookStore-MySQL")}
    try:
        engine = mcp_server.get_engine()
        if engine is None:
            status["database"] = "unconfigured"
        else:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            status["database"] = "connected"
    except Exception as exc:  # pragma: no cover - debugging aid
        status["database"] = f"error: {exc}"
        return JSONResponse(status, status_code=500)
    return JSONResponse(status)


def _execute_book_action(action: str, payload: dict):
    action = (action or "search").lower()
    limit = int(payload.get("limit", 50))

    if action == "all":
        return action, mcp_server.get_all_books(limit=limit)
    if action == "id":
        book_id = payload.get("book_id")
        if book_id is None:
            raise ValueError("action 'id' requires book_id")
        return action, mcp_server.get_book_by_id(int(book_id))
    if action == "author":
        query = payload.get("query") or payload.get("author")
        if not query:
            raise ValueError("action 'author' requires query/author")
        return action, mcp_server.search_books_by_author(query, limit=limit)
    if action == "stock_range":
        min_stock = int(payload.get("min_stock", 1))
        max_stock = payload.get("max_stock")
        max_stock = int(max_stock) if max_stock is not None else None
        return action, mcp_server.search_books_by_stock(min_stock, max_stock, limit=limit)
    if action == "stock_by_title":
        title = payload.get("title") or payload.get("query")
        if not title:
            raise ValueError("action 'stock_by_title' requires title/query")
        return action, mcp_server.get_stock_by_title(title)

    # default search by generic query/title
    query = payload.get("query") or payload.get("title")
    if not query:
        raise ValueError("action 'search' requires query/title")
    return action or "search", mcp_server.search_books(query, limit=limit)


async def books_query(request: Request):
    try:
        payload = await request.json()
    except Exception:
        return JSONResponse({"error": "Invalid JSON body"}, status_code=400)

    try:
        action, data = _execute_book_action(payload.get("action"), payload)
    except ValueError as exc:
        return JSONResponse({"error": str(exc)}, status_code=400)
    except Exception as exc:  # pragma: no cover - runtime diagnostics
        return JSONResponse({"error": f"Failed to execute action: {exc}"}, status_code=500)

    return JSONResponse({"action": action, "data": data})


routes = [
    Route("/", endpoint=homepage, methods=["GET"]),
    Route("/health", endpoint=health, methods=["GET"]),
    Route("/tools/books/query", endpoint=books_query, methods=["POST"]),
    Mount("/mcp", app=mcp_http_app),
]


# Mount the FastMCP ASGI app and expose extra HTTP tooling routes.
app = Starlette(routes=routes, lifespan=getattr(mcp_http_app, "lifespan", None))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # Helpful startup logs for debugging
    print("== MCP startup ==")
    try:
        print("MCP name:", getattr(mcp, "name", "<unknown>"))
        print("streamable_http_path:", getattr(mcp.settings, "streamable_http_path", "<none>"))
        # Try to enumerate tools if available
        tools = []
        try:
            for t in getattr(mcp, "_tools", []) or []:
                tools.append(getattr(t, "name", str(t)))
        except Exception:
            pass
        print("Registered tools:", tools)
    except Exception as e:
        print("Error printing MCP startup info:", e)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run("src.bookstore_mcp_mysql.asgi_app:app", host="0.0.0.0", port=8000, reload=False)
