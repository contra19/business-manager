insert into department (name)
values ('Engineering'), ('Development'), ('Operations'), ('Sales'), ('Marketing'), ('Finance'), ('HR');

insert into role (title, salary, department)
values ('Software Engineer', 100000, 1), ('QA Engineer', 80000, 1), ('DevOps Engineer', 120000, 1), ('Engineering Manager', 150000, 1),
       ('Sales Engineer', 90000, 4), ('Sales Manager', 120000, 4), ('Marketing Specialist', 80000, 5), ('Marketing Manager', 100000, 5),
       ('Finance Analyst', 90000, 6), ('Finance Manager', 120000, 6), ('HR Specialist', 80000, 7), ('HR Manager', 100000, 7);

insert into employee (first_name, last_name, role_id, manager)
values ('Alice', 'Smith', 1, 4), ('Bob', 'Jones', 2, 4), ('Charlie', 'Brown', 3, 4), ('David', 'White', 4, NULL),
       ('Eve', 'Black', 5, 6), ('Frank', 'Green', 6, NULL), ('Grace', 'Blue', 7, 8), ('Hank', 'Orange', 8, NULL),
       ('Ivy', 'Red', 9, 10), ('Jack', 'Purple', 10, 10), ('Kate', 'Yellow', 11, 12), ('Larry', 'Pink', 12, NULL);