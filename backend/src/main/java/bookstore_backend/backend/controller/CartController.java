package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.Cart;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.repository.CartRepository;
import bookstore_backend.backend.repository.UserRepository;
import bookstore_backend.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController //表明这个类是一个控制器，负责处理传入的Web请求
@RequestMapping("/api/cart") //将所有在这个控制器中定义的请求映射到以 /api/cart 开头的URL路径下。例如，获取购物车项的接口可能是 GET /api/cart/{userId}
@CrossOrigin(origins = "http://localhost:3000") //正是告诉浏览器，允许来自 http://localhost:3000 的前端应用访问这些购物车API接口。
public class CartController {

    @Autowired //自动装配，将 CartRepository 注入到 CartController 中 
    // 注入就是：
    // 你的类 (如 CartController) 告诉框架 (如 Spring) 它需要什么 (如 CartRepository)。
    // 框架负责创建或找到这个需要的东西，并自动地把它提供给你的类。你的类不用关心这个东西是怎么来的，只需要直接使用它。
    // 松耦合 (Loose Coupling)：CartController 不再与 CartRepository 的具体实现类硬编码绑定。它只依赖于 CartRepository 接口。这样，更换 CartRepository 的实现或在测试时使用模拟对象都变得更容易。
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/{userId}") //处理 GET 请求，用于获取指定用户的购物车信息。前端会用 AJAX 发送 GET 请求到这个URL
    public ResponseEntity<List<Cart>> getCartItems(@PathVariable Long userId) {
        // 从数据库中查找指定用户
        return userRepository.findById(userId) //当你调用 findById(userId) 方法时，Spring Data JPA 会自动为你生成并执行一条 SQL 查询语句（类似 SELECT * FROM users WHERE id = userId），去数据库中查找对应 userId 的用户记录。
        // 如果找到用户，则返回购物车列表
            .map(user -> ResponseEntity.ok(cartRepository.findByUser(user)))
            // 如果找不到用户，则返回404 Not Found  
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    //Spring 框架中的 ResponseEntity 对象用来封装整个 HTTP 响应。主要包括以下几个方面：状态码，响应头（Header），响应体（Body）。也就是实际返回给客户端的数据内容
    public ResponseEntity<Cart> addToCart(@RequestBody Cart cart) {
        try {
            System.out.println("收到购物车请求: " + cart);
            
            // 验证用户是否存在
            if (cart.getUser() == null || cart.getUser().getId() == null) {
                System.out.println("用户信息为空");
                return ResponseEntity.badRequest().build();
            }
            
            User user = userRepository.findById(cart.getUser().getId())
                    .orElse(null);
            if (user == null) {
                System.out.println("找不到用户ID: " + cart.getUser().getId());
                return ResponseEntity.badRequest().build();
            }

            // 验证图书是否存在
            if (cart.getBook() == null || cart.getBook().getId() == null) {
                System.out.println("图书信息为空");
                return ResponseEntity.badRequest().build();
            }
            
            Book book = bookRepository.findById(cart.getBook().getId())
                    .orElse(null);
            if (book == null) {
                System.out.println("找不到图书ID: " + cart.getBook().getId());
                return ResponseEntity.badRequest().build();
            }

            // 设置关联
            cart.setUser(user);
            cart.setBook(book);
            
            // 检查购物车中是否已存在相同的书籍
            Cart savedCart;
            
            // 查找用户购物车中是否已有该书
            Optional<Cart> existingCartItem = cartRepository.findByUserAndBook(user, book);
            
            if (existingCartItem.isPresent()) {
                // 如果已存在，则更新数量
                Cart existingItem = existingCartItem.get();
                int newQuantity = existingItem.getQuantity() + (cart.getQuantity() > 0 ? cart.getQuantity() : 1);
                existingItem.setQuantity(newQuantity);
                savedCart = cartRepository.save(existingItem);
                System.out.println("更新购物车项数量成功: " + savedCart);
            } else {
                // 如果不存在，则创建新记录
                if (cart.getQuantity() <= 0) {
                    cart.setQuantity(1); // 确保数量至少为1
                }
                savedCart = cartRepository.save(cart);
                System.out.println("创建新购物车项成功: " + savedCart);
            }

            return ResponseEntity.ok(savedCart);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("添加购物车失败: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // 更新购物车商品数量
    @PutMapping("/{cartId}/quantity")
    public ResponseEntity<Cart> updateCartQuantity(
            @PathVariable Long cartId,
            @RequestBody Map<String, Integer> payload) {
        try {
            Integer quantity = payload.get("quantity");
            if (quantity == null || quantity < 1) {
                return ResponseEntity.badRequest().build();
            }
            
            return cartRepository.findById(cartId)
                    .map(cart -> {
                        cart.setQuantity(quantity);
                        Cart updatedCart = cartRepository.save(cart);
                        return ResponseEntity.ok(updatedCart);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        return cartRepository.findById(id)
                .map(cart -> {
                    cartRepository.delete(cart);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 清空用户购物车（结算使用）
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearUserCart(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                System.err.println("找不到用户ID " + userId);
                return ResponseEntity.notFound().build();
            }
            
            // 清空该用户的购物车，使用原生SQL查询，绕过安全更新模式
            System.out.println("清空用户ID " + userId + " 的购物车");
            
            try {
                // 先尝试使用原生SQL查询删除
                System.out.println("禁用安全更新模式...");
                cartRepository.disableSafeUpdates();
                
                System.out.println("使用原生SQL删除购物车数据...");
                cartRepository.deleteByUserIdNative(userId);
                
                System.out.println("恢复安全更新模式...");
                cartRepository.enableSafeUpdates();
                
                System.out.println("购物车删除成功");
            } catch (Exception e) {
                System.err.println("原生SQL删除失败，尝试使用JPA方法: " + e.getMessage());
                e.printStackTrace();
                
                // 如果原生SQL查询失败，回退到使用JPA方法
                List<Cart> userCartItems = cartRepository.findByUser(user);
                System.out.println("找到 " + userCartItems.size() + " 个购物车项，逐个删除...");
                
                for (Cart cart : userCartItems) {
                    System.out.println("删除购物车项 ID: " + cart.getId());
                    cartRepository.deleteById(cart.getId());
                }
            }
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("清空购物车失败: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
} 