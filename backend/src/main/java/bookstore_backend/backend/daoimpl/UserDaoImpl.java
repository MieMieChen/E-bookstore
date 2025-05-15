package bookstore_backend.backend.daoimpl;

import bookstore_backend.backend.dao.UserDao;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserDaoImpl implements UserDao {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
    
    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
