// app.js

// Import required packages and modules
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const dbConfig = require('./config');

// Establish a connection to the MySQL database
let connection;

async function connectToDatabase() {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');
}

// Define functions for CRUD operations

// View all departments
async function viewDepartments() {
    const [rows] = await connection.query('SELECT * FROM department');
    console.table(rows);
}

// View all roles
async function viewRoles() {
    const [rows] = await connection.query(`
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id
    `);
    console.table(rows);
}

// View all employees
async function viewEmployees() {
    const [rows] = await connection.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    console.table(rows);
}

// Add a department
async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the department name:',
        },
    ]);
    await connection.query('INSERT INTO department (name) VALUES (?)', [answers.name]);
    console.log('Department added successfully.');
}

// Add a role
async function addRole() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary:',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for this role:',
            choices: async () => {
                const [departments] = await connection.query('SELECT id, name FROM department');
                return departments.map(department => ({
                    name: department.name,
                    value: department.id,
                }));
            },
        },
    ]);

    await connection.query(
        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [answers.title, answers.salary, answers.department_id]
    );
    console.log('Role added successfully.');
}

// Add an employee
async function addEmployee() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee\'s first name:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee\'s last name:',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role for this employee:',
            choices: async () => {
                const [roles] = await connection.query('SELECT id, title FROM role');
                return roles.map(role => ({
                    name: role.title,
                    value: role.id,
                }));
            },
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the employee\'s manager:',
            choices: async () => {
                const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
                return [
                    { name: 'None', value: null },
                    ...employees.map(employee => ({
                        name: employee.name,
                        value: employee.id,
                    })),
                ];
            },
        },
    ]);

    await connection.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
    );
    console.log('Employee added successfully.');
}

// Update an employee's role
async function updateEmployeeRole() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee you want to update:',
            choices: async () => {
                const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
                return employees.map(employee => ({
                    name: employee.name,
                    value: employee.id,
                }));
            },
        },
        {
            type: 'list',
            name: 'new_role_id',
            message: 'Select the new role for this employee:',
            choices: async () => {
                const [roles] = await connection.query('SELECT id, title FROM role');
                return roles.map(role => ({
                    name: role.title,
                    value: role.id,
                }));
            },
        },
    ]);

    await connection.query(
        'UPDATE employee SET role_id = ? WHERE id = ?',
        [answers.new_role_id, answers.employee_id]
    );
    console.log('Employee role updated successfully.');
}

// Function to handle the main menu
async function mainMenu() {
    const choices = [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Exit',
    ];

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices,
        },
    ]);

    switch (answers.choice) {
        case 'View All Departments':
            await viewDepartments();
            break;
        case 'View All Roles':
            await viewRoles();
            break;
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            await connection.end();
            console.log('Goodbye!');
            return;
        default:
            console.log('Invalid choice. Please try again.');
            break;
    }

    // Show the main menu again after executing the chosen option
    await mainMenu();
}

// Main function to start the application
async function main() {
    await connectToDatabase();
    await mainMenu();
}

// Run the main function to start the application
main().catch((err) => {
    console.error('An error occurred:', err);
});
