CREATE DATABASE IF NOT EXISTS meal_system;

USE meal_system;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_date DATE NOT NULL,
    breakfast BOOLEAN NOT NULL DEFAULT 0,
    lunch BOOLEAN NOT NULL DEFAULT 0,
    dinner BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS meal_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    breakfast_rate DECIMAL(10, 2) NOT NULL,
    lunch_rate DECIMAL(10, 2) NOT NULL,
    dinner_rate DECIMAL(10, 2) NOT NULL,
    fixed_charge DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255)
); 