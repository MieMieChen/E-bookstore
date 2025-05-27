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

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    @Autowired
    private AuthService authService;

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
}
