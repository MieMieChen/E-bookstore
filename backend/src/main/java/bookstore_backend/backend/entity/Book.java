package bookstore_backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
// import lombok.Builder;
import java.util.List;
import java.time.LocalDate;


// 真正的目的是解耦，使用annotation的改写来对应到不同数据库的表名或者列名。
// 在approperty当中配置url啥的来连接上数据库
// 实现了这个接口的类的对象
// spring扫描 来查找实现了这个接口的类，然后创建了对象，就可以直接用了
// annotation&&xml
@Data //使用Lombok的自动生成getter和setter
@Entity // 这个注解表明这个类是一个 JPA 实体类，会被映射到数据库中的一个表。 
@Table(name = "books") //指定表名
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)  // 不是 JPA 注解，而是 Jackson 的注解，用于处理 JSON 序列化时的对象引用问题，防止循环引用。
public class Book {
    @Id // 这个注解表示这个字段是表的主键 
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 这个注解表示这个字段是自动增长的
    private Long id;

    @Column(nullable = false) // 这个注解表示这个字段不能为空
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 20,unique = true)
    private String isbn;
    
    private String imageUrl;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    private String publisher;

    @Column(nullable = false)
    private Integer onShow = 1; //1表示上架，0表示下架 自动给我转变成on_show
    
    @ToString.Exclude // 使用 Lombok 的 @ToString 注解来排除这个字段在 toString 方法中的输出
    @JsonIgnore  // 忽略在 JSON 序列化时包含这个字段，避免循环引用
    @OneToMany(mappedBy = "book")
    private List<OrderItem> orderItems;
} 