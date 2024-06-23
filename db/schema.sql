DROP DATABASE IF EXISTS business_manager;
CREATE DATABASE business_manager;

\c business_manager;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department INT REFERENCES department(id),
  CONSTRAINT position UNIQUE (title, department)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT REFERENCES role(id),
  manager INT REFERENCES employee(id)
);