import { db } from '../db/connection.js';

async function viewDepartments() {
  const [rows] = await db.execute('SELECT * FROM department');
  console.table(rows);
}

async function addDepartment(name) {
  const result = await db.execute('INSERT INTO department (name) VALUES (?)', [name]);
  console.log(`Added department with ID: ${result.insertId}`);
}

export  { viewDepartments, addDepartment };