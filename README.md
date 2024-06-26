# Employee Management System

The Employee Management System is your all-in-one solution for efficient and effective employee management, ensuring your organization is maintained efficiently.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Inquirer](https://img.shields.io/badge/Inquirer.js-000000?style=for-the-badge&logo=javascript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)


## Overview

The Employee Management System (EMS) is a comprehensive tool designed to streamline the management of employees within an organization. Built with modern Node.js, Inquirer and PostgreSQL, the EMS provides a user-friendly interface for handling various aspects of employee information, roles, and departmental structures.

## Features

- Employee Directory: Maintain a detailed directory of employees, including personal and professional information.
- Role Management: Assign and manage roles within the organization, ensuring clear definition and assignment of responsibilities.
- Departmental Organization: Structure the organization into departments for better management and reporting.
- Manager Hierarchy: Track and manage reporting relationships to ensure clear organizational structure and accountability.
- Interactive User Interface: Utilize a clean, intuitive interface built with Node.js and Inquirer.js for efficient user interactions.
- Robust Data Management: Leverage PostgreSQL for reliable and scalable data storage, ensuring data integrity and performance.

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/contra19/business-manager.git
    cd business-manager
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Setup Config.js**
    ```bash
    Rename the config_template.js file to congig.js inside the config folder and update the following values:
    
    module.exports = {
        user: '<your_database_user>',
        host: '<your_database_host>',
        database: '<your_database>',
        password: '<your_database_user_password>',
        port: 5432 //this is the default port and can be replaced with <your_database_port
    };
    ```

4. **Run the schema.sql file**
    ```bash
    cd db
    psql -U <your db user>
    
    \i schema.sql //this is entered at the PostgreSQL prompt
    \i seeds.sql ***seeds.sql is optional. This will seed your database tables to have data to work with upfront.*** 
    \q //to exit PostgreSQL
    
    cd ..
    ```


## Usage

1. **Run the Application:**
    ```bash
    npm start
    ```

2. **Use the arrow keys to navigate the menu:**
    - Select from a list of tasks from the Main Menu.
    - Sub-menus have both text inpouts as well as lists to select from.
    - Options include VIEW, ADD, UPDATE and DELETE.
    - Options available for Employees, Roles and Departments.

3. **Select VIEW options to view your orginization:**
    - Use VIEW options from the Main Menu to see different views of your orginization.

## Examples

Example directory structure:

```
business-manager/
├── config/
│   ├── config_template.js
│   └── config.js
├── db/
│   ├── queries.js
│   ├── schema.sql
│   └── seeds.sql
├── helpers/
│   └── functs.js
├── node_modules/
├── index.js
├── package.json
└── README.md
```
## Demo Video
[Demo Video](https://drive.google.com/file/d/1wjDRzS3GFTxsuH0KhlOgXFgvlx3Nl4z0/view?usp=drive_link)

## Code Structure

- `index.js`: Main script for running the application.
- `config/config.js`: Contains the database connection data.
- `db/queries,js`: Contains the queries behind the menu selections.
- `helpers/functs.js`: Contains the functions behind the men selections.

## Tests

No tests are provided with this application.

## Dependencies

- `Node.js`: Needs to be installed prior to deployment.  
- `PostgreSQL`: Needs to be installed priior to deployment.
- `inquirer`: For interactive command-line prompts.
- `pg`: For connecting to the PostgreSQL database.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## Future Changes / Current Issues

- Currently there is no separate managersa table. This creates a logical issue with trying to convert non-manager employees to managers.
- A managers column/table will be added in the next iteration.  

## License

![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

I would like to express my deepest gratitude to the following individuals and organizations for their invaluable support and contributions to the development of the Employee Management System:

1. **OpenAI**: For providing the AI technology that assisted in the development process.
2. **Node.js Community**: For creating and maintaining a robust platform that makes building server-side applications efficient and enjoyable.
3. **Inquirer.js Developers**: For providing an excellent tool to create interactive command-line interfaces.
4. **PostgreSQL Global Development Group**: For developing a powerful, open-source object-relational database system that forms the backbone of this project.
5. **My Instructor and Classmates**: For their input, suggestions and encouragement. 

Their contributions have been instrumental in bringing this project to fruition, and I am deeply appreciative of their efforts.


