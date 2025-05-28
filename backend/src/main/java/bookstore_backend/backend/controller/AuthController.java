package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.entity.UserAuth;
import bookstore_backend.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import jakarta.servlet.http.HttpSession;
import bookstore_backend.backend.service.AuthService;
import lombok.Data;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(HttpSession session) {
        return authService.getCurrentUser(session);
    }

    @PostMapping("login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> credentials, HttpSession session) {
       return authService.login(credentials, session);
    }

    @PostMapping("logout")
    public ResponseEntity<Object> logout(HttpSession session) {
        return authService.logout(session);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getAddress(),
                request.getPhone()
            );
            Map<String, Object> response = new HashMap<>();
            response.put("ok", true);
            response.put("message", "注册成功");
            response.put("data", user);
            response.put("id", user.getId());
            System.out.println("注册成功: " + user.getUsername() + ", ID: " + user.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("ok", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

@Data
class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String address;
    private String phone;
}


// 这个流程是这样的：
// 用户登录时，通过 AuthenticationManager 进行认证
// 认证成功后，认证信息被存储在 SecurityContext 中
// 访问 /api/auth/me 时，Spring Security 的过滤器链会自动检查认证状态
// AuthServiceImpl 中的 getCurrentUser 方法从 SecurityContext 获取当前用户信息
// 所以，虽然没有显式的拦截器类（Interceptor），但是通过 Spring Security 的过滤器链（Filter Chain）实现了更强大的认证和授权功能。这些过滤器在请求到达控制器之前就会进行认证检查，实际上起到了拦截器的作用。
// 主要的安全组件包括：
// SecurityConfig - 安全配置
// CustomUserDetailsService - 用户认证服务
// User 实现 UserDetails - 提供用户认证信息
// Spring Security 的过滤器链 - 处理认证和授权
// 这种实现比普通的拦截器更安全和标准化，因为它使用了 Spring Security 提供的完整安全框架。