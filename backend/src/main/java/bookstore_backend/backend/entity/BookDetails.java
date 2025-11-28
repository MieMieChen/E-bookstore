package bookstore_backend.backend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * BookDetails - MongoDB文档实体
 * 存储书籍的详细描述信息
 */
@Data
@Document(collection = "book_details") // 指定MongoDB集合名称
public class BookDetails {
    
    @Id
    private String id; // MongoDB的文档ID
    
    @Field("book_id")
    private Long bookId; // 关联MySQL中Book表的ID
    
    @Field("description")
    private String description; // 书籍详细描述
    
    /**
     * 构造函数
     */
    public BookDetails() {
    }
    
    /**
     * 带参构造函数
     */
    public BookDetails(Long bookId, String description) {
        this.bookId = bookId;
        this.description = description;
    }
}
