package bookstore_backend.backend.serviceimpl;

import jakarta.annotation.Resource;
import bookstore_backend.backend.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
        User user = userDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        // 确保UserAuth被加载
        if (user.getUserAuth() == null) {
            throw new UsernameNotFoundException("User authentication details not found for user: " + username);
        }
        
        // 打印调试信息
        System.out.println("=== Debug: Loading User Details ===");
        System.out.println("Username: " + user.getUsername());
        System.out.println("Password: " + (user.getPassword() != null ? "[PROTECTED]" : "null"));
        System.out.println("Authorities: " + user.getAuthorities());
        System.out.println("==============================");
        
        return user;
    }
} 