package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.service.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAuthController {

    @Autowired
    private UserAuthService UserAuthService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("用户名和密码不能为空");
        }

        User user = UserAuthService.authenticateUser(username, password);
        
        if (user != null) {
            // 登录成功，返回用户信息（不包含密码）
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.badRequest().body("用户名或密码错误");
        }
    }
} 