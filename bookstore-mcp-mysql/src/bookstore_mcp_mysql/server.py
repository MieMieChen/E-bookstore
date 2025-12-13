import os
import re
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

from fastmcp import FastMCP
from sqlalchemy import create_engine, text


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_PROPERTIES = PROJECT_ROOT / '..' / '..' / 'backend' / 'src' / 'main' / 'resources' / 'application.properties'
_ENGINE_CACHE: Optional[Any] = None


def parse_properties(path: Path) -> Dict[str, str]:
    props = {}
    if not path.exists():
        return props
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                k, v = line.split('=', 1)
                props[k.strip()] = v.strip()
    return props


def mysql_url_from_spring(url: str, username: str, password: str) -> str:
    # spring url: jdbc:mysql://host:port/dbname?params
    m = re.match(r"jdbc:mysql://([^/]+)/(\w+)(.*)", url)
    if not m:
        # fallback: return url
        return url
    hostport = m.group(1)
    dbname = m.group(2)
    params = m.group(3) or ''
    if params.startswith('?'):
        # Most Spring-only query parameters are not recognized by PyMySQL, so drop them.
        params = ''
    # SQLAlchemy mysql+pymysql://user:pass@host/dbname?params
    return f"mysql+pymysql://{username}:{password}@{hostport}/{dbname}{params}"


def row_to_book(row) -> Dict[str, Any]:
    return {
        "id": int(row["id"]),
        "title": row.get("title"),
        "author": row.get("author"),
        "description": row.get("description"),
        "price": row.get("price"),
        "isbn": row.get("isbn"),
        "imageUrl": row.get("image_url") or row.get("imageUrl"),
        "publishDate": str(row.get("publish_date")) if row.get("publish_date") else None,
        "publisher": row.get("publisher"),
    }


def row_to_book_with_stock(row) -> Dict[str, Any]:
    book = row_to_book(row)
    # some queries may return stock as 'stock' or 'stock_count'
    stock = row.get("stock") if "stock" in row else row.get("stock_count") if "stock_count" in row else None
    book["stock"] = int(stock) if stock is not None else None
    return book


# Setup MCP
mcp = FastMCP("BookStore-MySQL")


def get_engine() -> Optional[Any]:
    global _ENGINE_CACHE
    if _ENGINE_CACHE is not None:
        return _ENGINE_CACHE
    # try reading backend application.properties for DB config
    props = parse_properties(Path(__file__).resolve().parents[3] / 'backend' / 'src' / 'main' / 'resources' / 'application.properties')
    url = props.get('spring.datasource.url')
    username = props.get('spring.datasource.username')
    password = props.get('spring.datasource.password')

    if not url or not username:
        # fallback to env vars
        url = os.environ.get('MCP_DB_URL')
        username = os.environ.get('MCP_DB_USER')
        password = os.environ.get('MCP_DB_PASS')

    if not url or not username:
        print("Database configuration not found. Set environment variables or ensure backend application.properties is present.")
        return None

    sqlalchemy_url = mysql_url_from_spring(url, username, password or '')
    engine = create_engine(sqlalchemy_url, pool_pre_ping=True)
    _ENGINE_CACHE = engine
    return engine


@mcp.tool()
def get_all_books(limit: int = 100) -> List[Dict[str, Any]]:
    """Return up to `limit` books from `book_info`."""
    engine = get_engine()
    if engine is None:
        return []
    sql = text("SELECT id, title, author, description, price, isbn, image_url, publish_date, publisher FROM book_info LIMIT :limit")
    with engine.connect() as conn:
        rows = conn.execute(sql, {"limit": limit}).mappings().all()
        return [row_to_book(r) for r in rows]


@mcp.tool()
def get_book_by_id(book_id: int) -> Optional[Dict[str, Any]]:
    engine = get_engine()
    if engine is None:
        return None
    sql = text("SELECT id, title, author, description, price, isbn, image_url, publish_date, publisher FROM book_info WHERE id = :id LIMIT 1")
    with engine.connect() as conn:
        row = conn.execute(sql, {"id": book_id}).mappings().first()
        if row:
            return row_to_book(row)
        return None


