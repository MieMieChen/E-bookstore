# MongoDB集成说明 - description字段迁移

## 概述

本次改造将Book表的`description`字段从MySQL迁移到MongoDB，实现MySQL和MongoDB的混合存储架构。

## 架构说明

### MySQL存储
- **表**: `books`
- **存储内容**: 书籍基本信息（id, title, author, price, stock, isbn等）

### MongoDB存储
- **集合**: `book_details`
- **存储内容**: 书籍详细描述信息
  - `book_id`: 关联MySQL中的book表主键
  - `description`: 书籍详细描述

## 数据迁移步骤

### 前提条件
1. 确保MongoDB已安装并运行在 `localhost:27017`
2. 确保MySQL数据库中已有书籍数据

### 迁移步骤

#### 步骤1: 临时恢复description字段（仅用于迁移）

在 `Book.java` 中临时取消注释description字段：

```java
@Column(length = 1000)
private String description;
```

#### 步骤2: 启用迁移工具

在 `BookDescriptionMigrationUtil.java` 中取消注释 `@Component` 注解：

```java
@Component  // 取消注释
public class BookDescriptionMigrationUtil implements CommandLineRunner {
```

并取消注释迁移逻辑代码块。

#### 步骤3: 运行应用

```bash
cd backend
mvn spring-boot:run
```

应用启动时会自动执行迁移，控制台会显示迁移进度。

#### 步骤4: 验证迁移结果

连接MongoDB查看数据：

```bash
mongosh
use bookstore
db.book_details.find().pretty()
```

#### 步骤5: 完成迁移

1. 重新注释 `Book.java` 中的 description 字段
2. 重新注释 `BookDescriptionMigrationUtil.java` 的 `@Component` 注解
3. 重启应用

## API接口说明

### 获取完整书籍信息（包含description）
```
GET /api/books/{id}
```

返回：
```json
{
  "id": 1,
  "title": "书名",
  "author": "作者",
  "price": 5000,
  "description": "详细描述（来自MongoDB）",
  ...
}
```

### 获取书籍详情（仅MongoDB数据）
```
GET /api/books/{id}/details
```

### 保存/更新书籍详情
```
POST /api/books/{id}/details
Content-Type: text/plain

书籍的详细描述内容
```

## 配置说明

在 `application.properties` 中的MongoDB配置：

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/bookstore
```

## 测试建议

### 1. 单元测试
```bash
mvn test
```

### 2. 手动测试

#### 测试获取书籍（带description）
```bash
curl http://localhost:8080/api/books/1
```

#### 测试更新description
```bash
curl -X POST http://localhost:8080/api/books/1/details \
  -H "Content-Type: text/plain" \
  -d "这是新的书籍描述"
```

## 注意事项

1. ⚠️ **数据一致性**: 删除书籍时会自动删除MongoDB中的对应详情
2. ⚠️ **迁移工具**: 迁移完成后务必禁用迁移工具，避免重复执行
3. ⚠️ **备份**: 迁移前建议备份MySQL和MongoDB数据
4. ⚠️ **回滚方案**: 保留原始MySQL数据表结构的备份

## 故障排查

### 问题1: 无法连接MongoDB
**解决**: 检查MongoDB是否运行
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 问题2: 查询书籍时description为null
**原因**: MongoDB中没有对应的详情数据  
**解决**: 
1. 检查迁移是否成功执行
2. 手动通过API创建详情数据

### 问题3: 编译错误"找不到getDescription方法"
**原因**: Book实体已移除description字段  
**解决**: 这是正常的，前端应该使用新的API获取完整信息

## 后续扩展

可以继续扩展MongoDB存储的内容：
- 书籍封面图片（Base64或GridFS）
- 用户评论（reviews数组）
- 阅读统计信息
- 书籍标签（tags数组）

## 完成情况

- [x] 创建BookDetails MongoDB实体
- [x] 创建BookDetailsRepository
- [x] 修改Book实体（移除description）
- [x] 创建BookWithDetailsDTO
- [x] 修改BookService接口
- [x] 修改BookServiceImpl实现
- [x] 修改BookController
- [x] 创建数据迁移工具
- [ ] 执行数据迁移
- [ ] 测试验证
- [ ] 更新前端代码（如需要）
