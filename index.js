// Import required modules
const inquirer = require('inquirer');
const {
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    handleViewOption
} = require('./helpers/functs');

// Main menu questions
const mainMenuQuestions = [
    {
        type: 'list',
        name: 'menu',
        message: 'Welcome to the Business Manager App. Please select an option from the following menu:',
        choices: [
            'VIEW All Departments',
            'VIEW All Roles',
            'VIEW All Employees',
            'VIEW Employees By Manager',
            'VIEW Employees By Department',
            'VIEW Total Utilized Budget By Department',
            'ADD New Department',
            'ADD New Role',
            'ADD New Employee',
            'UPDATE Employee Role',
            'UPDATE Employee Manager',
            'DELETE Department',
            'DELETE Role',
            'DELETE Employee',
            'EXIT'
        ]
    },
];

// Main menu function
async function mainMenu() {
    // Loop to display the main menu and handle user selection until EXIT is selected
    while (true) {
        const { menu: selectedMenu } = await inquirer.prompt(mainMenuQuestions);

        // Exit the application if the user selects 'EXIT'
        if (selectedMenu === 'EXIT') {
            console.log('Exiting the Business Manager App...');
            break;
        }

        // Handle VIEW options
        if (selectedMenu.startsWith('VIEW')) {
            await handleViewOption(selectedMenu);
        } else {
            // Call the corresponding submenu function based on the selected menu
            try {
                switch (selectedMenu) {
                    case 'ADD New Department':
                        await addDepartment();
                        break;
                    case 'ADD New Role':
                        await addRole();
                        break;
                    case 'ADD New Employee':
                        await addEmployee();
                        break;
                    case 'UPDATE Employee Role':
                        await updateEmployeeRole();
                        break;
                    case 'UPDATE Employee Manager':
                        await updateEmployeeManager();
                        break;
                    case 'DELETE Department':
                        await deleteDepartment();
                        break;
                    case 'DELETE Role':
                        await deleteRole();
                        break;
                    case 'DELETE Employee':
                        await deleteEmployee();
                        break;
                    default:
                        console.log('Invalid submenu option');
                        break;
                }
            } catch (err) {
                console.error(`Error handling ${selectedMenu}:`, err);
            }
        }
    }
}

// Call the mainMenu function to start the application
mainMenu();
