package bookstore_backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    //当 JPA 配置为自动生成数据库 schema (DDL) 时，JPA 提供者会读取 @ManyToOne 和 @JoinColumn 的信息，然后自动生成对应的 ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY (...) REFERENCES ... (...); 这样的 SQL 语句来创建数据库层面的外键约束。
    private User user;

    @Column(nullable = false)
    private Integer totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING; // 默认为待付款状态

    @ToString.Exclude
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL) //所有操作都级联（保存、更新、删除等）
    private List<OrderItem> orderItems; 

    @Column(name = "order_time", nullable = false)
    private LocalDateTime orderTime;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist // 被这个注解标记的方法，会在实体对象首次被持久化到数据库之前执行
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        
        if (orderTime == null) {
            orderTime = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 