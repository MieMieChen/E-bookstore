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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    //这一边被称为关系的所有者,当 JPA 看到 @JoinColumn 在一个类型为 User 的字段上时，它就自动知道这个外键 (user_id) 是要连接到 User 这个实体所对应的表（user 表）的
    private User user; //这个字段 user 就代表了通过 user_id 外键获取到的那个 User 对象。
}
