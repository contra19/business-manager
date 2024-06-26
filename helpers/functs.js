// Import required modules
const inquirer = require('inquirer');
const { Client } = require('pg');
const dbConfig = require('../config/config');
const Queries = require('../db/queries');

// Function to get count of employees in a role
async function getEmployeeCount(roleID) {
    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.countEmployeesInRole;
        const values = [roleID];
        const res = await client.query(query, values);
        return res.rows[0].count;
    } catch (err) {
        console.error('Error getting employee count:', err.stack);
        console.log();
        return 0;
    } finally {
        await client.end();
    }
}

// Function to get count of roles in a department
async function getRoleCount(departmentID) {
    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.countRolesInDepartment;
        const values = [departmentID];
        const res = await client.query(query, values);
        return res.rows[0].count;
    } catch (err) {
        console.error('Error getting role count:', err.stack);
        console.log();
        return 0;
    } finally {
        await client.end();
    }
}

// Function to fetch departments from the database
async function fetchDepartments() {
    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.viewAllDepartments;
        const res = await client.query(query);
        return res.rows;
    } catch (err) {
        console.error('Error fetching departments:', err.stack);
        console.log();
        return [];
    } finally {
        await client.end();
    }
}

// Function to fetch roles from the database
async function fetchRoles() {
    const client = new Client(dbConfig);
    await client.connect();
    try {
        const query = Queries.viewAllRoles;
        const res = await client.query(query);
        return res.rows;
    } catch (err) {
        console.error('Error fetching roles:', err.stack);
        console.log();
        return [];
    } finally {
        await client.end();
    }
}

// Function to fetch employees from the database
async function fetchEmployees() {
    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.viewAllEmployees;
        const res = await client.query(query);
        return res.rows;
    } catch (err) {
        console.error('Error fetching Employees:', err.stack);
        console.log();
        return [];
    } finally {
        await client.end();
    }

}

// Function to fetch managers from the database
async function fetchManagers() {
    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.viewAllManagers;
        const res = await client.query(query);
        return res.rows;
    } catch (err) {
        console.error('Error fetching Managers:', err.stack);
        console.log();
        return [];
    } finally {
        await client.end();
    }

}

// Function to add a department to the database
async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the new department:'
        }
    ]); const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.insertDepartment;
        const values = [answers.departmentName];
        const res = await client.query(query, values);
        console.log(`Successfully added department: ${res.rows[0].name}.`);
        console.log();
    } catch (err) {
        console.error('Error adding department:', err.stack);
        console.log();
    } finally {
        await client.end();
    }
}

// Function to add a role to the database
async function addRole() {
    const departments = await fetchDepartments();

    const departmentChoices = departments.map(dept => ({
        name: `${dept["Department"]}`,
        value: dept["Department ID"]
    }));

    const roleQuestions = [
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the new role:'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for the new role:',
            validate: function (value) {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            }
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'Select the department for the new role:',
            choices: departmentChoices
        }
    ];

    const answers = await inquirer.prompt(roleQuestions);

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.insertRole;
        const values = [answers.roleName, parseFloat(answers.roleSalary), answers.roleDepartment];
        const res = await client.query(query, values);
        console.log(`Successfully added role: ${res.rows[0].title} with a salary of $${res.rows[0].salary}.`);
        console.log();
    } catch (err) {
        console.error('Error adding role:', err.stack);
        console.log();
    } finally {
        await client.end();
    }

}

// Function to add an employee to the database
async function addEmployee() {
    const roles = await fetchRoles();
    const roleChoices = roles.map(role => ({
        name: `${role["Job Title"]} - ${role["Department"]}`,
        value: role["Role ID"]
    }));

    const managers = await fetchManagers();
    const managerChoices = managers.map(manager => ({
        name: `${manager["First Name"]} ${manager["Last Name"]} - ${manager["Department"]} - ${manager["Title"]}`,
        value: manager["Manager ID"]
    }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the new employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the new employee:'
        },
        {
            type: 'list',
            name: 'roleID',
            message: 'Select the role for the new employee:',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'managerID',
            message: 'Select the manager for the new employee (leave blank if none):',
            choices: managerChoices.concat({ name: 'None', value: '' })
        }
    ]);

    // Check if managerID is empty and if so set to null 
    if (answers.managerID === '') {
        managerID = null;
    } else {
        managerID = parseInt(answers.managerID);
    }

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.insertEmployee;
        const values = [answers.firstName, answers.lastName, parseInt(answers.roleID), managerID];
        const res = await client.query(query, values);
        console.log(`Successfully added employee: ${res.rows[0].first_name} ${res.rows[0].last_name}.`);
        console.log();
    } catch (err) {
        console.error('Error adding employee:', err.stack);
        console.log();
    } finally {
        await client.end();
    }

}

