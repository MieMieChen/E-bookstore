package bookstore_backend.backend.repository;

import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    // Add method to get orders sorted by orderTime descending (newest first)
    List<Order> findByUserOrderByOrderTimeDesc(User user);
    
    // Add method to sort by created time if orderTime is not reliable
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByOrderTimeBetweenAndBookTitle(String startTime,String endTime,String bookTitle);
} 