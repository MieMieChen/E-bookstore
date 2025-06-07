package bookstore_backend.backend.util;

import bookstore_backend.backend.dao.UserAuthDao;
import bookstore_backend.backend.entity.UserAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PasswordMigrationUtil {

    @Autowired
    private UserAuthDao userAuthDao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public void migratePasswords() {
        // 获取所有用户认证信息
        Iterable<UserAuth> userAuths = userAuthDao.findAll();

        // 遍历每个用户，将明文密码转换为加密密码
        for (UserAuth userAuth : userAuths) {
            String plainTextPassword = userAuth.getPassword();
            // 只有当密码不是BCrypt格式时才进行加密
            if (!plainTextPassword.startsWith("$2a$")) {
                String hashedPassword = passwordEncoder.encode(plainTextPassword);
                userAuth.setPassword(hashedPassword);
                userAuthDao.save(userAuth);
            }
        }
    }
} 