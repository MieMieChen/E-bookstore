package bookstore_backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;



@Builder
@Data
@Entity
@Table(name = "user_auth")
@NoArgsConstructor
@AllArgsConstructor

public class UserAuth{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @Column(nullable = false)
    private String password;
    
    private Integer type;

    @OneToOne(fetch = FetchType.LAZY) //真的访问的时候才去数据库索取数据，但是这个索取逻辑用户是感受不到的
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    //这一边被称为关系的所有者,当 JPA 看到 @JoinColumn 在一个类型为 User 的字段上时，它就自动知道这个外键 (user_id) 是要连接到 User 这个实体所对应的表（user 表）的
    private User user; //这个字段 user 就代表了通过 user_id 外键获取到的那个 User 对象。
}


