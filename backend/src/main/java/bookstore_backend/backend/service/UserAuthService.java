package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.User;
import org.springframework.stereotype.Service;

@Service
public interface  UserAuthService {
    public User authenticateUser(String username, String password) ;
} 