// Import required modules
const inquirer = require('inquirer');
const { Client } = require('pg');
const dbConfig = require('./config/config');
const { addDepartment, addRole, addEmployee, updateEmployeeRole, handleViewOption } = require('./helpers/functs');

// Main menu questions
const mainMenuQuestions = [
    {
        type: 'list',
        name: 'menu',
        message: 'Welcome to the Business Manager App. Please select an option from the following menu:',
        choices: ['View ALL Departments', 'View ALL Roles', 'View ALL Employees', 'ADD Department', 'ADD Role', 'ADD Employee', 'Update Employee Role', 'Exit'] 
    },
];

async function mainMenu() {
    const client = new Client(dbConfig);
    try {
        await client.connect();

        while (true) {
            const answers = await inquirer.prompt(mainMenuQuestions);
            const selectedMenu = answers.menu;

            if (selectedMenu === 'Exit') {
                console.log('Exiting the Business Manager App...');
                break; // Exit the while loop and end the program
            }

            if (selectedMenu.startsWith('View')) {
                await handleViewOption(selectedMenu, client);
            } else {
                // Call the corresponding submenu function based on the selected menu
                switch (selectedMenu) {
                    case 'ADD Department':
                        await addDepartment();
                        break;
                    case 'ADD Role':
                        await addRole();
                        break;
                    case 'ADD Employee':
                        await addEmployee();
                        break;
                    case 'Update Employee Role':
                        await updateEmployeeRole();
                        break;
                    default:
                        console.log('Invalid submenu option');
                        break;
                }
            }
        }
    } catch (err) {
        console.error('Error in main menu:', err);
    } finally {
        await client.end();
    }
}

// Call the mainMenu function to start the application
mainMenu();
