package bookstore_backend.backend.dao;

import bookstore_backend.backend.entity.UserAuth;
import java.util.Optional;

public interface UserAuthDao {
    UserAuth save(UserAuth userAuth);
    Optional<UserAuth> findByUserId(Long userId);
    Optional<UserAuth> findByUser_Username(String username);
}
