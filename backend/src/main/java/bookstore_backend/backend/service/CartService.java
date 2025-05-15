package bookstore_backend.backend.service;

import org.springframework.stereotype.Service;

import bookstore_backend.backend.entity.Cart;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.exception.UserNotFoundException;
import bookstore_backend.backend.entity.Book;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;



@Service
public interface CartService {
    


    public List<Cart> getCartItemsByUser(User user) ;
    public Cart addCartItem(Cart cart);
    public Optional<Cart> findCartItemById(Long cartId) ;

    @Transactional
    public boolean removeCartItemById(Long id) ;

    public void clearUserCart(Long userId) throws UserNotFoundException ;
    
    @Transactional //加上 @Transactional 后，findById 和 save 这两个操作被捆绑成一个原子单元。要么两个都成功并提交，要么任何一个失败（导致抛出运行时异常）时，整个操作都会回滚，数据库保持原样。这保证了原子性 (Atomicity) 和数据的一致性 (Consistency)。
    public Cart updateCartItemQuantity(Long cartId, Integer quantity);
    public Optional<Cart> findCartByUserAndBook(User user, Book book) ;
}
