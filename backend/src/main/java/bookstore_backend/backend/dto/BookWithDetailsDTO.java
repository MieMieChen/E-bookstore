package bookstore_backend.backend.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * BookWithDetailsDTO - 包含完整书籍信息的DTO
 * 整合MySQL中的基本信息和MongoDB中的详细信息
 */
@Data
public class BookWithDetailsDTO {
    // MySQL中的基本信息
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
    
    // MySQL中的标签信息
    private String tags;
    
    // MongoDB中的详细信息
    private String description;
}
