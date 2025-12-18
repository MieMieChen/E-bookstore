package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.entity.BookDetails;
import bookstore_backend.backend.dto.BookWithDetailsDTO;
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
    
    // 新增：获取包含详细信息的完整书籍数据
    public Optional<BookWithDetailsDTO> getBookWithDetails(Long id);
    
    // 新增：保存或更新书籍详情到MongoDB
    public BookDetails saveBookDetails(Long bookId, String description);
    
    // 新增：获取书籍详情
    public Optional<BookDetails> getBookDetails(Long bookId);
    
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
    public List<Book> findBooksByName(String name);


}
