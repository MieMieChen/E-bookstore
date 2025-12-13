import asyncio
from typing import List, Dict, Any, Optional
from fastmcp import FastMCP
import aiomysql

mcp = FastMCP(name="EBookStore-MCP")

DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "czm20041229",
    "db": "bookstore",
    "autocommit": True,
    "minsize": 1,
    "maxsize": 5,
}

async def get_pool():
    if not hasattr(get_pool, "_pool"):
        get_pool._pool = await aiomysql.create_pool(**DB_CONFIG)
    return get_pool._pool


async def query_books_by_keyword(keyword: str) -> List[Dict[str, Any]]:
    pool = await get_pool()

    sql = """
    SELECT
        b.id,
        b.title,
        b.author,
        b.publisher,
        b.price,
        b.isbn,
        b.description
    FROM books b
    WHERE b.title LIKE %s OR b.author LIKE %s
    LIMIT 50;
    """

    like = f"%{keyword}%"

    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(sql, (like, like))
            rows = await cur.fetchall()
            return rows


@mcp.tool(description="Search books from MySQL by keyword (title or author)")
async def search_book(
    keyword: str,
    userMessage: str = None,  # 接受并忽略 n8n 传递的用户消息
    toolCallId: str = None,   # 接受并忽略 n8n 传递的 Tool Call ID
    sessionId: str = None,    # n8n MCP Client 会附带的会话 ID
    action: str = None,       # n8n MCP Client 的动作标记
    chatInput: str = None,    # Agent 原始输入
    headers: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
    query: Optional[Dict[str, Any]] = None,
    body: Optional[Dict[str, Any]] = None,
    webhookUrl: Optional[str] = None,
    executionMode: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    使用关键字（title 或 author）搜索图书
    返回：包含书籍及其库存信息的列表
    """
    # 逻辑体只使用 keyword
    if not keyword or not keyword.strip():
        return []

    results = await query_books_by_keyword(keyword.strip())

    # 简化返回数据结构，只保留 Agent 需要的字段
    simplified_results = []
    for row in results:
        simplified_results.append({
            "title": row.get("title"),
            "author": row.get("author"),
            "price": row.get("price"),
            "publisher": row.get("publisher"),
        })

    return simplified_results


async def lifespan():
    yield


if __name__ == "__main__":
    # 保持 SSE 模式运行，端口改为 8001
    mcp.run(transport="sse", host="127.0.0.1", port=8001)