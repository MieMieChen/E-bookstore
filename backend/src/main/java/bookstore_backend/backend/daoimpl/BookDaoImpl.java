package bookstore_backend.backend.daoimpl;

import bookstore_backend.backend.dao.BookDao;
import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class BookDaoImpl implements BookDao {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }
    
    @Override
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }
    
    @Override
    public List<Book> findByTitleContainingIgnoreCase(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }
    
    @Override
    public List<Book> findByAuthorContainingIgnoreCase(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }
    
    @Override
    public List<Book> findByIsbnContaining(String isbn) {
        return bookRepository.findByIsbnContaining(isbn);
    }
    @Override
    public void deleteById(Long id) {
        bookRepository.deleteById(id);
    }
    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }
}
