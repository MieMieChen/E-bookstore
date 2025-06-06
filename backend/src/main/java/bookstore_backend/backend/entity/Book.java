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

@Data
@Entity
// @Builder
@Table(name = "books")
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
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
    private Integer onShow = 1; //1表示上架，0表示下架
    
    @ToString.Exclude
    @JsonIgnore 
    @OneToMany(mappedBy = "book")
    private List<OrderItem> orderItems;
} 