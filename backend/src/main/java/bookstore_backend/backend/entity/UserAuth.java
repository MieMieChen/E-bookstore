package bookstore_backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_auth")
public class UserAuth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String authType = "password";

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
