package bookstore_backend.backend.serviceimpl;


import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.Order.OrderStatus;
import bookstore_backend.backend.dao.OrderDao;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.service.OrderService;
import bookstore_backend.backend.service.UserService;

import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

import bookstore_backend.backend.exception.UserNotFoundException;
import bookstore_backend.backend.exception.OrderNotFoundException;
import bookstore_backend.backend.entity.OrderItem;

@Service
public class OrderServiceImpl implements OrderService {
    

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private UserService userService;

    // public List<Order> getAllOrders(User user) {
    //     // 这里可以添加获取所有订单的逻辑
    //     return orderDao.findByUserOrderByOrderTimeDesc(user);
    // }
   @Transactional(readOnly = true) // 读取操作，使用只读事务可以提高性能
    public List<Order> getUserOrders(Long userId) throws UserNotFoundException {
        // 1. 在 Service 层查找用户
        Optional<User> userOpt = userService.findUserById(userId);

        // 2. 处理用户不存在的业务逻辑，抛出自定义异常
        if (!userOpt.isPresent()) {
            // logger.warn("用户ID {} 不存在，无法获取订单。", userId); // 使用日志记录警告
            throw new UserNotFoundException("User not found with ID: " + userId);
        }

        User user = userOpt.get();
        // logger.info("获取用户ID {} 的订单列表。", userId); // 使用日志记录信息

        // 3. 调用 Dao 获取订单列表
        List<Order> orders = orderDao.findByUser(user);

        // 4. 在 Service 层手动触发关联对象的加载，避免 LazyInitializationException
        // 这是一个解决延迟加载问题的临时方法。更好的方法是在 Repository 层使用 JOIN FETCH 或 @EntityGraph
        for (Order order : orders) {
             // 确保在同一个事务或会话中访问关联集合
            if (order.getOrderItems() != null) {
                // 触发 OrderItems 集合的加载
                order.getOrderItems().size(); // 访问集合大小会触发加载

                for (OrderItem item : order.getOrderItems()) {
                    // 触发 OrderItem 关联的 Book 的加载
                    if (item.getBook() != null) {
                         // 访问 Book 的某个属性会触发加载
                        item.getBook().getTitle(); // 例如访问书名
                        // 或者 item.getBook().getId();
                    }
                }
            }
        }

       //  logger.info("成功获取并预加载用户ID {} 的 {} 个订单。", userId, orders.size()); // 使用日志记录成功

        // 5. Service 返回处理好的订单列表
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
    public Order saveOrder(Order order)  {
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
}
