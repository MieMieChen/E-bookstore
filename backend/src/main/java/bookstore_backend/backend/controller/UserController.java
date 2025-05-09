package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    // 用户注册
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody Map<String, String> body) {
        User user = userService.register(
                body.get("username"),
                body.get("email"),
                body.get("password"),
                body.get("address"),
                body.get("phone")
        );
        return ResponseEntity.ok(user);
    }

    // 用户登录
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> body) {
        Optional<User> user = userService.login(body.get("username"), body.get("password"));
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    // 获取用户信息（不含密码）
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 更新用户信息
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            System.out.println("接收到更新用户请求: " + updatedUser);
            
            // 校验用户是否存在
            Optional<User> existingUserOpt = userService.userRepository.findById(id);
            if (existingUserOpt.isEmpty()) {
                System.out.println("找不到用户ID: " + id);
                return ResponseEntity.notFound().build();
            }
            
            User existingUser = existingUserOpt.get();
            
            // 更新字段 - 但保留ID和用户名不变
            if (updatedUser.getEmail() != null) {
                existingUser.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getAddress() != null) {
                existingUser.setAddress(updatedUser.getAddress());
            }
            if (updatedUser.getPhone() != null) {
                existingUser.setPhone(updatedUser.getPhone());
            }
            
            // 保存更新后的用户
            User savedUser = userService.userRepository.save(existingUser);
            System.out.println("用户更新成功: " + savedUser);
            
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            System.err.println("更新用户信息失败: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
} 