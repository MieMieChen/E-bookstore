package bookstore_backend.backend.dao;

import bookstore_backend.backend.entity.Book;
import java.util.List;
import java.util.Optional;

public interface BookDao {
    List<Book> findAll();
    Optional<Book> findById(Long id);
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    List<Book> findByIsbnContaining(String isbn);
    void deleteById(Long id);
    void restoreById(Long id);
    Book save(Book book);
}
