package bookstore_backend.backend.daoimpl;

import bookstore_backend.backend.dao.UserDao;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;
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
    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }
    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
