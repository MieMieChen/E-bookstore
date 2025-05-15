package bookstore_backend.backend.serviceimpl;

package bookstore_backend.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.Order.OrderStatus;
import bookstore_backend.backend.repository.OrderRepository;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.service.UserService;

import org.slf4j.Logger;
import java.util.Optional;
import java.util.List;
import java.util.Collections;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import bookstore_backend.backend.exception.UserNotFoundException;
import bookstore_backend.backend.exception.OrderNotFoundException;
import bookstore_backend.backend.entity.OrderItem;


@Service
public class OrderService {
    

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    // public List<Order> getAllOrders(User user) {
    //     // 这里可以添加获取所有订单的逻辑
    //     return orderRepository.findByUserOrderByOrderTimeDesc(user);
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

        // 3. 调用 Repository 获取订单列表
        // 注意：orderRepository.getAllOrders(user) 这个方法应该存在于你的 OrderRepository 中
        // 并且它应该根据用户获取订单，例如 JpaRepository 的 findByUser(User user)
        List<Order> orders = orderRepository.findByUser(user); // 假设 OrderRepository 有 findByUser 方法

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
       Order order = orderRepository.findById(orderId).get();
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
        return orderRepository.save(order);
    }

    public Order cancelOrder(Long orderId) throws OrderNotFoundException{
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        // Optional<Order> orderOpt = orderRepository.findById(orderId);
        // if (orderOpt.isPresent()) {
        //     Order order = orderOpt.get();
        //     order.setStatus(OrderStatus.CANCELLED);
        //     return orderRepository.save(order);
        // }
        if(order.getOrderItems()!=null) 
        {
            order.setStatus(OrderStatus.CANCELLED);
            return orderRepository.save(order);
        }
        return null;
    }
    public Order uodateOrderStatus(Long orderId, OrderStatus status) throws OrderNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
