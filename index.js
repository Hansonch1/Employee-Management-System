import inquirer from 'inquirer';
import { viewDepartments, addDepartment } from './functions/departments.js';
import { viewRoles, addRole } from './functions/roles.js';
import { viewEmployees, addEmployee, updateEmployeeRole } from './functions/employees.js';

const mainMenu = async () => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    },
  ]);

  switch (choice) {
    case 'View all departments':
      await viewDepartments();
      break;
    case 'View all roles':
      await viewRoles();
      break;
    case 'View all employees':
      await viewEmployees();
      break;
    case 'Add a department':
      const newDepartmentName = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the department name:',
        },
      ]);
      await addDepartment(newDepartmentName.name);
      break;
    case 'Add a role':
      const { title, salary, department_id } = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the role title:',
        },
        {
          type: 'number',
          name: 'salary',
          message: 'Enter the role salary:',
        },
        {
          type: 'number',
          name: 'department_id',
          message: 'Enter the department ID:',
        },
      ]);
      await addRole(title, salary, department_id);
      break;
    case 'Add an employee':
      const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'Enter the employee first name:',
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Enter the employee last name:',
        },
        {
          type: 'number',
          name: 'role_id',
          message: 'Enter the employee role ID:',
        },
        {
          type: 'number',
          name: 'manager_id',
          message: 'Enter the employee manager ID (or leave blank for none):',
          default: null,
        },
      ]);
      await addEmployee(first_name, last_name, role_id, manager_id);
      break;
    case 'Update an employee role':
      const { employee_id, role_id: newRoleId } = await inquirer.prompt([
        {
          type: 'number',
          name: 'employee_id',
          message: 'Enter the employee ID toupdate:',
        },
        {
          type: 'number',
          name: 'role_id',
          message: 'Enter the new role ID:',
        },
      ]);
      await updateEmployeeRole(employee_id, newRoleId);
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit(0);
  }

  mainMenu();
};

mainMenu();