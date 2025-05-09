package bookstore_backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
// import java.math.BigDecimal;

@Data
@Entity  //这个是JPA注释，表明这个Cart类是一个JPA实体，可以被持久化到数据库中，而且数据库中的一行数据可以映射回这个类的实例。

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