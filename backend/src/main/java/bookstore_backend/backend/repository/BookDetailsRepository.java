package bookstore_backend.backend.repository;

import bookstore_backend.backend.entity.BookDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * BookDetailsRepository - MongoDB数据访问接口
 */
@Repository
public interface BookDetailsRepository extends MongoRepository<BookDetails, String> {
    
    /**
     * 根据bookId查找书籍详情
     */
    Optional<BookDetails> findByBookId(Long bookId);
    
    /**
     * 根据bookId删除书籍详情
     */
    void deleteByBookId(Long bookId);
    
    /**
     * 检查bookId是否存在
     */
    boolean existsByBookId(Long bookId);
}
