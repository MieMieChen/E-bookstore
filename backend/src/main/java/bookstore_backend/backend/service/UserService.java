package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.UserAuth;
import bookstore_backend.backend.repository.UserRepository;
import bookstore_backend.backend.repository.UserAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    public UserRepository userRepository;

    @Autowired
    private UserAuthRepository userAuthRepository;

    // 注册用户
    public User register(String username, String email, String password, String address, String phone) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setAddress(address);
        user.setPhone(phone);
        user = userRepository.save(user);

        UserAuth userAuth = new UserAuth();
        userAuth.setUser(user);
        userAuth.setPassword(password);
        userAuthRepository.save(userAuth);

        return user;
    }

    // 登录校验
    public Optional<User> login(String username, String password) {
        Optional<UserAuth> userAuthOpt = userAuthRepository.findByUser_Username(username);
        if (userAuthOpt.isPresent() && userAuthOpt.get().getPassword().equals(password)) {
            return Optional.of(userAuthOpt.get().getUser());
        }
        return Optional.empty();
    }
} 