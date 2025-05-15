package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service

public interface BookService {
    @Autowired
    
    public List<Book> getAllBooks();
    public Optional<Book> getBookById(Long id);
    public List<Book> searchBooks(String keyword, String type) ;
    public List<Book> getHotBooks();
    public List<Book> getNewBooks() ;



}