// Function to update an employee's role in the database
async function updateEmployeeRole() {
    const employees = await fetchEmployees();
    const employeeChoices = employees.map(employee => ({
        name: `${employee["First Name"]} ${employee["Last Name"]} - ${employee["Department"]} - ${employee["Job Title"]}`,
        value: employee["Employee ID"]
    }));

    const roles = await fetchRoles();
    const roleChoices = roles.map(role => ({
        name: `${role["Job Title"]} - ${role["Department"]}`,
        value: role["Role ID"]
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeID',
            message: 'Select the employee whose role you want to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'newRoleID',
            message: 'Select the new role for the employee:',
            choices: roleChoices
        }
    ]);

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.updateEmployeeRole;
        const values = [parseInt(answers.newRoleID), parseInt(answers.employeeID)];
        const res = await client.query(query, values);
        console.log(`Successfully updated role for employee ${res.rows[0].first_name} ${res.rows[0].last_name}.`);
        console.log();
    } catch (err) {
        console.error('Error updating employee role:', err.stack);
        console.log();
    } finally {
        await client.end();
    }

}

// Function to update an employee's manager in the database
async function updateEmployeeManager() {
    const employees = await fetchEmployees();
    const employeeChoices = employees.map(employee => ({
        name: `${employee["First Name"]} ${employee["Last Name"]} - ${employee["Department"]} - ${employee["Job Title"]}`,
        value: employee["Employee ID"]
    }));

    const managers = await fetchManagers();
    const managerChoices = managers.map(manager => ({
        name: `${manager["First Name"]} ${manager["Last Name"]} - ${manager["Department"]} - ${manager["Title"]}`,
        value: manager["Manager ID"]
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeID',
            message: 'Select the employee whose role you want to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'newManagerID',
            message: 'Select the new manager for the employee:',
            choices: managerChoices.concat({ name: 'None', value: '' })
        }
    ]);

    // Check if managerID is empty and if so set to null 
    if (answers.newManagerID === '') {
        newManagerID = null;
    } else {
        newManagerID = parseInt(answers.newManagerID);
    }

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.updateEmployeeManager;
        const values = [newManagerID, parseInt(answers.employeeID)];
        const res = await client.query(query, values);
        console.log(`Successfully updated manager for employee ${res.rows[0].first_name} ${res.rows[0].last_name}.`);
        console.log();
    } catch (err) {
        console.error('Error updating employee manager:', err.stack);
        console.log();
    } finally {
        await client.end();
    }
}

// Function to delete a department from the database
async function deleteDepartment() {
    const departments = await fetchDepartments();
    const departmentChoices = departments.map(dept => ({
        name: dept["Department"],
        value: dept["Department ID"]
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentID',
            message: 'Select the department to delete:',
            choices: departmentChoices
        }
    ]);

    // Check if there are any roles in the selected department
    const roleCount = await getRoleCount(answers.departmentID);
    if (roleCount > 0) {
        if (roleCount == 1) {
            console.log(`Cannot delete department. There is 1 role assigned to this department. Please reassign or delete the role first.`);
            console.log();
        } else
            console.log(`Cannot delete department. There are ${roleCount} roles assigned to this department. Please reassign or delete the roles first.`);
        console.log();
        return;
    }

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.deleteDepartment;
        const values = [parseInt(answers.departmentID)];
        await client.query(query, values);
        console.log('Successfully deleted department.');
        console.log()
    } catch (err) {
        console.error('Error deleting department:', err.stack);
        console.log()
    } finally {
        await client.end();
    }

}

// Function to delete a role from the database
async function deleteRole() {
    const roles = await fetchRoles();
    const roleChoices = roles.map(role => ({
        name: `${role["Job Title"]} - ${role["Department"]}`,
        value: role["Role ID"]
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'roleID',
            message: 'Select the role to delete:',
            choices: roleChoices
        }
    ]);

    // Check if there are any employees in the selected role
    const employeeCount = await getEmployeeCount(answers.roleID);
    if (employeeCount > 0) {
        if (employeeCount == 1) {
            console.log(`Cannot delete role. There is 1 employee associated with this role. Please reassign or remove the employee first.`);
            console.log();
        } else
            console.log(`Cannot delete role. There are ${employeeCount} employees associated with this role. Please reassign or remove the employees first.`);
        console.log();
        return;
    }

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.deleteRole;
        const values = [parseInt(answers.roleID)];
        await client.query(query, values);
        console.log('Successfully deleted role.');
        console.log()
    } catch (err) {
        console.error('Error deleting role:', err.stack);
        console.log()
    } finally {
        await client.end();
    }
}

