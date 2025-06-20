package bookstore_backend.backend.dao;

import bookstore_backend.backend.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserDao {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    List<User> findAll();
    void deleteById(Long id);
    Optional<User> findByEmail(String email);
}