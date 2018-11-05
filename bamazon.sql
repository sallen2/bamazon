DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price FLOAT(10,2),
    stock_quantity INT,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Xbox', 'Electronics', 349.99, 3512);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('PS4', 'Electronics', 349.99, 2422);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Nintendo Switch', 'Electronics', 299.99, 1534);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Macbook Pro 17', 'Electronics', 1549.99, 4512);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Macbook Pro 15', 'Electronics', 1349.99, 3500);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Offical NBA Basketball', 'Sports and Outdoors', 39.99, 1020);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Offical NFL Football', 'Sports and Outdoors', 35.99, 500);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Bananas', 'Food and Grocery', .99, 150);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Hot Pockets 12 pack', 'Food and Grocery', 11.99, 2130);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Red Dead Redemption', 'Movie, Music and Games', 59.99, 1500);