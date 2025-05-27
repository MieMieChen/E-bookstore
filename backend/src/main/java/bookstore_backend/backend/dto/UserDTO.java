// src/main/java/bookstore_backend/backend/dto/UserDTO.java
package bookstore_backend.backend.dto;

import java.io.Serializable; // 通常建议实现Serializable

import lombok.Data;
import lombok.Builder;


@Data
@Builder
public class UserDTO implements Serializable {

    private static final long serialVersionUID = 1L; // 序列化版本UID

    private Long id;
    private String username;
    private String email;
    private String address;
    private String phone;
    private Integer type;  // 添加用户类型字段
    // 不包含 password 字段

    // 1. 无参构造函数 (通常需要)
    public UserDTO() {
    }

    // 2. 带所有参数的构造函数 (方便创建)
    public UserDTO(Long id, String username, String email, String address, String phone, Integer type) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.type = type;
    }

   
    // 5. (可选) 重写 toString(), equals(), hashCode() 方法，方便调试和比较
    @Override
    public String toString() {
        return "UserDTO{" +
               "id=" + id +
               ", username='" + username + '\'' +
               ", email='" + email + '\'' +
               ", address='" + address + '\'' +
               ", phone='" + phone + '\'' +
               ", type=" + type +
               '}';
    }
}