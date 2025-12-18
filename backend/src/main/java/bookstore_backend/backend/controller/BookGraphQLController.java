package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.service.BookService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class BookGraphQLController {

    private final BookService bookService;

    public BookGraphQLController(BookService bookService) {
        this.bookService = bookService;
    }

    @QueryMapping
    public List<Book> searchBooksByName(@Argument String name) {
        return bookService.findBooksByName(name);
    }
}