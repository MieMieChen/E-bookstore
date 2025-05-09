package bookstore_backend.backend.repository;

import bookstore_backend.backend.entity.Cart;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user); 
    //Spring Data JPA 会根据一套命名约定来推断你想要执行的数据库查询
    //     findBy...: find 是一个常用的前缀（其他还有 get, read, query, count 等），告诉 Spring Data JPA 这是一个查询操作。
    // ...User...: 在 findBy 之后的部分 (User) 会被解析为 Cart 实体中的一个属性名。Spring Data JPA 会期望在你的 Cart 实体类中找到一个名为 user 的字段（通常它会将方法名中属性部分的首字母转为小写，即 User -> user）。
    void deleteByUser(User user);
    
    // 根据用户和书籍查找购物车项
    Optional<Cart> findByUserAndBook(User user, Book book);
    
    // 使用原生SQL查询，禁用安全更新模式删除购物车
    @Modifying
    @Transactional
    @Query(value = "SET SQL_SAFE_UPDATES = 0", nativeQuery = true)
    void disableSafeUpdates();
    
    @Modifying
    @Transactional
    @Query(value = "SET SQL_SAFE_UPDATES = 1", nativeQuery = true)
    void enableSafeUpdates();
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM carts WHERE user_id = :userId", nativeQuery = true)
    void deleteByUserIdNative(@Param("userId") Long userId);
} 