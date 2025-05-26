package bookstore_backend.backend.serviceimpl;

import jakarta.annotation.Resource;
import bookstore_backend.backend.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class  CustomUserDetailsService implements UserDetailsService {


    @Autowired
    private UserDao userDao;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
       //  User userInfo = userDao.findByUsername(username).orElse(null);
        // if(userInfo == null) {
        //     throw new UsernameNotFoundException("not found");
        // }
        // //定义权限列表.
        // List<GrantedAuthority> authorities = new ArrayList<>();
        // // 用户可以访问的资源名称（或者说用户所拥有的权限） 注意：必须"ROLE_"开头
        // authorities.add(new SimpleGrantedAuthority("ROLE_"+ userInfo.getRole()));
        // User userDetails = new User(userInfo.getUserName(),passwordEncoder.encode(userInfo.getPassword()),authorities);
        // return userDetails;
    }
} 