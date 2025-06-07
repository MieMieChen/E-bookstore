package bookstore_backend.backend.daoimpl;

import bookstore_backend.backend.dao.UserAuthDao;
import bookstore_backend.backend.entity.UserAuth;
import bookstore_backend.backend.repository.UserAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserAuthImpl implements UserAuthDao {
    
    @Autowired
    private UserAuthRepository userAuthRepository;
    
    @Override
    public UserAuth save(UserAuth userAuth) {
        return userAuthRepository.save(userAuth);
    }
    
    @Override
    public Optional<UserAuth> findByUserId(Long userId) {
        return userAuthRepository.findByUserId(userId);
    }
    
    @Override
    public Optional<UserAuth> findByUser_Username(String username) {
        return userAuthRepository.findByUser_Username(username);
    }

    @Override
    public Iterable<UserAuth> findAll() {
        return userAuthRepository.findAll();
    }
}
