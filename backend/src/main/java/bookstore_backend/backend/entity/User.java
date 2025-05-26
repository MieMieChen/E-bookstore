package bookstore_backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.List;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

@Builder
@Data  // lombok注解，自动生成getter和setter方法
@Entity //通过JPA注解指定表名
@Table(name = "users")  //通过JPA注解指定表名，默认是类名为表名
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
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
    private Integer type;

    
    @ToString.Exclude
    @JsonIgnore //避免在序列化时出现循环引用
    //mappedBy 用在关系的非所有者一方（也就是数据库中没有外键的那个实体类里）
    @OneToMany(mappedBy = "user") //表示一个 User 对象可以对应多个 Order 对象。
    private List<Order> orders;

    @ToString.Exclude
    @JsonIgnore //
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL) 
    // @OneToOne(mappedBy = "user", ...) 中的 "user"。这个值指定了关系由另一方（即 UserAuth 实体）来维护，并且 "user" 必须是**UserAuth 类中引用 User 对象的那个字段的名称**。
    //cascade = CascadeType.ALL: 指定级联操作。CascadeType.ALL 表示对 User 实体执行的所有持久化操作（如保存、更新、删除）都会级联到与之关联的 UserAuth 实体上。例如，如果删除了一个 User 对象，与之关联的 UserAuth 对象也会被自动删除。
    private UserAuth userAuth;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = type == 1 ? "ROLE_ADMIN" : "ROLE_USER";
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return userAuth != null ? userAuth.getPassword() : null;
    }
    @Override
    public String getUsername() {
        return username;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
}