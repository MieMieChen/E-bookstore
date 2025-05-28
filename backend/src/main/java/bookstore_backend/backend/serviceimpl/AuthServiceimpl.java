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

        if (username == null || password == null) {
            return new ResponseEntity<>(
                Collections.singletonMap("message", "Username and password are required"),
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            // 1. 构造认证请求
            UsernamePasswordAuthenticationToken authRequest =
                new UsernamePasswordAuthenticationToken(username.trim(), password);
            
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
            session.setAttribute("phone", user.getPhone());
            session.setAttribute("address", user.getAddress());
            session.setAttribute("email", user.getEmail());
            session.setAttribute("valid", user.getValid());
            // 7. 创建响应对象
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("type", user.getType());
            response.put("message", "Login successful");
            response.put("ok", true);
            response.put("phone", user.getPhone());
            response.put("address", user.getAddress());
            response.put("email", user.getEmail());
            response.put("valid", user.getValid());
            
            // 8. 直接返回响应，不再设置额外的 Cookie
            return ResponseEntity.ok(response);
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

    @Override
    public ResponseEntity<Object> getCurrentUser(HttpSession session) {
        try {
            // 从 SecurityContext 获取认证信息
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return new ResponseEntity<>(
                    Collections.singletonMap("message", "Not authenticated"),
                    HttpStatus.UNAUTHORIZED
                );
            }

            // 获取用户信息
            User user = (User) authentication.getPrincipal();
            
            // 验证会话中的用户ID是否匹配
            Long sessionUserId = (Long) session.getAttribute("userId");
            if (sessionUserId == null || !sessionUserId.equals(user.getId())) {
                SecurityContextHolder.clearContext();
                session.invalidate();
                return new ResponseEntity<>(
                    Collections.singletonMap("message", "Session invalid"),
                    HttpStatus.UNAUTHORIZED
                );
            }

            // 构建响应
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("type", user.getType());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            if (session != null) {
                session.invalidate();
            }
            return new ResponseEntity<>(
                Collections.singletonMap("message", "Error retrieving user information"),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
