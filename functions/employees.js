import { db } from '../db/connection.js';

const viewEmployees = async () => {
  const [employees] = await db.execute('SELECT employee.*, role.title AS role_title, department.name AS department_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id');
  console.table(employees);
};

const addEmployee = async (firstName, lastName, roleId, managerId) => {
  const result = await db.execute
  ('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [firstName, lastName, roleId, managerId ? managerId : null]);
  console.log(`Added employee with ID: ${result[0].insertId}`);
};

const updateEmployeeRole = async (employeeId, roleId) => {
  await db.execute('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
  console.log(`Updated employee's role with ID: ${employeeId}`);
};

export { viewEmployees, addEmployee, updateEmployeeRole };