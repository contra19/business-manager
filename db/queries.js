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
            LEFT JOIN employee m ON e.manager_id = m.id;
        `;
        this.viewAllManagers = `
            SELECT DISTINCT(m.id) AS "Manager ID", m.first_name AS "First Name", m.last_name AS "Last Name", 
	               r.title AS "Title", d.name AS "Department"
            FROM employee e
            JOIN employee m ON e.manager_id = m.id
            JOIN role r ON m.role_id = r.id
            JOIN department d ON r.department = d.id;
        `;
        this.viewEmployeesByManager = `
            SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name",
                r.title AS "Job Title", d.name AS "Department", CONCAT('$', r.salary) AS "Salary",
                CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
            FROM employee e
            INNER JOIN role r ON e.role_id = r.id
            INNER JOIN department d ON r.department = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE e.manager_id = $1;
        `;
        this.viewEmployeesByDepartment = `
            SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name",
                r.title AS "Job Title", d.name AS "Department", CONCAT('$', r.salary) AS "Salary",
                CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
            FROM employee e
            INNER JOIN role r ON e.role_id = r.id
            INNER JOIN department d ON r.department = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE d.id = $1;
        `;
        this.viewDepartmentBudget = `
            SELECT d.name AS "Department", SUM(r.salary) AS "Total Utilized Budget"
            FROM employee e
            INNER JOIN role r ON e.role_id = r.id
            INNER JOIN department d ON r.department = d.id
            WHERE d.id = $1
            GROUP BY d.name;
        `;

        // INSERT queries
        this.insertDepartment = `
            INSERT INTO department (name) VALUES ($1) RETURNING *;
        `;
        this.insertRole = `
            INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING *;
        `;
        this.insertEmployee = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *;
        `;

        // UPDATE queries
        this.updateEmployeeRole = `
            UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *;
        `;
        this.updateEmployeeManager = `
            UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *;
        `;

        // DELETE queries
        this.deleteDepartment = `
            DELETE FROM department WHERE id = $1;
        `;
        this.deleteRole = `
            DELETE FROM role WHERE id = $1;
        `;
        this.deleteEmployee = `
            DELETE FROM employee WHERE id = $1;
        `;

        // Count queries
        this.countEmployeesInRole = `
            SELECT COUNT(*) FROM employee WHERE role_id = $1;
        `;
        this.countRolesInDepartment = `
            SELECT COUNT(*) FROM role WHERE department = $1;
        `;
    }
}

module.exports = new Queries();
