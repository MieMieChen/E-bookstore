package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.BookDetails;
import bookstore_backend.backend.repository.BookDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MongoDB测试控制器
 * 用于测试MongoDB连接和BookDetails操作
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class MongoDBTestController {
    
    @Autowired
    private BookDetailsRepository bookDetailsRepository;
    
    /**
     * 测试MongoDB连接
     */
    @GetMapping("/mongodb")
    public ResponseEntity<String> testMongoDB() {
        try {
            long count = bookDetailsRepository.count();
            return ResponseEntity.ok("MongoDB连接成功！当前book_details集合有 " + count + " 条记录");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("MongoDB连接失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取所有书籍详情
     */
    @GetMapping("/book-details")
    public ResponseEntity<List<BookDetails>> getAllBookDetails() {
        try {
            List<BookDetails> details = bookDetailsRepository.findAll();
            return ResponseEntity.ok(details);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 创建测试数据
     */
    @PostMapping("/book-details/sample")
    public ResponseEntity<BookDetails> createSampleBookDetails() {
        try {
            BookDetails sample = new BookDetails(1L, "这是一本测试书籍的详细描述。这本书讲述了一个精彩的故事...");
            BookDetails saved = bookDetailsRepository.save(sample);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 清空所有测试数据
     */
    @DeleteMapping("/book-details/all")
    public ResponseEntity<String> deleteAllBookDetails() {
        try {
            bookDetailsRepository.deleteAll();
            return ResponseEntity.ok("已清空所有book_details数据");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("删除失败：" + e.getMessage());
        }
    }
}
