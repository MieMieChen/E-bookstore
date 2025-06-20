package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.Cart;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.exception.UserNotFoundException;
import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.service.CartService;
import bookstore_backend.backend.service.UserService;
import bookstore_backend.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController // 最常用于创建 RESTful API。因为 RESTful API 的核心在于资源的表示和交互，后端通常直接返回数据（如 JSON 格式的对象列表、单个对象、状态码等），而不是返回渲染好的 HTML 页面。
@RequestMapping("/api/cart") //将所有在这个控制器中定义的请求映射到以 /api/cart 开头的URL路径下。例如，获取购物车项的接口可能是 GET /api/cart/{userId}
@CrossOrigin(origins = "http://localhost:3000") //正是告诉浏览器，允许来自 http://localhost:3000 的前端应用访问这些购物车API接口。




public class CartController {

    @Autowired //自动装配，将 CartRepository 注入到 CartController 中 
    // 注入就是：
    // 你的类 (如 CartController) 告诉框架 (如 Spring) 它需要什么 (如 CartRepository)。
    // 框架负责创建或找到这个需要的东西，并自动地把它提供给你的类。你的类不用关心这个东西是怎么来的，只需要直接使用它。
    // 松耦合 (Loose Coupling)：CartController 不再与 CartRepository 的具体实现类硬编码绑定。它只依赖于 CartRepository 接口。这样，更换 CartRepository 的实现或在测试时使用模拟对象都变得更容易。
    private CartService cartService;

    @Autowired
    private BookService bookService;

    @Autowired
    private UserService userService;



    @GetMapping("/me") //处理 GET 请求，用于获取指定用户的购物车信息。前端会用 AJAX 发送 GET 请求到这个URL
    public ResponseEntity<List<Cart>> getCartItems(@AuthenticationPrincipal User user) {
        Long userId = user.getId();
        // 从数据库中查找指定用户
        Optional<User> userOpt = userService.findUserById(userId);
        return userOpt //当你调用 findById(userId) 方法时，Spring Data JPA 会自动为你生成并执行一条 SQL 查询语句（类似 SELECT * FROM users WHERE id = userId），去数据库中查找对应 userId 的用户记录。
        // 如果找到用户，则返回购物车列表
            .map(u -> ResponseEntity.ok(cartService.getCartItemsByUser(u))) //如果找到用户，则返回购物车列表
            // 如果找不到用户，则返回404 Not Found  
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    //Spring 框架中的 ResponseEntity 对象用来封装整个 HTTP 响应。主要包括以下几个方面：状态码，响应头（Header），响应体（Body）。也就是实际返回给客户端的数据内容
    //@RequestBody 注解用于将 HTTP 请求体的内容绑定到方法的参数上。它通常用于处理包含复杂数据结构的请求，例如 JSON 或 XML 格式的数据。
    public ResponseEntity<Cart> addToCart(@RequestBody Cart cart) {
        try {
            // System.out.println("收到购物车请求: " + cart);
            
            if (cart.getUser() == null || cart.getUser().getId() == null) {
                // System.out.println("用户信息为空");
                return ResponseEntity.badRequest().build(); //400
            }
            
            User user = userService.findUserById(cart.getUser().getId())
                    .orElse(null);
            // 如果 findUserById 方法找到了用户，它会返回一个包含该 User 对象的 Optional。这时，.orElse(null) 方法会返回这个 User 对象本身。
            // 如果 findUserById 方法没有找到用户，它会返回一个空的 Optional。这时，.orElse(null) 方法会返回你作为参数传递的 null。

            if (user == null) {
                //System.out.println("找不到用户ID: " + cart.getUser().getId());
                return ResponseEntity.badRequest().build();
            }

            if (cart.getBook() == null || cart.getBook().getId() == null) {
                //System.out.println("图书信息为空");
                return ResponseEntity.badRequest().build();
            }
            
            Book book = bookService.getBookById(cart.getBook().getId())
                    .orElse(null);
            if (book == null) {
                //System.out.println("找不到图书ID: " + cart.getBook().getId());
                return ResponseEntity.badRequest().build();
            }

            cart.setUser(user);
            cart.setBook(book);
            
            Cart savedCart;
            
            Optional<Cart> existingCartItem = cartService.findCartByUserAndBook(user, book);
            
            if (existingCartItem.isPresent()) {
                Cart existingItem = existingCartItem.get();
                int currentQuantity = existingItem.getQuantity();
                existingItem.setQuantity(currentQuantity + 1);
                savedCart = cartService.addCartItem(existingItem);
                System.out.println("更新购物车项数量成功: " + savedCart);
            } else {
                if (cart.getQuantity() <= 0) {
                    cart.setQuantity(1); // 确保数量至少为1
                }
                savedCart = cartService.addCartItem(cart);
                System.out.println("创建新购物车项成功: " + savedCart);
            }

            return ResponseEntity.ok(savedCart);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("添加购物车失败: " + e.getMessage());
            return ResponseEntity.internalServerError().build(); //500
        }
    }

    // 更新购物车商品数量
    @PutMapping("/{cartId}/quantity")
    public ResponseEntity<Cart> updateCartQuantity(
            @PathVariable Long cartId,
            @RequestBody Map<String, Integer> payload) {
        try {
            Integer quantity = payload.get("quantity");
            Cart updatedCart = cartService.updateCartItemQuantity(cartId, quantity); 
            return ResponseEntity.ok(updatedCart); 
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("not found")) {
                 return ResponseEntity.notFound().build(); 
            } else {
                 return ResponseEntity.badRequest().body(null);
            }
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> removeFromCart(@AuthenticationPrincipal User user) {
        Long userId = user.getId();
        boolean deleted = cartService.removeCartItemById(userId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build(); // 返回 404 Not Found
        }
    }
   
    public ResponseEntity<Void> clearUserCart(@AuthenticationPrincipal User user) {
        Long userId = user.getId();
        try {
            cartService.clearUserCart(userId);
            return ResponseEntity.ok().build();

        } catch (UserNotFoundException e) {
            System.err.println("Error clearing cart: " + e.getMessage()); 
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            System.err.println("Error clearing cart: " + e.getMessage()); 
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().build();
        }
    }



}
