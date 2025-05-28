package bookstore_backend.backend.daoimpl;

import bookstore_backend.backend.dao.OrderDao;
import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class OrderDaoImpl implements OrderDao {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Override
    public List<Order> findAll() {
        return orderRepository.findAll();
    }
    
    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }
    
    @Override
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }
    
    @Override
    public List<Order> findByUser(User user) {
        return orderRepository.findByUser(user);
    }
    
    @Override
    public List<Order> findByUserOrderByOrderTimeDesc(User user) {
        return orderRepository.findByUserOrderByOrderTimeDesc(user);
    }
    
    @Override
    public List<Order> findByUserOrderByCreatedAtDesc(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
    @Override
    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }
    @Override
    public List<Order> findByOrderTimeBetweenAndBookTitle(String startTime,String endTime,String bookTitle)
    {
        return orderRepository.findByOrderTimeBetweenAndBookTitle(startTime,endTime,bookTitle);
    }
}
