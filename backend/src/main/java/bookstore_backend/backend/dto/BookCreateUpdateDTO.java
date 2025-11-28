package bookstore_backend.backend.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * BookCreateUpdateDTO - 用于管理员创建/更新书籍的请求DTO
 * 包含MySQL和MongoDB的所有字段
 */
@Data
public class BookCreateUpdateDTO {
    // MySQL字段
    private Long id;
    private String title;
    private String author;
    private Integer price;
    private Integer stock;
    private Integer soldNum;
    private String isbn;
    private String imageUrl;
    private LocalDate publishDate;
    private String publisher;
    private Integer onShow;
    
    // 标签（逗号分隔）
    private String tags;
    
    // MongoDB字段
    private String description;
}
