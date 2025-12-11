# BookStore MCP (MySQL-backed)

说明：这是为你的 E-BookStore 后端实现的一个 MCP 服务器（基于 FastMCP），直接从后端的 MySQL 数据库读取书籍信息，提供查询接口供 Cherry Studio 或其它桌面 MCP 客户端调用并对比测试。

目录结构：

- `requirements.txt`：Python 依赖
- `src/bookstore_mcp_mysql/server.py`：MCP 服务实现（search / get by id / list 等工具）

运行前准备：

1. 安装依赖（建议在虚拟环境中）：

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
```

2. 确保后端 MySQL 正在运行，并且 `backend/src/main/resources/application.properties` 中的 `spring.datasource` 配置正确（此脚本会自动读取该文件中的 `url`、`username`、`password`，若你需要手动覆盖，可在代码中修改或通过环境变量替换）。

启动服务：

```powershell
python -m src.bookstore_mcp_mysql.server
```

默认会在控制台输出 FastMCP 的服务启动信息并注册工具：

- `get_all_books`
- `get_book_by_id(book_id)`
- `search_books_by_title(title_query)`
- `search_books_by_author(author_query)`
- `search_books(query)` (组合 title/author/isbn)

在 Cherry Studio 中测试说明：

1. 启动本 MCP 服务。
2. 在 Cherry Studio 中创建一个 MCP 客户端连接到本机的 FastMCP（通常为默认 endpoint）。
3. 调用 `search_books_by_title` 或 `search_books`，对比直接使用你前端/后端 API 检索书籍信息与通过此 MCP 服务检索时的响应时间与字段差异，截屏保存对比。

备注：

- 本实现直接读取后端 DB 表 `book_info`（字段见 `backend/src/main/java/.../entity/BookInfo.java`）。
- 若需要更多字段或分页、排序、模糊匹配调整，我可以继续扩展。
