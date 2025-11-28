-- Create database if not exists
CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

-- Create books table
DROP TABLE IF EXISTS books;
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,  
    stock INT NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    image_url VARCHAR(255),
    publish_date DATE,
    publisher VARCHAR(255),
    on_show INT NOT NULL DEFAULT 1
);

-- Create users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20)
);

-- Create user authentication table
DROP TABLE IF EXISTS user_auth;
CREATE TABLE user_auth (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create carts table
DROP TABLE IF EXISTS carts;
CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,  
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Create orders table
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_time DATETIME NOT NULL,
    total_amount INT NOT NULL,  
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create order_items table
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,  
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);