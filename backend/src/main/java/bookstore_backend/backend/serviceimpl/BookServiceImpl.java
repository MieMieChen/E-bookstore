package bookstore_backend.backend.serviceimpl;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.repository.BookRepository;
import bookstore_backend.backend.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;




import java.util.Optional;
import java.util.List;
import java.util.Collections;

@Service

public class BookServiceImpl implements BookService {
    @Autowired
    private BookRepository bookRepository;
    
    public List<Book> getAllBooks() {
        return bookRepository.findAll(); // Service调用Repository
    }
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id); // Service调用Repository
    }
    public List<Book> searchBooks(String keyword, String type) {
         if (keyword == null || keyword.trim().isEmpty()) {
             return bookRepository.findAll();
         }

         keyword = keyword.trim();

         // 注意：这里可以将更复杂的搜索逻辑、异常处理等放在Service层
         switch (type) {
             case "title":
                 return bookRepository.findByTitleContainingIgnoreCase(keyword);
             case "author":
                 return bookRepository.findByAuthorContainingIgnoreCase(keyword);
             case "isbn":
                 return bookRepository.findByIsbnContaining(keyword);
             default:
                 // 如果type未知，可以返回空列表或所有书籍，取决于业务需求
                 return bookRepository.findAll(); // 或者 Collections.emptyList();
         }
    }
    public List<Book> getHotBooks() {
        List<Book> allBooks = bookRepository.findAll();
         if (allBooks.isEmpty()) {
             return Collections.emptyList();
         }
        return allBooks.subList(0, Math.min(6, allBooks.size()));
    }
    public List<Book> getNewBooks() {
        List<Book> allBooks = bookRepository.findAll();
         if (allBooks.isEmpty()) {
             return Collections.emptyList();
         }
        return allBooks.subList(0, Math.min(10, allBooks.size()));
    }



}
