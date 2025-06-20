package bookstore_backend.backend.controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;  
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import java.util.List;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.OrderStatus;
import bookstore_backend.backend.service.UserService;
import bookstore_backend.backend.service.BookService;
import bookstore_backend.backend.service.OrderService;
import bookstore_backend.backend.service.StatsService;
import bookstore_backend.backend.dto.OrderStatsDTO;
import bookstore_backend.backend.dto.OrderFilterDTO;
import bookstore_backend.backend.dto.UserStatsDTO;
import bookstore_backend.backend.util.PasswordMigrationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Optional;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/admin/")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private StatsService statsService;

    @Autowired
    private PasswordMigrationUtil passwordMigrationUtil;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        
        return userService.listUsers();
    }
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/users/invalid/{id}")
    public ResponseEntity<User> setUserInvalid(@PathVariable Long id) {
        try {   
            Optional<User> existingUserOpt = userService.findUserById(id);
            if (existingUserOpt.isEmpty()) {
                System.out.println("找不到用户ID: " + id);
                return ResponseEntity.notFound().build();
            }
            User existingUser = existingUserOpt.get();
                existingUser.setValid(0);
            User savedUser = userService.saveUser(existingUser);
            System.out.println("用户更新成功: " + savedUser);
            return ResponseEntity.ok(savedUser);
            
        } catch (Exception e) {
            System.err.println("更新用户信息失败: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    @PutMapping("/users/valid/{id}")
    public ResponseEntity<User> setUserValid(@PathVariable Long id) {
        try {
            Optional<User> existingUserOpt = userService.findUserById(id);
            if (existingUserOpt.isEmpty()) {
                System.out.println("找不到用户ID: " + id);
                return ResponseEntity.notFound().build();
            }
            User existingUser = existingUserOpt.get();
            existingUser.setValid(1);
            User savedUser = userService.saveUser(existingUser);
            System.out.println("用户更新成功: " + savedUser);
            return ResponseEntity.ok(savedUser);
            
        } catch (Exception e) {
            System.err.println("更新用户信息失败: " + e.getMessage());
            e.printStackTrace();    
            return ResponseEntity.internalServerError().build();
        }
    }
    

    @GetMapping("/books")
    public List<Book> getBooks() {
        return bookService.getAllBooks();
    }
    //deleteBook
    @PutMapping("/books/delete/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
    //对应前端的addBook
    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book createdBook = bookService.createBook(book);
        return ResponseEntity.ok(createdBook);
    }
    //updateBook
    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book updatedBook = bookService.updateBook(id, book);
        System.out.println("Updated Book: " + updatedBook);
        return ResponseEntity.ok(updatedBook);
    }
    //对应前端的restoreBook
    @PutMapping("/books/restore/{id}")
    public ResponseEntity<Void> restoreBook(@PathVariable Long id) {
        bookService.restoreBook(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/books/{id}/stock")
    public ResponseEntity<Book> updateBookStock(@PathVariable Long id, @RequestBody int stock) {
        Book updatedBook = bookService.updateBookStock(id, stock);
        return ResponseEntity.ok(updatedBook);
    }
    @GetMapping("orders/{id}")
    public Order getOrder(@PathVariable Long id)
    {
        return orderService.getOrderById(id);
    }
    @PutMapping("orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatus status)
    {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
    @DeleteMapping("orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id)
    {
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("orders")
    public List<Order> getAllOrders()
    {
        return orderService.getAllOrders();
    }
    @PutMapping("orders/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order)
    {
        Order updatedOrder = orderService.updateOrder(id, order);
        return ResponseEntity.ok(updatedOrder);
    }
    @PostMapping("/migrate-passwords")
    public ResponseEntity<String> migratePasswords() {
        try {
            passwordMigrationUtil.migratePasswords();
            return ResponseEntity.ok("Password migration completed successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Password migration failed: " + e.getMessage());
        }
    }
    // ========== 统计相关接口 ==========

    /**
     * 管理员：获取书籍销量统计（热销榜）
     */
    @GetMapping("/stats/books")
    public ResponseEntity<List<OrderStatsDTO>> getBookSalesStats(
            @RequestParam String start,
            @RequestParam String end) {
        
        OrderFilterDTO filter = OrderFilterDTO.builder()
            .startTime(start)
            .endTime(end)
            .build();
            
        List<OrderStatsDTO> result = statsService.getBookSalesStats(filter);
        System.out.println("获取书籍销量统计: " + result);
        return ResponseEntity.ok(result);
    }

    /**
     * 管理员：获取用户消费统计（消费榜）
     */
    @GetMapping("/stats/users")
    public ResponseEntity<List<UserStatsDTO>> getUserConsumeStats(
            @RequestParam String start,
            @RequestParam String end) {
        
        OrderFilterDTO filter = OrderFilterDTO.builder()
            .startTime(start)
            .endTime(end)
            .build();
            
        List<UserStatsDTO> result = statsService.getUserConsumeStats(filter);
        return ResponseEntity.ok(result);
    }

    /**
     * 用户：获取个人购书统计（不再依赖前端传userId）
     */
    // 获取当前登录用户信息
    @GetMapping("/users/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    // 更新当前登录用户信息
    @PutMapping("/users/me")
    public ResponseEntity<User> updateCurrentUser(@AuthenticationPrincipal User user, @RequestBody User userData) {
        // 只允许更新部分字段（如email、phone、address等），不允许改id/username/type等
        user.setEmail(userData.getEmail());
        user.setPhone(userData.getPhone());
        user.setAddress(userData.getAddress());
        User updated = userService.saveUser(user);
        return ResponseEntity.ok(updated);
    }
}
