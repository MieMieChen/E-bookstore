package bookstore_backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.List;

@Data  // lombok注解，自动生成getter和setter方法
@Entity //通过JPA注解指定表名
@Table(name = "users")  //通过JPA注解指定表名，默认是类名为表名
public class User {
    @Id //主键
    @GeneratedValue(strategy = GenerationType.IDENTITY) //自增主键
//  @Column(name = "user_id") //指定列名 现在是使用默认字段名id作为数据库的列名
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String email;

    private String address;
    private String phone;
    
    @ToString.Exclude
    @JsonIgnore
    //mappedBy 用在关系的非所有者一方（也就是数据库中没有外键的那个实体类里）
    @OneToMany(mappedBy = "user") //表示一个 User 对象可以对应多个 Order 对象。
    private List<Order> orders;

    @ToString.Exclude
    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL) 
    // @OneToOne(mappedBy = "user", ...) 中的 "user"。这个值指定了关系由另一方（即 UserAuth 实体）来维护，并且 "user" 必须是**UserAuth 类中引用 User 对象的那个字段的名称**。
    //cascade = CascadeType.ALL: 指定级联操作。CascadeType.ALL 表示对 User 实体执行的所有持久化操作（如保存、更新、删除）都会级联到与之关联的 UserAuth 实体上。例如，如果删除了一个 User 对象，与之关联的 UserAuth 对象也会被自动删除。
    private UserAuth userAuth;
}