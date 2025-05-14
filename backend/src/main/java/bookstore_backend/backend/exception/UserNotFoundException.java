package bookstore_backend.backend.exception;
public class UserNotFoundException extends Exception {
    public UserNotFoundException(String message) {
        super(message);
    }
}