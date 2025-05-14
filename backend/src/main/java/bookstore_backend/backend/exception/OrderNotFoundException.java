package bookstore_backend.backend.exception;

// OrderNotFoundException.java

// @ResponseStatus(HttpStatus.NOT_FOUND) // 可选：如果想通过 @ControllerAdvice 全局处理时自动返回 404
public class OrderNotFoundException extends RuntimeException { // 通常继承 RuntimeException 方便Service层抛出

    public OrderNotFoundException(String message) {
        super(message);
    }

    public OrderNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}