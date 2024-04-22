-- Insert sample data into the department table
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Marketing');
INSERT INTO department (name) VALUES ('Engineering');

-- Insert sample data into the role table
INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 70000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', 60000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Manager', 80000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Coordinator', 50000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 90000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Software Developer', 80000, 3);

-- Insert sample data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Doe', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Smith', 4, 2);

-- Commit
COMMIT;
