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
        try {
            // 1. 构造认证请求
            UsernamePasswordAuthenticationToken authRequest =
                new UsernamePasswordAuthenticationToken(username, password);
            // 2. 认证
            Authentication authentication = authenticationManager.authenticate(authRequest);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // 3. 认证成功，获取UserDetails
            User user = (User) authentication.getPrincipal();
            
            // 4. 返回用户信息
            System.out.println("Session ID: " + session.getId());
            UserDTO userDTO = UserDTO.builder().id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .build();
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Invalid username or password"),
                    HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<Object> logout(HttpSession session) {
        System.out.println("Session ID: " + session.getId());
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("message", "Logged out successfully");
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
}
