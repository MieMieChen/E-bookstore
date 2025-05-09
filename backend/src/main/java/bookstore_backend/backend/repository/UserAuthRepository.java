package bookstore_backend.backend.repository;

import bookstore_backend.backend.entity.UserAuth;
import bookstore_backend.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, Long> {
    Optional<UserAuth> findByUser(User user);
    Optional<UserAuth> findByUser_Username(String username);
} 