@mcp.tool()
def search_books(title_query: str, limit: int = 50) -> List[Dict[str, Any]]:
    engine = get_engine()
    if engine is None:
        return []
    q = f"%{title_query}%"
    sql = text("SELECT id, title, author, description, price, isbn, image_url, publish_date, publisher FROM book_info WHERE title LIKE :q LIMIT :limit")
    with engine.connect() as conn:
        rows = conn.execute(sql, {"q": q, "limit": limit}).mappings().all()
        return [row_to_book(r) for r in rows]


@mcp.tool()
def search_books_by_author(author_query: str, limit: int = 50) -> List[Dict[str, Any]]:
    engine = get_engine()
    if engine is None:
        return []
    q = f"%{author_query}%"
    sql = text("SELECT id, title, author, description, price, isbn, image_url, publish_date, publisher FROM book_info WHERE author LIKE :q LIMIT :limit")
    with engine.connect() as conn:
        rows = conn.execute(sql, {"q": q, "limit": limit}).mappings().all()
        return [row_to_book(r) for r in rows]


@mcp.tool()
def search_books(query: str, limit: int = 50) -> List[Dict[str, Any]]:
    """Search across title, author and isbn."""
    engine = get_engine()
    if engine is None:
        return []
    q = f"%{query}%"
    sql = text(
        "SELECT id, title, author, description, price, isbn, image_url, publish_date, publisher "
        "FROM book_info WHERE title LIKE :q OR author LIKE :q OR isbn LIKE :q LIMIT :limit"
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"q": q, "limit": limit}).mappings().all()
        return [row_to_book(r) for r in rows]


@mcp.tool()
def search_books_by_stock(min_stock: int = 1, max_stock: Optional[int] = None, limit: int = 100) -> List[Dict[str, Any]]:
    """Search books by inventory stock range.

    Returns books whose stock is >= min_stock and optionally <= max_stock.
    """
    engine = get_engine()
    if engine is None:
        return []

    if max_stock is None:
        sql = text(
            "SELECT b.id, b.title, b.author, b.description, b.price, b.isbn, b.image_url, b.publish_date, b.publisher, COALESCE(bi.stock, 0) AS stock "
            "FROM book_info b LEFT JOIN book_inventory bi ON b.id = bi.book_id "
            "WHERE COALESCE(bi.stock, 0) >= :min_stock LIMIT :limit"
        )
        params = {"min_stock": min_stock, "limit": limit}
    else:
        sql = text(
            "SELECT b.id, b.title, b.author, b.description, b.price, b.isbn, b.image_url, b.publish_date, b.publisher, COALESCE(bi.stock, 0) AS stock "
            "FROM book_info b LEFT JOIN book_inventory bi ON b.id = bi.book_id "
            "WHERE COALESCE(bi.stock, 0) >= :min_stock AND COALESCE(bi.stock, 0) <= :max_stock LIMIT :limit"
        )
        params = {"min_stock": min_stock, "max_stock": max_stock, "limit": limit}

    with engine.connect() as conn:
        rows = conn.execute(sql, params).mappings().all()
        return [row_to_book_with_stock(r) for r in rows]


@mcp.tool()
def get_stock_by_title(title: str) -> Optional[Dict[str, Any]]:
    """Find a book by exact title (case-insensitive) and return its stock and basic info.

    Returns None if not found.
    """
    engine = get_engine()
    if engine is None:
        return None

    # Use case-insensitive match for title. Depending on DB collation, LOWER() may be used.
    sql = text(
        "SELECT b.id, b.title, b.author, b.description, b.price, b.isbn, b.image_url, b.publish_date, b.publisher, COALESCE(bi.stock, 0) AS stock "
        "FROM book_info b LEFT JOIN book_inventory bi ON b.id = bi.book_id "
        "WHERE LOWER(b.title) = LOWER(:title) LIMIT 1"
    )
    with engine.connect() as conn:
        row = conn.execute(sql, {"title": title}).mappings().first()
        if not row:
            return None
        return row_to_book_with_stock(row)


if __name__ == '__main__':
    print("Starting BookStore MCP (MySQL-backed)...")
    print("Ensure MySQL is running and backend application.properties is available or set env vars MCP_DB_URL/MCP_DB_USER/MCP_DB_PASS.")
    # FastMCP exposes `run()` for direct execution
    try:
        mcp.run()
    except AttributeError:
        # Fallback: some versions may expect `run(transport=...)` or show helpful message
        print("mcp.run() not available on this installation. If you installed from 'mcp' package, consult its docs or use uv/cli to run the server.")
