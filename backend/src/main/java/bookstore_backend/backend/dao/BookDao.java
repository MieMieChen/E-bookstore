package bookstore_backend.backend.dao;

import bookstore_backend.backend.entity.Book;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

public interface BookDao {
    List<Book> findAll();
    Optional<Book> findById(Long id);
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    List<Book> findByIsbnContaining(String isbn);
    void deleteById(Long id);
    void restoreById(Long id);
    Book save(Book book);
    Page<Book> findAll(Pageable pageable); // 分页查询方法
}
