DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE store (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(45) NULL,
  department VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  quantity INT(10) NOT NULL,
  PRIMARY KEY (id)
);

