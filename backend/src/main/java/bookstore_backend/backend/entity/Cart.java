package bookstore_backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
// import lombok.Builder;

@Data //lombok注解，自动生成getter和setter方法
// @ToString.Exclude //这个注解用于在生成的 toString() 方法中排除该字段。避免在打印对象时，打印出循环引用的字段
@Entity  //这个是JPA注释，表明这个Cart类是一个JPA实体，可以被持久化到数据库中，而且数据库中的一行数据可以映射回这个类的实例。
// @Builder
@Table(name = "carts")
public class Cart {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne //这里指多个购物车项（Cart 实例）可以属于同一个用户（User 实例）。
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer price;

    // @Column(name = "created_at")
    // private java.time.LocalDateTime createdAt;

    // @PrePersist
    protected void onCreate() {
        // createdAt = java.time.LocalDateTime.now();
    }
} 