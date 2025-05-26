package bookstore_backend.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest
class BackendApplicationTests {
	@Autowired
	private UserRepository userRepository;
	@Test
	void contextLoads() {
	}
	
	@Test
	void test()
	{
		User user = userRepository.findByUsername("Ashley").orElse(null);
		System.out.println("User found: " + user);
		if (user != null) {
			System.out.println("User ID: " + user.getId());
			System.out.println("Username: " + user.getUsername());
			System.out.println("Email: " + user.getEmail());
			System.out.println("Address: " + user.getAddress());
			System.out.println("Phone: " + user.getPhone());
		}
		boolean exit = userRepository.existsByUsername("Ashley");
		System.out.println("User exists: " + exit);
	}

}
