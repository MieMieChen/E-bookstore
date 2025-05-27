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
