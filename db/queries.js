// Define all SQL queries in a single class
class Queries {
    constructor() {
        // SELECT queries
        this.viewAllDepartments = `
            SELECT name AS "Department", id AS "Department ID" 
            FROM department;
        `;
        this.viewAllRoles = `
            SELECT r.title AS "Job Title", r.id AS "Role ID", d.name AS "Department", r.salary AS "Salary" 
            FROM role r 
            INNER JOIN department d ON r.department = d.id;
        `;
        this.viewAllEmployees = `
            SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name",
                r.title AS "Job Title", d.name AS "Department", CONCAT('$', r.salary) AS "Salary",
                CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
            FROM employee e
            INNER JOIN role r ON e.role_id = r.id
            INNER JOIN department d ON r.department = d.id
            LEFT JOIN employee m ON e.manager = m.id;
        `;

        // INSERT queries
        this.insertDepartment = `
            INSERT INTO department (name) VALUES ($1) RETURNING *;
        `;
        this.insertRole = `
            INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING *;
        `;
        this.insertEmployee = `
            INSERT INTO employee (first_name, last_name, role_id, manager) VALUES ($1, $2, $3, $4) RETURNING *;
        `;
    }
}

module.exports = new Queries();
