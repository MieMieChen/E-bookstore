package bookstore_backend.backend.serviceimpl;


import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.UserAuth;
import bookstore_backend.backend.dao.UserDao;
import bookstore_backend.backend.dao.UserAuthDao;
import bookstore_backend.backend.service.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAuthServiceImpl implements UserAuthService {
    
    @Autowired
    private UserDao userDao;
    
    @Autowired
    private UserAuthDao userAuthDao;
    
    public User authenticateUser(String username, String password) {
        // 1. 通过用户名查找用户
        User user = userDao.findByUsername(username)
                .orElse(null);
        
        if (user == null) {
            return null; // 用户不存在
        }
        
        // 2. 通过用户ID查找认证信息
        UserAuth userAuth = userAuthDao.findByUserId(user.getId())
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