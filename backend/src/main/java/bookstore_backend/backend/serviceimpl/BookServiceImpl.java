package bookstore_backend.backend.serviceimpl;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.entity.BookDetails;
import bookstore_backend.backend.dto.BookWithDetailsDTO;
import bookstore_backend.backend.dao.BookDao;
import bookstore_backend.backend.repository.BookDetailsRepository;
import bookstore_backend.backend.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.List;
import java.util.Collections;

@Service

public class BookServiceImpl implements BookService {
    @Autowired
    private BookDao bookDao;
    
    @Autowired
    private BookDetailsRepository bookDetailsRepository;
    
    public List<Book> getAllBooks() {
        return bookDao.findAll(); // Service调用Dao
    }
    public Optional<Book> getBookById(Long id) {
        return bookDao.findById(id); // Service调用Dao
    }
    
    @Override
    public Optional<BookWithDetailsDTO> getBookWithDetails(Long id) {
        Optional<Book> bookOpt = bookDao.findById(id);
        if (bookOpt.isEmpty()) {
            return Optional.empty();
        }
        
        Book book = bookOpt.get();
        BookWithDetailsDTO dto = new BookWithDetailsDTO();
        
        // 复制MySQL中的基本信息
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPrice(book.getPrice());
        dto.setStock(book.getStock());
        dto.setSoldNum(book.getSoldNum());
        dto.setIsbn(book.getIsbn());
        dto.setImageUrl(book.getImageUrl());
        dto.setPublishDate(book.getPublishDate());
        dto.setPublisher(book.getPublisher());
        dto.setOnShow(book.getOnShow());
        dto.setTags(book.getTags());
        
        // 从MongoDB获取详细信息
        Optional<BookDetails> detailsOpt = bookDetailsRepository.findByBookId(id);
        detailsOpt.ifPresent(details -> dto.setDescription(details.getDescription()));
        
        return Optional.of(dto);
    }
    
    @Override
    public BookDetails saveBookDetails(Long bookId, String description) {
        Optional<BookDetails> existingDetails = bookDetailsRepository.findByBookId(bookId);
        
        BookDetails details;
        if (existingDetails.isPresent()) {
            // 更新现有详情
            details = existingDetails.get();
            details.setDescription(description);
        } else {
            // 创建新详情
            details = new BookDetails(bookId, description);
        }
        
        return bookDetailsRepository.save(details);
    }
    
    @Override
    public Optional<BookDetails> getBookDetails(Long bookId) {
        return bookDetailsRepository.findByBookId(bookId);
    }
    
    public List<Book> searchBooks(String keyword, String type) {
         if (keyword == null || keyword.trim().isEmpty()) {
             return bookDao.findAll();
         }
         keyword = keyword.trim();
         switch (type) {
             case "title":
                 return bookDao.findByTitleContainingIgnoreCase(keyword);
             case "author":
                 return bookDao.findByAuthorContainingIgnoreCase(keyword);
             case "isbn":
                 return bookDao.findByIsbnContaining(keyword);
             default:
                 return bookDao.findAll(); 
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
        // 同时删除MongoDB中的详情数据
        bookDetailsRepository.deleteByBookId(id);
    }
    public void restoreBook(Long id)
    {
        bookDao.restoreById(id);
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
        // description字段已移除，不再更新
        // existingBook.setDescription(book.getDescription());
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

    public Page<Book> findBooksPaginated(int page, int size) {

        Pageable pageable = PageRequest.of(page, size); //创建分页请求，page是页码，size是每页数量
        return bookDao.findAll(pageable); 
    }
    public List<Book> findBooksByName(String name) {
        return bookDao.findByTitleContainingIgnoreCase(name);
    }
}
