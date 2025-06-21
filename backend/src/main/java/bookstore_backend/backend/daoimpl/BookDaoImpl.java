package bookstore_backend.backend.daoimpl;

import bookstore_backend.backend.dao.BookDao;
import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
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
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        book.setOnShow(0); // 将书籍状态设置为下架
        bookRepository.save(book); // 保存更新后的书籍状态
    }
    @Override
    public void restoreById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        System.out.println("Restoring book with ID: " + id);        
        book.setOnShow(1); // 将书籍状态设置为上架
        bookRepository.save(book); // 保存更新后的书籍状态
    }
    
    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }
    @Override
    public Page<Book> findAll(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }
}
