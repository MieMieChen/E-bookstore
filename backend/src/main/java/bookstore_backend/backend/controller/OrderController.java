package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.Order.OrderStatus;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.OrderItem;
import bookstore_backend.backend.entity.Cart;
import bookstore_backend.backend.repository.OrderRepository;
import bookstore_backend.backend.repository.UserRepository;
import bookstore_backend.backend.repository.BookRepository;
import bookstore_backend.backend.repository.CartRepository;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
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
            return userRepository.findById(userId)
                    .map(user -> {
                        List<Order> orders = orderRepository.findByUserOrderByOrderTimeDesc(user);
                        // 预先加载关联对象，避免延迟加载异常
                        for (Order order : orders) {
                            // 手动触发集合的初始化加载
                            if (order.getOrderItems() != null) {
                                order.getOrderItems().size();
                                // 预加载book，避免N+1查询问题
                                order.getOrderItems().forEach(item -> {
                                    if (item.getBook() != null) {
                                        item.getBook().getTitle();
                                    }
                                });
                            }
                        }
                        
                        return ResponseEntity.ok(orders);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 获取订单详情
    @GetMapping("/orders/detail/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        try {
            return orderRepository.findById(orderId)
                    .map(order -> {
                        // 预先加载关联对象，避免延迟加载异常
                        if (order.getOrderItems() != null) {
                            order.getOrderItems().forEach(item -> {
                                if (item.getBook() != null) {
                                    item.getBook().getTitle();
                                }
                            });
                        }
                        return ResponseEntity.ok(order);
                    })
                    .orElse(ResponseEntity.notFound().build());
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
            
            // 清理缓存
            entityManager.clear();
            
            // 确保orderTime有值
            order.setOrderTime(LocalDateTime.now());
            
            // 验证用户
            User user = userRepository.findById(order.getUser().getId())
                    .orElse(null);
            if (user == null) {
                System.out.println("用户不存在: " + order.getUser().getId());
                return ResponseEntity.badRequest().build();
            }
            
            // 设置关联
            order.setUser(user);
            
            // Order类中可能使用了createdAt
            // 尝试设置日期字段
            try {
                java.lang.reflect.Method method = Order.class.getMethod("setCreatedAt", LocalDateTime.class);
                method.invoke(order, LocalDateTime.now());
                System.out.println("成功设置订单创建时间");
            } catch (Exception e) {
                System.err.println("找不到设置订单时间的方法: " + e.getMessage());
            }
            
            // 验证订单项中的图书
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    bookRepository.findById(item.getBook().getId())
                            .ifPresent(book -> {
                                item.setBook(book);
                                item.setOrder(order);
                            });
                }
            }
            
            // 保存订单
            Order savedOrder = orderRepository.save(order);
            
            // 刷新实体，确保从数据库获取最新状态
            entityManager.flush();
            entityManager.refresh(savedOrder);
            
            // 清空该用户的购物车
            try {
                System.out.println("正在清空用户 " + user.getId() + " 的购物车...");
                
                try {
                    // 先尝试使用原生SQL，绕过安全更新模式
                    System.out.println("禁用安全更新模式...");
                    cartRepository.disableSafeUpdates();
                    
                    System.out.println("使用原生SQL删除购物车数据...");
                    cartRepository.deleteByUserIdNative(user.getId());
                    
                    System.out.println("恢复安全更新模式...");
                    cartRepository.enableSafeUpdates();
                    
                    System.out.println("购物车清空成功(原生SQL)");
                } catch (Exception sqlEx) {
                    System.err.println("原生SQL删除失败，尝试使用JPA方法: " + sqlEx.getMessage());
                    
                    // 如果原生SQL查询失败，回退到使用JPA方法
                    List<Cart> userCartItems = cartRepository.findByUser(user);
                    System.out.println("找到 " + userCartItems.size() + " 个购物车项，逐个删除...");
                    
                    for (Cart cart : userCartItems) {
                        System.out.println("删除购物车项 ID: " + cart.getId());
                        cartRepository.deleteById(cart.getId());
                    }
                }
                
                entityManager.flush(); // 立即执行删除操作
                System.out.println("购物车清空过程完成");
            } catch (Exception e) {
                System.err.println("清空购物车失败: " + e.getMessage());
                e.printStackTrace();
                // 继续处理，不因为清空购物车失败而影响订单创建
            }
            
            System.out.println("订单创建成功: " + savedOrder.getId());
            return ResponseEntity.ok(savedOrder);
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
            return orderRepository.findById(orderId)
                    .map(order -> {
                        order.setStatus(OrderStatus.CANCELLED);
                        return ResponseEntity.ok(orderRepository.save(order));
                    })
                    .orElse(ResponseEntity.notFound().build());
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
            return orderRepository.findById(orderId)
                    .map(order -> {
                        order.setStatus(status);
                        return ResponseEntity.ok(orderRepository.save(order));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 清除二级缓存的示例方法
    @PostMapping("/clearCache")
    public ResponseEntity<String> clearCache() {
        try {
            // 清除一级缓存
            entityManager.clear();
            
            // 如果启用了二级缓存，可以这样清理特定实体的缓存
            // entityManager.getEntityManagerFactory().getCache().evict(Order.class);
            
            return ResponseEntity.ok("缓存已清理");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

} 