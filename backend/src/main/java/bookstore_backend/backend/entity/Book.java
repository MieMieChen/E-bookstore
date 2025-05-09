package bookstore_backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
// import java.math.BigDecimal;

@Data
@Entity
@Table(name = "books")
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

    @Column(length = 20)
    private String isbn;

    private String imageUrl;
} 