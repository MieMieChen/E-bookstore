package bookstore_backend.backend.serviceimpl;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.dao.BookDao;
import bookstore_backend.backend.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;




import java.util.Optional;
import java.util.List;
import java.util.Collections;

@Service

public class BookServiceImpl implements BookService {
    @Autowired
    private BookDao bookDao;
    
    public List<Book> getAllBooks() {
        return bookDao.findAll(); // Service调用Dao
    }
    public Optional<Book> getBookById(Long id) {
        return bookDao.findById(id); // Service调用Dao
    }
    public List<Book> searchBooks(String keyword, String type) {
         if (keyword == null || keyword.trim().isEmpty()) {
             return bookDao.findAll();
         }

         keyword = keyword.trim();

         // 注意：这里可以将更复杂的搜索逻辑、异常处理等放在Service层
         switch (type) {
             case "title":
                 return bookDao.findByTitleContainingIgnoreCase(keyword);
             case "author":
                 return bookDao.findByAuthorContainingIgnoreCase(keyword);
             case "isbn":
                 return bookDao.findByIsbnContaining(keyword);
             default:
                 // 如果type未知，可以返回空列表或所有书籍，取决于业务需求
                 return bookDao.findAll(); // 或者 Collections.emptyList();
         }
    }
    public List<Book> getHotBooks() {
        List<Book> allBooks = bookDao.findAll();
         if (allBooks.isEmpty()) {
             return Collections.emptyList();
         }
        return allBooks.subList(0, Math.min(6, allBooks.size()));
    }
    public List<Book> getNewBooks() {
        List<Book> allBooks = bookDao.findAll();
         if (allBooks.isEmpty()) {
             return Collections.emptyList();
         }
        return allBooks.subList(0, Math.min(10, allBooks.size()));
    }
    public void deleteBook(Long id) {
        bookDao.deleteById(id);
    }
    public Book createBook(Book book) {
        return bookDao.save(book);
    }
    public Book updateBook(Long id, Book book) {
        Book existingBook = bookDao.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setPrice(book.getPrice());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setStock(book.getStock());
        existingBook.setImageUrl(book.getImageUrl());
        existingBook.setDescription(book.getDescription());
        existingBook.setPublisher(book.getPublisher());
        existingBook.setPublishDate(book.getPublishDate());
        existingBook.setOnShow(book.getOnShow());
        return bookDao.save(existingBook);
    }   
    public Book updateBookStock(Long id, int stock) {
        Book existingBook = bookDao.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        existingBook.setStock(stock);
        return bookDao.save(existingBook);
    }
    public void saveBook(Book book) {
        bookDao.save(book);
    }



}
