package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

import javax.swing.Spring;

@RestController  //接口方法返回对象 转换成json文本
@RequestMapping("/api/users")  //后面的路径不能重复！
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    
//     @Autowired：告诉 Spring 自动从容器中查找匹配的 UserService 实现并注入。
//     private UserService userService：声明一个 UserService 类型的成员变量，Spring 会在运行时动态注入实例。
    @Autowired
    private UserService userService; //创建一个service对象，可以在这个上面调用接口

    // 获取用户信息（不含密码）
    @GetMapping("/{id}")  //表示查询 可以使用http://localhost:8080/api/users/2 来查询
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        Optional<User> userOpt = userService.findUserById(id);
        System.out.println("获取用户信息请求，用户ID: " + id);
        return userOpt
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // 更新用户信息
    @PutMapping("/{id}")  //表示修改
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            System.out.println("接收到更新用户请求: " + updatedUser);
            
            // 校验用户是否存在
            Optional<User> existingUserOpt = userService.findUserById(id);
            if (existingUserOpt.isEmpty()) {
                System.out.println("找不到用户ID: " + id);
                return ResponseEntity.notFound().build();
            }
            
            User existingUser = existingUserOpt.get();
            
            // 更新字段 - 但保留ID和用户名不变
            if (updatedUser.getEmail() != null) {
                existingUser.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getAddress() != null) {
                existingUser.setAddress(updatedUser.getAddress());
            }
            if (updatedUser.getPhone() != null) {
                existingUser.setPhone(updatedUser.getPhone());
            }
            
            // 保存更新后的用户
            User savedUser = userService.saveUser(existingUser);
            System.out.println("用户更新成功: " + savedUser);
            
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            System.err.println("更新用户信息失败: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
} 
