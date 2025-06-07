package bookstore_backend.backend.serviceimpl;

import bookstore_backend.backend.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import bookstore_backend.backend.entity.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("=== Loading User Details for Authentication ===");
        System.out.println("Username: " + username);
        
        User user = userDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        // 确保UserAuth被加载
        if (user.getUserAuth() == null) {
            throw new UsernameNotFoundException("User authentication details not found for user: " + username);
        }

        // 打印存储的加密密码（只显示前10个字符）
        String storedPassword = user.getPassword();
        System.out.println("Stored Password (BCrypt): " + 
            (storedPassword != null ? storedPassword.substring(0, Math.min(10, storedPassword.length())) + "..." : "null"));
        System.out.println("User Type: " + user.getType());
        System.out.println("=== User Details Loaded Successfully ===");
        
        return user;
    }
} 