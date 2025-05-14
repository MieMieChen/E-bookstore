package bookstore_backend.backend.repository;

import bookstore_backend.backend.entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserAuthRepository extends JpaRepository<UserAuth, Long> {
    Optional<UserAuth> findByUserId(Long userId);
    Optional<UserAuth> findByUser_Username(String username);
} 