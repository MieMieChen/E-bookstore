package bookstore_backend.backend.service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import bookstore_backend.backend.entity.User;
import jakarta.servlet.http.HttpSession;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    /**
     * 用户登录方法
     *
     * @param loginRequest 包含用户名和密码的请求参数
     * @return 登录结果，包含状态码、提示信息和数据
     */
    ResponseEntity<Object> login(@RequestBody Map<String, String> credentials, HttpSession session);

    @Transactional
    ResponseEntity<Object> logout(HttpSession session);

    ResponseEntity<Object> getCurrentUser(HttpSession session);
}

