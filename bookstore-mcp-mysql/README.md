# BookStore MCP (MySQL-backed)

说明：这是为你的 E-BookStore 后端实现的一个 MCP 服务器（基于 FastMCP），直接从后端的 MySQL 数据库读取书籍信息。**在本次作业 10 中，它不仅可以作为标准 MCP 工具给桌面客户端使用，也可以通过 HTTP (JSON) 接口被 n8n Agent / 聊天机器人调用。**

目录结构：

- `requirements.txt`：Python 依赖
- `src/bookstore_mcp_mysql/server.py`：MCP 服务实现（search / get by id / list 等工具）
- `src/bookstore_mcp_mysql/asgi_app.py`：把 FastMCP mount 在 `/mcp`，并额外挂载了轻量 JSON API (`/health`、`/tools/books/query`) 供 n8n HTTP Request 节点直接调用。

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
- `search_books_by_stock(min_stock, max_stock)`
- `get_stock_by_title(title)`

如果你需要一个 **HTTP Server** 让 n8n 或其它 LLM Agent 通过 HTTP Request 方式调用，启动下面的 ASGI 版本即可：

```powershell
uvicorn src.bookstore_mcp_mysql.asgi_app:app --host 0.0.0.0 --port 8000
```

### HTTP JSON 接口（作业 10 用）

| Method | Path                  | 说明 |
| ------ | --------------------- | ---- |
| GET    | `/health`             | MCP & 数据库状态，可用于 n8n Health Check |
| POST   | `/tools/books/query`  | 统一的书籍查询入口，支持多种 action |

`POST /tools/books/query` 请求体示例：

```json
{
	"action": "search",          // search | author | id | all | stock_range | stock_by_title
	"query": "三体",              // author 模式可用 author 字段, id 模式用 book_id
	"limit": 5,
	"min_stock": 1,
	"max_stock": 20
}
```

返回：

```json
{
	"action": "search",
	"data": [ { "id": 1, "title": "三体", ... } ]
}
```

> 将 HTTP Request 节点的 URL 设置为 `http://localhost:8000/tools/books/query`，Body 选择 `JSON`，写入上面 payload；即可在 n8n Agent 的 Tool 节点里调用并把结果交给大模型。把该节点封装成一个 Tool（比如 `getBookInventory`），再由 Prompt Node 提示大模型在回答“书店里有什么？”这类问题时命中它即可。

在 Cherry Studio 中测试说明：

1. 启动本 MCP 服务。
2. 在 Cherry Studio 中创建一个 MCP 客户端连接到本机的 FastMCP（通常为默认 endpoint）。
3. 调用 `search_books_by_title` 或 `search_books`，对比直接使用你前端/后端 API 检索书籍信息与通过此 MCP 服务检索时的响应时间与字段差异，截屏保存对比。

在 n8n Agent 中测试：

1. 在 n8n 新建一个 HTTP Request 节点，指向 `http://localhost:8000/tools/books/query`。
2. Body 设为 JSON，传入 `{ "action": "search", "query": "书店里有什么" }`（或更具体关键词）。
3. 在 Agent / Function 节点中把该 HTTP 节点包装成 Tool；当用户提问“书店里有什么？”时，大模型即可调用该 Tool 并把结果返回给前端聊天机器人。

备注：

- 本实现直接读取后端 DB 表 `book_info`（字段见 `backend/src/main/java/.../entity/BookInfo.java`）。
- 若需要更多字段或分页、排序、模糊匹配调整，我可以继续扩展。
- Spring JDBC URL 中常见的 `createDatabaseIfNotExist`、`useSSL`、`serverTimezone` 等参数会在 MCP 端自动剔除，以兼容 PyMySQL；如果需要这些行为，请在数据库层面配置。
- 如果你把数据库连接改成别的环境（如云上 MySQL），设置环境变量 `MCP_DB_URL/MCP_DB_USER/MCP_DB_PASS` 即可覆盖 `application.properties` 的配置。
