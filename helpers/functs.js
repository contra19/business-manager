// Import required modules
const inquirer = require('inquirer');
const { Client } = require('pg');
const dbConfig = require('../config/config');
const Queries = require('../db/queries');

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
    ]);

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.insertDepartment;
        const values = [answers.departmentName];
        const res = await client.query(query, values);
        console.log(`Successfully added department: ${res.rows[0].name}`);
    } catch (err) {
        console.error('Error adding department:', err.stack);
    }

    await client.end();
}

// Function to add a role to the database
async function addRole() {
    const departments = await fetchDepartments();

    const departmentChoices = departments.map(dept => ({
        name: `${dept["Department"]}`, // Display department name
        value: dept["Department ID"] // Use department ID as the value
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
            validate: function(value) {
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
        console.log(`Successfully added role: ${res.rows[0].title}`);
    } catch (err) {
        console.error('Error adding role:', err.stack);
    } finally {
        await client.end();
    }
}

// Function to add an employee to the database
async function addEmployee() {
    const roles = await fetchRoles();
    
    const roleChoices = roles.map( role => ({
        name: `${role["Job Title"]} - ${role["Department"]}`, // Display role name - department name
        value: role["Role ID"] // Use role ID as the value
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
            type: 'input',
            name: 'managerID',
            message: 'Enter the manager ID for the new employee:'
        }
    ]);

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.insertEmployee;
        const values = [answers.firstName, answers.lastName, parseInt(answers.roleID), parseInt(answers.managerID)];
        const res = await client.query(query, values);
        console.log(`Successfully added employee: ${res.rows[0].first_name} ${res.rows[0].last_name} with ID ${res.rows[0].id}`);
    } catch (err) {
        console.error('Error adding employee:', err.stack);
    }

    await client.end();
}


// Function to update an employee's role in the database
async function updateEmployeeRole() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'employeeID',
            message: 'Enter the ID of the employee whose role you want to update:'
        },
        {
            type: 'input',
            name: 'newRoleID',
            message: 'Enter the new role ID for the employee:'
        }
    ]);

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const query = Queries.updateEmployeeRole;
        const values = [parseInt(answers.newRoleID), parseInt(answers.employeeID)];
        const res = await client.query(query, values);
        console.log(`Successfully updated role for employee with ID ${res.rows[0].id}`);
    } catch (err) {
        console.error('Error updating employee role:', err.stack);
    }

    await client.end();
}

// Function to handle viewing options
async function handleViewOption(option, client) {
    let query = '';
    switch(option) {
        case 'View ALL Departments':
            query = Queries.viewAllDepartments;
            break;
        case 'View ALL Roles':
            query = Queries.viewAllRoles;
            break;
        case 'View ALL Employees':
            query = Queries.viewAllEmployees;
            break;
        default:
            console.log('Invalid option selected');
            return;
    }
    try {
        const client = new Client(dbConfig);
        await client.connect();
        
        const res = await client.query(query);

        // Check if res.rows is null, undefined, or empty
        if (!res.rows || res.rows.length === 0) {
            const columns = query.match(/SELECT \* FROM (\w+)/i)[1].split(',').map(col => col.trim());

            const headerRow = columns.join('   ');
            const separatorRow = columns.map(col => '-'.repeat(col.length)).join('   ');
            console.log(headerRow);
            console.log(separatorRow);
            console.log('No data found.\n');
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
    handleViewOption
};
