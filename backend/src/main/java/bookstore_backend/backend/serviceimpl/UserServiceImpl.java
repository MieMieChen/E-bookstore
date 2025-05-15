package bookstore_backend.backend.serviceimpl;


import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.UserAuth;
import bookstore_backend.backend.repository.UserRepository;
import bookstore_backend.backend.repository.UserAuthRepository;
import bookstore_backend.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service  //springboot的注解，表示这是一个服务类 一个 Spring Bean 就是一个由 Spring IoC (Inversion of Control) 容器 实例化、组装和管理的 Java 对象
public class UserServiceImpl implements UserService{
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
// Service 层的方法返回业务数据 (例如 Optional<User> 或 User 对象)。
// Controller 层接收 Service 层返回的业务数据，然后根据数据构建 ResponseEntity。
     public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    // 登录校验
    public Optional<User> login(String username, String password) {
        Optional<UserAuth> userAuthOpt = userAuthRepository.findByUser_Username(username);
        if (userAuthOpt.isPresent() && userAuthOpt.get().getPassword().equals(password)) {
            return Optional.of(userAuthOpt.get().getUser());
        }
        return Optional.empty();
    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
} 