# 任务A实现指南 - MySQL + MongoDB混合存储

## ✅ 已完成的工作

### 1. 创建的新文件

#### 实体类
- `BookDetails.java` - MongoDB文档实体，存储书籍description

#### Repository
- `BookDetailsRepository.java` - MongoDB数据访问接口

#### DTO
- `BookWithDetailsDTO.java` - 完整书籍信息DTO（整合MySQL和MongoDB）
- `BookCreateUpdateDTO.java` - 管理员创建/更新书籍的请求DTO

#### 控制器
- `MongoDBTestController.java` - MongoDB测试接口

#### 工具类
- `BookDescriptionMigrationUtil.java` - 数据迁移工具（待启用）

### 2. 修改的文件

#### 实体类
- `Book.java` - 注释掉description字段（已迁移到MongoDB）

#### Service层
- `BookService.java` - 新增MongoDB相关方法接口
- `BookServiceImpl.java` - 实现MongoDB集成逻辑

#### Controller层
- `BookController.java` - 更新接口返回完整书籍信息
- `AdminController.java` - 更新管理员操作以支持MongoDB

---

## 🚀 快速开始

### 步骤1: 启动MongoDB

确保MongoDB正在运行：

```bash
# Windows
net start MongoDB

# 或检查服务
sc query MongoDB
```

默认配置：
- 地址: `localhost:27017`
- 数据库: `bookstore`
- 集合: `book_details`

### 步骤2: 启动应用

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### 步骤3: 测试MongoDB连接

```bash
# 测试MongoDB连接
curl http://localhost:8080/api/test/mongodb

# 预期输出
MongoDB连接成功！当前book_details集合有 0 条记录
```

### 步骤4: 创建测试数据

```bash
# 创建示例书籍详情
curl -X POST http://localhost:8080/api/test/book-details/sample

# 查看所有详情
curl http://localhost:8080/api/test/book-details
```

---

## 📝 主要API接口

### 1. 获取完整书籍信息（包含MongoDB的description）

```bash
GET /api/books/{id}

# 示例
curl http://localhost:8080/api/books/1
```

**响应示例：**
```json
{
  "id": 1,
  "title": "三体",
  "author": "刘慈欣",
  "price": 4500,
  "stock": 100,
  "description": "这是来自MongoDB的详细描述...",
  ...
}
```

### 2. 获取/更新书籍详情（仅MongoDB数据）

```bash
# 获取详情
GET /api/books/{id}/details

# 更新详情
POST /api/books/{id}/details
Content-Type: text/plain

这是新的书籍详细描述内容
```

### 3. 管理员创建书籍（自动保存到MySQL和MongoDB）

```bash
POST /api/admin/books
Content-Type: application/json

{
  "title": "新书名",
  "author": "作者",
  "price": 5000,
  "stock": 50,
  "isbn": "978-1234567890",
  "description": "详细描述（保存到MongoDB）",
  "imageUrl": "http://example.com/cover.jpg",
  "publisher": "出版社",
  "onShow": 1
}
```

### 4. 管理员更新书籍

```bash
PUT /api/admin/books/{id}
Content-Type: application/json

{
  "title": "更新的书名",
  "author": "作者",
  "price": 5500,
  "stock": 45,
  "description": "更新的详细描述",
  ...
}
```

---

## 🔄 数据迁移（如果有现有数据）

### 方案1: 使用迁移工具（推荐）

1. **临时启用Book的description字段**

编辑 `Book.java`，取消注释：
```java
@Column(length = 1000)
private String description;
```

2. **启用迁移工具**

编辑 `BookDescriptionMigrationUtil.java`，取消注释：
```java
@Component  // 取消这行的注释
public class BookDescriptionMigrationUtil implements CommandLineRunner {
```

并取消注释run方法中的迁移逻辑。

3. **运行迁移**
```bash
.\mvnw.cmd spring-boot:run
```

4. **验证迁移结果**
```bash
# 使用mongosh查看
mongosh
use bookstore
db.book_details.find().pretty()
```

5. **完成后恢复代码**
- 重新注释 Book.java 的 description 字段
- 重新注释 BookDescriptionMigrationUtil 的 @Component

### 方案2: 手动创建数据（测试用）

使用测试API创建数据：
```bash
# 为每本书创建详情
curl -X POST http://localhost:8080/api/books/1/details \
  -H "Content-Type: text/plain" \
  -d "第一本书的详细描述..."

curl -X POST http://localhost:8080/api/books/2/details \
  -H "Content-Type: text/plain" \
  -d "第二本书的详细描述..."
```

---

## ✅ 验证清单

- [ ] MongoDB服务正常运行
- [ ] 应用启动无错误
- [ ] `/api/test/mongodb` 返回成功
- [ ] 可以创建书籍详情
- [ ] 可以查询完整书籍信息（包含description）
- [ ] 管理员可以创建书籍（自动保存到两个数据库）
- [ ] 管理员可以更新书籍（自动更新两个数据库）
- [ ] 删除书籍时MongoDB数据也被删除

---

## 📊 数据存储架构

```
┌─────────────────────────────────────────┐
│           应用层 (Spring Boot)           │
└───────────┬──────────────┬──────────────┘
            │              │
     ┌──────▼─────┐  ┌────▼──────┐
     │   MySQL    │  │  MongoDB  │
     │            │  │           │
     │  books表   │  │book_details│
     │            │  │   集合     │
     │ - id       │  │ - book_id │
     │ - title    │  │ - description
     │ - author   │  │           │
     │ - price    │  │           │
     │ - stock    │  │           │
     │ - isbn     │  │           │
     │ - ...      │  │           │
     └────────────┘  └───────────┘
```

---

## 🎯 下一步

任务A已基本完成！现在可以：

1. **测试验证**: 运行应用并测试所有API
2. **数据迁移**: 如果有现有数据，执行迁移
3. **前端集成**: 更新前端代码以适配新的API响应格式
4. **进入任务B**: 开始实现Neo4j标签功能

---

## ⚠️ 注意事项

1. **数据一致性**: 删除书籍时会自动删除MongoDB中的详情
2. **事务支持**: 当前实现为两步操作，建议后续增加事务管理
3. **错误处理**: 已基本实现，可根据需要增强
4. **性能优化**: 如有大量查询，可考虑添加Redis缓存

---

## 🐛 故障排查

### MongoDB连接失败
```bash
# 检查MongoDB是否运行
sc query MongoDB

# 查看MongoDB日志
# 默认位置: C:\Program Files\MongoDB\Server\X.X\log\mongod.log
```

### 编译错误
确保Lombok插件已安装并启用。

### 查询返回description为null
检查MongoDB中是否有对应的book_details数据。

---

## 📞 技术支持

如遇问题，可以检查：
1. 应用日志输出
2. MongoDB日志
3. MySQL连接状态
4. 使用测试API进行调试
