-- CREATE AND USE A SEPREATE DATABASE WITH THE NAME AQUA FOR THE PROJECT --
CREATE DATABASE AQUA;
USE AQUA;
CREATE TABLE USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    isCustomer TINYINT
);
CREATE TABLE CUSTOMER (
    fname VARCHAR(255),
    mname VARCHAR(255),
    lname VARCHAR(255),
    userID INT UNIQUE NOT NULL,
    email VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(150),
    country VARCHAR(3) DEFAULT 'IND',
    street VARCHAR(250),
    phone CHAR(10),
    PRIMARY KEY (userID),
    FOREIGN KEY (userID) REFERENCES USER(id)
);
CREATE TABLE EMPLOYEE (
    fname VARCHAR(255),
    mname VARCHAR(255),
    lname VARCHAR(255),
    salary INT,
    userID INT UNIQUE NOT NULL,
    phone CHAR(10),
    email VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(150),
    country VARCHAR(3) DEFAULT 'IND',
    street VARCHAR(250),
    PRIMARY KEY (userID),
    FOREIGN KEY (userID) REFERENCES USER(id)
);
CREATE TABLE CONTAINERS(
    quantity INT,
    unitPrice INT,
    isBooked TINYINT,
    currentOwner INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (currentOwner) REFERENCES USER(id)
);
CREATE TABLE DELIVERIES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    isCompleted TINYINT,
    customerID INT,
    employeeID INT,
    containerID INT,
    FOREIGN KEY (customerID) REFERENCES CUSTOMER(userID),
    FOREIGN KEY (containerID) REFERENCES CONTAINERS(id),
    FOREIGN KEY (employeeID) REFERENCES EMPLOYEE(userID)
);
CREATE TABLE TRANSACTIONS (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    TIME DATETIME DEFAULT NOW(),
    customerID INT,
    containerID INT,
    FOREIGN KEY (customerID) REFERENCES CUSTOMER(userID),
    FOREIGN KEY (containerID) REFERENCES CONTAINERS(id)
);