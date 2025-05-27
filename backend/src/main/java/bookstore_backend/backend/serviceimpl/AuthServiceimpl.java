package bookstore_backend.backend.serviceimpl;

import bookstore_backend.backend.dao.UserDao;
import bookstore_backend.backend.dao.UserAuthDao;
import bookstore_backend.backend.entity.UserAuth;

import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.service.AuthService;
import bookstore_backend.backend.service.UserService;
import bookstore_backend.backend.dto.UserDTO;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class AuthServiceimpl  implements AuthService {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public ResponseEntity<Object> login(Map<String, String> credentials, HttpSession session) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        System.out.println("=== Login Attempt Debug ===");
        System.out.println("Username: " + username);
        System.out.println("Password length: " + (password != null ? password.length() : 0));
        System.out.println("========================");

        // 验证输入
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            System.out.println("Login failed: Empty username or password");
            return new ResponseEntity<>(
                Collections.singletonMap("message", "Username and password are required"),
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            // 1. 构造认证请求
            UsernamePasswordAuthenticationToken authRequest =
                new UsernamePasswordAuthenticationToken(username.trim(), password);
            
            System.out.println("=== Authentication Request ===");
            System.out.println("Auth Request: " + authRequest);
            System.out.println("Principal: " + authRequest.getPrincipal());
            System.out.println("Credentials present: " + (authRequest.getCredentials() != null));
            System.out.println("===========================");
            
            // 2. 认证
            Authentication authentication = authenticationManager.authenticate(authRequest);
            
            // 3. 保存认证信息到 SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 4. 将 SecurityContext 保存到 Session
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            
            // 5. 获取用户信息
            User user = (User) authentication.getPrincipal();
            
            // 6. 为了方便调试，额外保存一些信息到 session
            session.setAttribute("username", username);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userType", user.getType());
            session.setAttribute("authorities", authentication.getAuthorities());
            
            // 7. 打印调试信息
            System.out.println("=== Login Success Debug ===");
            System.out.println("Username: " + username);
            System.out.println("Session ID: " + session.getId());
            System.out.println("User ID: " + user.getId());
            System.out.println("User Type: " + user.getType());
            System.out.println("User Email: " + user.getEmail());
            System.out.println("Password present: " + (user.getPassword() != null));
            System.out.println("UserAuth present: " + (user.getUserAuth() != null));
            System.out.println("Authorities: " + authentication.getAuthorities());
            System.out.println("SecurityContext: " + SecurityContextHolder.getContext());
            System.out.println("========================");
            
            // 8. 返回用户信息
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("type", user.getType());
            response.put("message", "Login successful");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AuthenticationException e) {
            System.out.println("=== Authentication Failed ===");
            System.out.println("Username: " + username);
            System.out.println("Error type: " + e.getClass().getSimpleName());
            System.out.println("Error message: " + e.getMessage());
            e.printStackTrace();
            System.out.println("=========================");
            
            // 清理可能部分创建的会话数据
            SecurityContextHolder.clearContext();
            if (session != null) {
                session.invalidate();
            }
            
            return new ResponseEntity<>(
                Collections.singletonMap("message", "Invalid username or password"),
                HttpStatus.UNAUTHORIZED
            );
        } catch (Exception e) {
            System.out.println("=== Unexpected Error ===");
            System.out.println("Username: " + username);
            System.out.println("Error type: " + e.getClass().getSimpleName());
            System.out.println("Error message: " + e.getMessage());
            e.printStackTrace();
            System.out.println("======================");
            
            return new ResponseEntity<>(
                Collections.singletonMap("message", "An unexpected error occurred"),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Override
    @Transactional
    public ResponseEntity<Object> logout(HttpSession session) {
        // 清除认证信息
        SecurityContextHolder.clearContext();
        // 使session失效
        session.invalidate();
        
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("message", "Logged out successfully");
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
}
