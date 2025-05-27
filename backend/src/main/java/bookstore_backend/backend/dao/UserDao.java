package bookstore_backend.backend.dao;

import bookstore_backend.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserDao extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    List<User> findAll();
    void deleteById(Long id);
    User save(User user);
    Optional<User> findById(Long id);   
    
}
