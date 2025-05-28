package bookstore_backend.backend.serviceimpl;


import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.UserAuth;
import bookstore_backend.backend.dao.UserDao;
import bookstore_backend.backend.dao.UserAuthDao;
import bookstore_backend.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service  //springboot的注解，表示这是一个服务类 一个 Spring Bean 就是一个由 Spring IoC (Inversion of Control) 容器 实例化、组装和管理的 Java 对象
public class UserServiceImpl implements UserService{
    @Autowired
    private UserDao userDao;

    @Autowired
    private UserAuthDao userAuthDao;

    // 注册用户
    @Override
    public User register(String username, String email, String password, String address, String phone) {
        // 检查用户名是否已存在
        if (userDao.findByUsername(username).isPresent()) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查邮箱是否已存在
        if (userDao.findByEmail(email).isPresent()) {
            throw new RuntimeException("邮箱已被使用");
        }

        // 创建新用户
        User user = User.builder()
                .username(username)
                .email(email)
                .address(address)
                .phone(phone)
                .type(0)  // 默认为普通用户
                .valid(0) // 默认为未禁用用户
                .build();

        // 保存用户基本信息
        user = userDao.save(user);

        // 创建用户认证信息
        UserAuth userAuth = UserAuth.builder()
                .user(user)
                .password(password)
                .type(0)  // 设置为普通用户
                .build();

        // 保存认证信息
        userAuthDao.save(userAuth);

        return user;
    }
// Service 层的方法返回业务数据 (例如 Optional<User> 或 User 对象)。
// Controller 层接收 Service 层返回的业务数据，然后根据数据构建 ResponseEntity。
     public Optional<User> findUserById(Long id) {
        return userDao.findById(id);
    }

    // 登录校验
    public Optional<User> login(String username, String password) {
        Optional<UserAuth> userAuthOpt = userAuthDao.findByUser_Username(username);
        if (userAuthOpt.isPresent() && userAuthOpt.get().getPassword().equals(password)) {
            return Optional.of(userAuthOpt.get().getUser());
        }
        return Optional.empty();
    }
    public User saveUser(User user) {
        return userDao.save(user);
    }
    public List<User> listUsers() {
        return userDao.findAll();
    }
    public void deleteUser(Long id) {
        userDao.deleteById(id);
    }
    public User createUser(User user) {
        return userDao.save(user);
    }
    public User updateUser(Long id, User user) {
        User existingUser = userDao.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setAddress(user.getAddress());
        existingUser.setPhone(user.getPhone());
        return userDao.save(existingUser);
    }
} 