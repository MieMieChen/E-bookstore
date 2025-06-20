package bookstore_backend.backend.dao;

import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderDao {
    List<Order> findAll();
    Order save(Order order);
    Optional<Order> findById(Long id);
    void deleteById(Long id);
    List<Order> findByUser(User user);
    List<Order> findByUserOrderByOrderTimeDesc(User user);
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByOrderTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    List<Order> findByTimeRange(LocalDateTime start, LocalDateTime end);
    List<Order> findByUserIdAndTimeRange(Long userId, LocalDateTime start, LocalDateTime end);
}
