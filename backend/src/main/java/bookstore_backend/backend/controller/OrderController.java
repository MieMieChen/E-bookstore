package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.OrderStatus;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.exception.OrderNotFoundException;
import bookstore_backend.backend.exception.UserNotFoundException;
import bookstore_backend.backend.entity.OrderItem;
import bookstore_backend.backend.service.OrderService;
import bookstore_backend.backend.service.UserService;
import bookstore_backend.backend.service.BookService;
import bookstore_backend.backend.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private UserService userService;
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private CartService cartService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    private final ObjectMapper objectMapper;
    
    public OrderController() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    // 获取用户的所有订单
    @GetMapping("/orders/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        try {
            // 直接调用 Service 方法，Service 会处理查找用户、获取订单和预加载细节
            List<Order> orders = orderService.getUserOrders(userId);

            // 如果 Service 成功返回列表，则返回 200 OK
            // 即使列表为空 (用户没有订单)，也是成功，返回 200 和空列表
            return ResponseEntity.ok(orders);

        } catch (UserNotFoundException e) {
            // 如果 Service 抛出 UserNotFoundException，Controller 捕获并返回 404 Not Found
            //logger.warn("获取用户ID {} 订单失败: {}", userId, e.getMessage()); // 使用日志记录警告
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            // 捕获 Service 层或其他地方抛出的其他意外异常，返回 500 Internal Server Error
            //logger.error("获取用户ID {} 订单时发生内部错误: {}", userId, e.getMessage(), e); // 使用日志记录错误及堆栈
            return ResponseEntity.internalServerError().build();
        }
    }

    // 获取订单详情
    @GetMapping("/orders/detail/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        try {
            Order order = orderService.getUsersOrderWithDetails(orderId);
            if (order != null) {
                return ResponseEntity.ok(order);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 创建新订单
    @PostMapping("/orders")
    @Transactional
    //@RequestBody 数据来源： 该方法期望从 HTTP 请求的消息体 (Request Body) 中读取数据。
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            System.out.println("接收到创建订单请求: " + order);
            entityManager.clear();
            order.setOrderTime(LocalDateTime.now());
            User user = userService.findUserById(order.getUser().getId())
                    .orElse(null);
            if (user == null) {
                System.out.println("用户不存在: " + order.getUser().getId());
                return ResponseEntity.badRequest().build();
            }
            order.setUser(user);
            try {
                java.lang.reflect.Method method = Order.class.getMethod("setCreatedAt", LocalDateTime.class);
                method.invoke(order, LocalDateTime.now());
                System.out.println("成功设置订单创建时间");
            } catch (Exception e) {
                System.err.println("找不到设置订单时间的方法: " + e.getMessage());
            }
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    bookService.getBookById(item.getBook().getId())
                            .ifPresent(book -> {
                                item.setBook(book);
                                item.setOrder(order);
                            });
                }
            }
            Order savedOrder = orderService.saveOrder(order);
            entityManager.flush();
            entityManager.refresh(savedOrder);
            try {
                cartService.clearUserCart(user.getId());
                System.out.println("订单创建成功: " + savedOrder.getId());
                return ResponseEntity.ok(savedOrder);
            }
            catch (UserNotFoundException e) {
            // If the service throws UserNotFoundException, return 404 Not Found
            System.err.println("Error clearing cart: " + e.getMessage()); // Replace with logger
            // Consider using a Global Exception Handler for cleaner error mapping
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            // Catch any other exceptions from the service and return 500 Internal Server Error
            System.err.println("Error clearing cart: " + e.getMessage()); // Replace with logger
            e.printStackTrace(); // Replace with logger
            // Consider using a Global Exception Handler
            return ResponseEntity.internalServerError().build();
        }
            
            
        } catch (Exception e) {
            System.err.println("创建订单失败: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 取消订单
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long orderId) {
        try {
            Order order = orderService.cancelOrder(orderId);
            if (order != null) {
                return ResponseEntity.ok(order);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (OrderNotFoundException e) {
            // 如果 Service 抛出 UserNotFoundException，Controller 捕获并返回 404 Not Found
            //logger.warn("获取用户ID {} 订单失败: {}", userId, e.getMessage()); // 使用日志记录警告
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            // 捕获 Service 层或其他地方抛出的其他意外异常，返回 500 Internal Server Error
            //logger.error("获取用户ID {} 订单时发生内部错误: {}", userId, e.getMessage(), e); // 使用日志记录错误及堆栈
            return ResponseEntity.internalServerError().build();
        }
    }


    @PutMapping("/orders/{orderId}/pay")
    public ResponseEntity<?> payOrder(@PathVariable Long orderId) {
        try {
            Order order = orderService.payOrder(orderId);
            if (order != null) {
                return ResponseEntity.ok(order);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

        
    // 更新订单状态
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        try {
            Order order = orderService.uodateOrderStatus(orderId, status);
            if (order != null) {
                return ResponseEntity.ok(order);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (OrderNotFoundException e) {
            // 如果 Service 抛出 UserNotFoundException，Controller 捕获并返回 404 Not Found
            //logger.warn("获取用户ID {} 订单失败: {}", userId, e.getMessage()); // 使用日志记录警告
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            // 捕获 Service 层或其他地方抛出的其他意外异常，返回 500 Internal Server Error
            //logger.error("获取用户ID {} 订单时发生内部错误: {}", userId, e.getMessage(), e); // 使用日志记录错误及堆栈
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderStatus> getOrderStatus(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            if (order != null) {
                return ResponseEntity.ok(order.getStatus());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (OrderNotFoundException e) {
            // 如果 Service 抛出 OrderNotFoundException，Controller 捕获并返回 404 Not Found
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // 捕获 Service 层或其他地方抛出的其他意外异常，返回 500 Internal Server Error
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/orders/search")
    public ResponseEntity<List<Order>> searchOrders(
    @RequestParam(required = false) String startTime,
    @RequestParam(required = false) String endTime,
    @RequestParam(required = false) String bookTitle
 )
 {
    try {
        List<Order> orders = orderService.searchOrders(startTime, endTime, bookTitle);
        return ResponseEntity.ok(orders);
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
 }
    

}