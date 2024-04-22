import { db } from '../db/connection.js';

const viewRoles = async () => {
    const [rows] = await db.execute('SELECT * FROM role');
    console.table(rows);
};

const addRole = async (title, salary, departmentId) => {
    const [result] = await db.execute('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
    return result.insertId;
};

export { viewRoles, addRole };