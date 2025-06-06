package bookstore_backend.backend.serviceimpl;


import java.util.List;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.OrderStatus;
import bookstore_backend.backend.dao.OrderDao;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.service.OrderService;
import bookstore_backend.backend.service.UserService;
import bookstore_backend.backend.service.BookService;

import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import bookstore_backend.backend.exception.UserNotFoundException;
import bookstore_backend.backend.exception.OrderNotFoundException;
import bookstore_backend.backend.entity.OrderItem;
import bookstore_backend.backend.entity.Book;

@Service
public class OrderServiceImpl implements OrderService {
    

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    // public List<Order> getAllOrders(User user) {
    //     // 这里可以添加获取所有订单的逻辑
    //     return orderDao.findByUserOrderByOrderTimeDesc(user);
    // }
   @Transactional(readOnly = true) // 读取操作，使用只读事务可以提高性能
    public List<Order> getUserOrders(Long userId) throws UserNotFoundException {
        // 1. 获取用户
        User user = userService.findUserById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        // 2. 获取该用户的所有订单，按时间倒序排列
        List<Order> orders = orderDao.findByUserOrderByOrderTimeDesc(user);

        // 3. 预加载所有关联数据
        for (Order order : orders) {
            if (order.getOrderItems() != null) {
                order.getOrderItems().size(); // 触发 OrderItems 集合的加载

                for (OrderItem item : order.getOrderItems()) {
                    if (item.getBook() != null) {
                        // 确保加载所有必要的书籍信息
                        item.getBook().getTitle();
                        item.getBook().getAuthor();
                        item.getBook().getPrice();
                        item.getBook().getImageUrl();
                    } else {
                        throw new RuntimeException("Book data not found for OrderItem ID: " + item.getId());
                    }
                }
            }
        }

        return orders;
    }
    
    public Order getUsersOrderWithDetails(Long orderId)
    {
       Order order = orderDao.findById(orderId).get();
        if(order.getOrderItems() != null)
        {
            order.getOrderItems().size();
            for(OrderItem item:order.getOrderItems())
            {
                if(item.getBook() != null)
                {
                    item.getBook().getTitle();
                }
            }
        }
        return order;

    }
    public Order saveOrder(Order order) {
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                // 确保book对象被完整加载
                if (item.getBook() != null && item.getBook().getId() != null) {
                    // 如果只传入了book id，需要加载完整的book对象
                    if (item.getBook().getTitle() == null) {
                        Book fullBook = bookService.getBookById(item.getBook().getId())
                                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + item.getBook().getId()));
                        item.setBook(fullBook);
                    }
                }
                item.setOrder(order);
            }
        }
        return orderDao.save(order);
    }

    public Order cancelOrder(Long orderId) throws OrderNotFoundException{
        Order order = orderDao.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        // Optional<Order> orderOpt = orderDao.findById(orderId);
        // if (orderOpt.isPresent()) {
        //     Order order = orderOpt.get();
        //     order.setStatus(OrderStatus.CANCELLED);
        //     return orderDao.save(order);
        // }
        if(order.getOrderItems()!=null) 
        {
            order.setStatus(OrderStatus.CANCELLED);
            return orderDao.save(order);
        }
        return null;
    }
    public Order uodateOrderStatus(Long orderId, OrderStatus status) throws OrderNotFoundException {
        Order order = orderDao.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(status);
        return orderDao.save(order);
    }
    public Order getOrderById(Long orderId)
    {
        return orderDao.findById(orderId).get();
    }
    public List<Order> getAllOrders()
    {
        return orderDao.findAll();
    }
    public void deleteOrder(Long orderId)
    {
        orderDao.deleteById(orderId);
    }
    public Order updateOrder(Long orderId, Order order)
    {
        return orderDao.save(order);
    }
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderDao.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(status);
        return orderDao.save(order);
    }
    public List<Order> searchOrders(String startTime, String endTime, String bookTitle) {
        try {
            List<Order> orders;
            System.out.println("Search parameters - startTime: " + startTime + ", endTime: " + endTime + ", bookTitle: " + bookTitle);

            if (startTime != null && endTime != null) {
                LocalDateTime start = LocalDateTime.parse(startTime);
                LocalDateTime end = LocalDateTime.parse(endTime);
                orders = orderDao.findByOrderTimeBetween(start, end);
                System.out.println("Searching by time range, found orders: " + orders.size());
            } else {
                orders = orderDao.findAll();
                System.out.println("Getting all orders, found: " + orders.size());
            }

            if (orders.isEmpty()) {
                System.out.println("No orders found");
                return List.of();
            }

            if (bookTitle != null && !bookTitle.trim().isEmpty()) {
                orders = orders.stream()
                    .filter(order -> order.getOrderItems() != null && 
                        order.getOrderItems().stream()
                            .anyMatch(item -> item.getBook() != null && 
                                item.getBook().getTitle().contains(bookTitle)))
                    .collect(Collectors.toList());
                System.out.println("After book title filter, found orders: " + orders.size());
            }

            System.out.println("Final orders result size: " + orders.size());
            return orders;
        } catch (Exception e) {
            System.err.println("Error in searchOrders: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
}