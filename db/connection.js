import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'test123',
  database: 'ems',
});

const db = pool.promise();

export { db };