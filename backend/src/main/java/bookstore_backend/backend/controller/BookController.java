package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    // 获取所有图书
    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        try {
            List<Book> books = bookRepository.findAll();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 获取图书详情
    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        try {
            return bookRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 搜索图书
    @GetMapping("/books/search")
    public ResponseEntity<List<Book>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type) {
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return ResponseEntity.ok(bookRepository.findAll());
            }

            keyword = keyword.trim();
            List<Book> results;

            switch (type) {
                case "title":
                    results = bookRepository.findByTitleContainingIgnoreCase(keyword);
                    break;
                case "author":
                    results = bookRepository.findByAuthorContainingIgnoreCase(keyword);
                    break;
                case "isbn":
                    results = bookRepository.findByIsbnContaining(keyword);
                    break;
                default:
                    results = bookRepository.findAll();
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 获取热门图书
    @GetMapping("/books/hot")
    public ResponseEntity<List<Book>> getHotBooks() {
        try {
            // 这里可以根据实际业务逻辑获取热门图书，例如根据销量或评分
            List<Book> hotBooks = bookRepository.findAll().subList(0, Math.min(6, bookRepository.findAll().size()));
            return ResponseEntity.ok(hotBooks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 获取新书
    @GetMapping("/books/new")
    public ResponseEntity<List<Book>> getNewBooks() {
        try {
            // 这里可以根据实际业务逻辑获取新书，例如根据上架时间
            List<Book> newBooks = bookRepository.findAll().subList(0, Math.min(6, bookRepository.findAll().size()));
            return ResponseEntity.ok(newBooks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 