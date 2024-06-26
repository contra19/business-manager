insert into department (name)
values ('Engineering'), ('Sales'), ('Marketing'), ('Finance'), ('HR');

insert into role (title, salary, department)
values ('Software Engineer', 100000, 1), ('QA Engineer', 80000, 1), ('DevOps Engineer', 120000, 1), ('Engineering Manager', 150000, 1),
       ('Sales Engineer', 90000, 2), ('Sales Manager', 120000, 2), ('Marketing Specialist', 80000, 3), ('Marketing Manager', 100000, 3),
       ('Finance Analyst', 90000, 4), ('Finance Manager', 120000, 4), ('HR Specialist', 80000, 5), ('HR Manager', 100000, 5);

insert into employee (first_name, last_name, role_id, manager_id)
values ('Alice', 'Smith', 1, 4), ('Bob', 'Jones', 2, 4), ('Charlie', 'Sykes', 3, 4), ('David', 'Michaels', 4, NULL),
       ('Eve', 'Spuregin', 5, 6), ('Frank', 'Fettherby', 6, NULL), ('Grace', 'Kawasaki', 7, 8), ('Hank', 'Williams', 8, NULL),
       ('Ivy', 'Ludlow', 9, 10), ('Jack', 'Driscoll', 10, NULL), ('Kate', 'Blaney', 11, 12), ('Larry', 'Schooners', 12, NULL);