package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // 允许来自 http://localhost:3000 的跨域请求
public class BookController {

    @Autowired
    private BookService bookService;
    // 获取所有图书

    @GetMapping("/books/paged")
        public ResponseEntity<Page<Book>> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Book> bookPage = bookService.findBooksPaginated(page, size);
        return ResponseEntity.ok(bookPage);
    }

    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        try {
            List<Book> books = bookService.getAllBooks();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        try {
            // 返回包含MongoDB详情的完整书籍信息
            Optional<bookstore_backend.backend.dto.BookWithDetailsDTO> bookWithDetailsOpt = bookService.getBookWithDetails(id);
            if (bookWithDetailsOpt.isPresent()) {
                return ResponseEntity.ok(bookWithDetailsOpt.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 新增：获取书籍详情（仅MongoDB中的description）
    @GetMapping("/books/{id}/details")
    public ResponseEntity<?> getBookDetails(@PathVariable Long id) {
        try {
            Optional<bookstore_backend.backend.entity.BookDetails> detailsOpt = bookService.getBookDetails(id);
            return detailsOpt
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 新增：更新书籍详情
    @PostMapping("/books/{id}/details")
    public ResponseEntity<?> saveBookDetails(@PathVariable Long id, @RequestBody String description) {
        try {
            bookstore_backend.backend.entity.BookDetails details = bookService.saveBookDetails(id, description);
            return ResponseEntity.ok(details);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/books/search")
    public ResponseEntity<List<Book>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type) {
        try {
            List<Book> results;
            results = bookService.searchBooks(keyword, type);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/books/hot")
    public ResponseEntity<List<Book>> getHotBooks() {
        try {
            List<Book> hotBooks = bookService.getHotBooks();
            return ResponseEntity.ok(hotBooks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/books/new")
    public ResponseEntity<List<Book>> getNewBooks() {
        try {
            List<Book> newBooks = bookService.getNewBooks();
            return ResponseEntity.ok(newBooks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 