// Function to delete an employee from the database
async function deleteEmployee() {
    const employees = await fetchEmployees();
    const employeeChoices = employees.map(employee => ({
        name: `${employee["First Name"]} ${employee["Last Name"]} - ${employee["Department"]} - ${employee["Job Title"]}`,
        value: employee["Employee ID"]
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeID',
            message: 'Select the employee to delete:',
            choices: employeeChoices
        }
    ]);

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.deleteEmployee;
        const values = [parseInt(answers.employeeID)];
        await client.query(query, values);
        console.log('Successfully deleted employee.');
        console.log()
    } catch (err) {
        console.error('Error deleting employee:', err.stack);
        console.log()
    } finally {
        await client.end();
    }

}

/// Function to handle viewing options
async function handleViewOption(option) {
    const client = new Client(dbConfig);
    await client.connect()
    let query = '';
    let values = [];

    switch (option) {
        case 'VIEW All Departments':
            query = Queries.viewAllDepartments;
            break;
        case 'VIEW All Roles':
            query = Queries.viewAllRoles;
            break;
        case 'VIEW All Employees':
            query = Queries.viewAllEmployees;
            break;
        case 'VIEW Employees By Manager':
            const managers = await fetchManagers();
            const managerChoices = managers.map(manager => ({
                name: `${manager["First Name"]} ${manager["Last Name"]} - ${manager["Department"]} - ${manager["Title"]}`,
                value: manager["Manager ID"]
            }));

            const managerAnswer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'managerID',
                    message: 'Select the manager to view employees:',
                    choices: managerChoices
                }
            ]);

            query = Queries.viewEmployeesByManager;
            values = [parseInt(managerAnswer.managerID)];
            break;
        case 'VIEW Employees By Department':
            const departments = await fetchDepartments();
            const departmentChoices = departments.map(dept => ({
                name: dept["Department"],
                value: dept["Department ID"]
            }));

            const departmentAnswer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'departmentID',
                    message: 'Select the department to view employees:',
                    choices: departmentChoices
                }
            ]);

            query = Queries.viewEmployeesByDepartment;
            values = [parseInt(departmentAnswer.departmentID)];
            break;
        case 'VIEW Total Utilized Budget By Department':
            const departmentBudget = await fetchDepartments();
            const departmentBudgetChoices = departmentBudget.map(dept => ({
                name: dept["Department"],
                value: dept["Department ID"]
            }));

            const departmentBudgetAnswer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'departmentID',
                    message: 'Select the department to view total utilized budget:',
                    choices: departmentBudgetChoices
                }
            ]);

            query = Queries.viewDepartmentBudget;
            values = [parseInt(departmentBudgetAnswer.departmentID)];
            break;
        default:
            console.log('Invalid option selected');
            await client.end();
            return;
    }

    try {
        // Execute the query with parameters if any
        const res = await client.query(query, values);

        // Check if res.rows is null, undefined, or empty
        if (!res.rows || res.rows.length === 0) {
            console.log('No data found.');
            console.log();
            return;
        }

        // Define the table columns
        const columns = Object.keys(res.rows[0]);

        // Calculate the maximum width for each column (including headers)
        const columnWidths = columns.map(col => {
            const maxLength = Math.max(col.length, ...res.rows.map(row => String(row[col]).length));
            return maxLength;
        });

        // Create formatted table rows
        const tableRows = [];

        // Create header row
        const headerRow = columns.map((col, index) => col.padEnd(columnWidths[index])).join('   ');
        tableRows.push(headerRow);

        // Create separator row
        const separatorRow = columnWidths.map(width => '-'.repeat(width)).join('   ');
        tableRows.push(separatorRow);

        // Create data rows
        res.rows.forEach(row => {
            const dataRow = columns.map((col, index) => String(row[col]).padEnd(columnWidths[index])).join('   ');
            tableRows.push(dataRow);
        });

        // Display the table
        console.log(); // Blank line before table
        console.log(tableRows.join('\n'));
        console.log(); // Blank line after table
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

module.exports = {
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    handleViewOption
};
