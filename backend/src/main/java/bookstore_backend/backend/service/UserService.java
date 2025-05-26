package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service  //springboot的注解，表示这是一个服务类 一个 Spring Bean 就是一个由 Spring IoC (Inversion of Control) 容器 实例化、组装和管理的 Java 对象
public interface UserService{
   
    // 注册用户
    public User register(String username, String email, String password, String address, String phone) ;
// Service 层的方法返回业务数据 (例如 Optional<User> 或 User 对象)。
// Controller 层接收 Service 层返回的业务数据，然后根据数据构建 ResponseEntity。
    public Optional<User> findUserById(Long id);
    public User saveUser(User user);
    public List<User> listUsers();
} 