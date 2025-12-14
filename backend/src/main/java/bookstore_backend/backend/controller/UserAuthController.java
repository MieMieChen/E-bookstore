package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.service.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserAuthController {

    @Autowired
    private UserAuthService UserAuthService;

} 