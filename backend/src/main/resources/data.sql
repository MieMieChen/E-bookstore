-- Insert test books
INSERT INTO books (title, author, description, price, stock, image_url) VALUES
('Java编程思想', 'Bruce Eckel', 'Java编程的经典著作', 99.00, 100, 'https://example.com/java.jpg'),
('Spring Boot实战', 'Craig Walls', 'Spring Boot入门到精通', 79.00, 50, 'https://example.com/spring.jpg'),
('MySQL必知必会', 'Ben Forta', 'MySQL数据库教程', 59.00, 80, 'https://example.com/mysql.jpg');

-- Insert test user
INSERT INTO users (username, password, email, address, phone) VALUES
('testuser', 'password123', 'test@example.com', '北京市海淀区', '13800138000');

-- Insert test cart items
INSERT INTO carts (user_id, book_id, quantity, price) VALUES
(1, 1, 2, 99.00),
(1, 2, 1, 79.00);

-- Insert test order
-- INSERT INTO orders (user_id, order_time, total_amount, status) VALUES
-- (1, NOW(), 277.00, 'PENDING');

-- Insert test order items
INSERT INTO order_items (order_id, book_id, quantity, price) VALUES
(1, 1, 2, 99.00),
(1, 2, 1, 79.00); 