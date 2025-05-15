package bookstore_backend.backend.daoimpl;

import bookstore_backend.backend.dao.CartDao;
import bookstore_backend.backend.entity.Cart;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CartDaoImpl implements CartDao {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Override
    public List<Cart> findAll() {
        return cartRepository.findAll();
    }
    
    @Override
    public List<Cart> findByUser(User user) {
        return cartRepository.findByUser(user);
    }
    
    @Override
    public Optional<Cart> findById(Long id) {
        return cartRepository.findById(id);
    }
    
    @Override
    public void deleteByUser(User user) {
        cartRepository.deleteByUser(user);
    }
    
    @Override
    public Optional<Cart> findByUserAndBook(User user, Book book) {
        return cartRepository.findByUserAndBook(user, book);
    }
    
    @Override
    public void disableSafeUpdates() {
        cartRepository.disableSafeUpdates();
    }
    
    @Override
    public void enableSafeUpdates() {
        cartRepository.enableSafeUpdates();
    }
    
    @Override
    public void deleteByUserIdNative(Long userId) {
        cartRepository.deleteByUserIdNative(userId);
    }
    
    @Override
    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }
    
    @Override
    public void delete(Cart cart) {
        cartRepository.delete(cart);
    }
}
