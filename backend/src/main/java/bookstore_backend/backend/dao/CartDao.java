package bookstore_backend.backend.dao;

import bookstore_backend.backend.entity.Cart;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.Book;
import java.util.List;
import java.util.Optional;

public interface CartDao {
    List<Cart> findAll();
    List<Cart> findByUser(User user);
    Optional<Cart> findById(Long id);
    void deleteByUser(User user);
    Optional<Cart> findByUserAndBook(User user, Book book);
    void disableSafeUpdates();
    void enableSafeUpdates();
    void deleteByUserIdNative(Long userId);
    Cart save(Cart cart);
    void delete(Cart cart);
}
