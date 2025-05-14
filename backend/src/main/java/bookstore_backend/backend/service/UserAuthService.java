package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.UserAuth;
import bookstore_backend.backend.repository.UserRepository;
import bookstore_backend.backend.repository.UserAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserAuthRepository userAuthRepository;
    
    public User authenticateUser(String username, String password) {
        // 1. 通过用户名查找用户
        User user = userRepository.findByUsername(username)
                .orElse(null);
        
        if (user == null) {
            return null; // 用户不存在
        }
        
        // 2. 通过用户ID查找认证信息
        UserAuth userAuth = userAuthRepository.findByUserId(user.getId())
                .orElse(null);
        
        if (userAuth == null) {
            return null; // 认证信息不存在
        }
        
        // 3. 验证密码
        if (userAuth.getPassword().equals(password)) {
            return user; // 密码正确，返回用户信息
        }
        
        return null; // 密码错误
    }
} 