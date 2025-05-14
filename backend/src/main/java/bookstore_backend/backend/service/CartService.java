package bookstore_backend.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bookstore_backend.backend.repository.CartRepository;
import bookstore_backend.backend.entity.Cart;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.exception.UserNotFoundException;
import bookstore_backend.backend.service.UserService;
import bookstore_backend.backend.entity.Book;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;



@Service
public class CartService {
    


    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserService userService;


    public List<Cart> getCartItemsByUser(User user) {
        return cartRepository.findByUser(user);
    }
    public Cart addCartItem(Cart cart) {
        return cartRepository.save(cart);
    }
    public Optional<Cart> findCartItemById(Long cartId) {
        return cartRepository.findById(cartId);
    }

    // public Optional<Cart> deleteCartItem(Cart cart) {
    //     Long cartId = cart.getId(); // 获取 Cart 实体的 ID
    //     // 1. Service 调用 Repository 查找数据
    //     Optional<Cart> cartOptional = cartRepository.findById(cartId); // <-- 查找逻辑在 Service

    //     // 2. Service 处理找到或找不到的业务逻辑
    //     if (cartOptional.isPresent()) {
    //         Cart cartToDelete = cartOptional.get();
    //         // 3. Service 调用 Repository 执行删除操作
    //         cartRepository.delete(cartToDelete); // <-- 删除逻辑在 Service
    //         // cartRepository.deleteById(cartId); // 也可以用 deleteById(id)

    //         // 4. Service 返回删除前的实体（或 Optional.of(实体)）
    //         return Optional.of(cartToDelete); // 返回被删除的实体，以便调用者可以使用其信息（比如在响应中返回）
    //     } else {
    //         // 如果没找到
    //         return Optional.empty(); // 返回空 Optional
    //     }
    // }
    @Transactional
    public boolean removeCartItemById(Long id) {
        // Spring Data JPA 的 deleteById 默认如果 ID 不存在不会抛异常，只会什么也不做。
        // 如果需要知道是否成功删除，可以在删除前先检查是否存在。
        boolean exists = cartRepository.existsById(id);
        if (exists) {
            cartRepository.deleteById(id); // 直接根据ID删除
            return true; // 找到了并删除了
        } else {
            return false; // 未找到
    }

        /*
        // 或者使用抛异常的方式：
        // boolean exists = cartRepository.existsById(id);
        // if (!exists) {
        //    throw new CartItemNotFoundException("Cart item not found with ID: " + id);
        // }
        // cartRepository.deleteById(id);
        // return; // void 方法
        */
    }

    public void clearUserCart(Long userId) throws UserNotFoundException {
        // 1. Business Logic: Check if user exists
        Optional<User> userOptional = userService.findUserById(userId);

        if (!userOptional.isPresent()) {
            // Log error (use a logger instead of System.err)
            System.err.println("找不到用户ID " + userId); // Replace with logger
            throw new UserNotFoundException("User not found with ID: " + userId);
        }

        User user = userOptional.get();

        // Log action (use a logger)
        System.out.println("清空用户ID " + userId + " 的购物车"); // Replace with logger

        // 2. Business Logic: Attempt different deletion strategies
        try {
            // Try using native SQL deletion first
            System.out.println("禁用安全更新模式..."); // Replace with logger
            // This call might need to interact with the JDBC connection or session
            // The specific implementation of this in CartRepository is assumed
            cartRepository.disableSafeUpdates();

            System.out.println("使用原生SQL删除购物车数据..."); // Replace with logger
            cartRepository.deleteByUserIdNative(userId); // Perform the native delete

            System.out.println("恢复安全更新模式..."); // Replace with logger
            cartRepository.enableSafeUpdates();

            System.out.println("购物车删除成功 (原生SQL)"); // Replace with logger

        } catch (Exception e) {
            // If native SQL fails, fall back to JPA method
            System.err.println("原生SQL删除失败，尝试使用JPA方法: " + e.getMessage()); // Replace with logger
            e.printStackTrace(); // Replace with logger

            // Find cart items using JPA method
            // Note: Using the fetched 'user' object directly is possible with JPA
            List<Cart> userCartItems = cartRepository.findByUser(user);
            System.out.println("找到 " + userCartItems.size() + " 个购物车项，逐个删除..."); // Replace with logger

            // Iterate and delete each item (less efficient for many items)
            for (Cart cart : userCartItems) {
                System.out.println("删除购物车项 ID: " + cart.getId()); // Replace with logger
                cartRepository.deleteById(cart.getId());
            }

            System.out.println("购物车删除成功 (JPA方法)"); // Replace with logger
        }
    }
    
    @Transactional //加上 @Transactional 后，findById 和 save 这两个操作被捆绑成一个原子单元。要么两个都成功并提交，要么任何一个失败（导致抛出运行时异常）时，整个操作都会回滚，数据库保持原样。这保证了原子性 (Atomicity) 和数据的一致性 (Consistency)。
    public Cart updateCartItemQuantity(Long cartId, Integer quantity) { // Service 方法通常返回业务数据或抛异常

        // 1. Service 进行业务验证 (如果数量<1是业务规则)
        if (quantity == null || quantity < 1) {
             throw new IllegalArgumentException("Invalid quantity: " + quantity); // 抛出自定义业务异常
        }

        // 2. Service 调用 Repository 查找数据
        Optional<Cart> cartOptional = cartRepository.findById(cartId);

        // 3. Service 处理业务情况 (例如找不到)
        if (cartOptional.isPresent()) {
            Cart cart = cartOptional.get();
            // 4. Service 执行业务逻辑 (修改数据)
            cart.setQuantity(quantity);
            // 5. Service 调用 Repository 保存数据 (在@Transactional下会自动同步到DB)
            // cartRepository.save(cart); // 可以显式save，也可以依赖@Transactional的自动flush
            // 为了明确，我们保留 save
            Cart updatedCart = cartRepository.save(cart);
            return updatedCart; // Service 返回业务数据 (更新后的实体)
        } else {
            // 如果找不到，Service 抛出异常
            throw new IllegalArgumentException("Cart item with id " + cartId + " not found.");
        }
    }
    public Optional<Cart> findCartByUserAndBook(User user, Book book) {
        return cartRepository.findByUserAndBook(user, book);
    }
}
