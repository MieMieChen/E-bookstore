package bookstore_backend.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.Order.OrderStatus;

import org.springframework.transaction.annotation.Transactional;

import bookstore_backend.backend.exception.UserNotFoundException;
import bookstore_backend.backend.exception.OrderNotFoundException;


@Service
public interface OrderService {
    
    // public List<Order> getAllOrders(User user) {
    //     // 这里可以添加获取所有订单的逻辑
    //     return orderRepository.findByUserOrderByOrderTimeDesc(user);
    // }
   @Transactional(readOnly = true) // 读取操作，使用只读事务可以提高性能
    public List<Order> getUserOrders(Long userId) throws UserNotFoundException ;
    public Order getUsersOrderWithDetails(Long orderId);
    public Order saveOrder(Order order)  ;

    public Order cancelOrder(Long orderId) throws OrderNotFoundException;
    public Order uodateOrderStatus(Long orderId, OrderStatus status) throws OrderNotFoundException;
}
