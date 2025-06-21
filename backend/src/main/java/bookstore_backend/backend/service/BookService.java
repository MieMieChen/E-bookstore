package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

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
    public void deleteBook(Long id);
    public void restoreBook(Long id);
    public Book createBook(Book book);
    public Book updateBook(Long id, Book book);
    public Book updateBookStock(Long id, int stock);
    public void saveBook(Book book);
    public Page<Book> findBooksPaginated(int page, int size) ;



}
