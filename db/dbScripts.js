// department scripts
const SELECT_ALL_DEPARTMENTS = `SELECT * FROM department`;
const ADD_DEPARTMENT = `INSERT INTO department (name) VALUES (?)`;

// role scripts
const SELECT_ALL_ROLES =
    `SELECT role.id, role.title, department.name AS department, role.salary 
     FROM role
     INNER JOIN department ON (department.id = role.department_id)
     ORDER BY role.title`;

const ADD_ROLE = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

// employee scripts
const SELECT_ALL_EMPLOYEES =
    `SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, 
        role.salary, concat(m.first_name, ' ', m.last_name) as manager
     FROM employee e
     LEFT JOIN employee m ON (e.manager_id = m.id)
     INNER JOIN role ON (role.id = e.role_id)
     INNER JOIN department ON (department.id = role.department_id)
     ORDER BY e.id`;

const ADD_EMPLOYEE = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

const UPDATE_EMPLOYEE_ROLE = `UPDATE employee SET role_id = ? WHERE id = ?`;

const UPDATE_EMPLOYEE_MANAGER = `UPDATE employee SET manager_id = ? WHERE id = ?`;


module.exports = {
    SELECT_ALL_DEPARTMENTS,
    ADD_DEPARTMENT,
    SELECT_ALL_ROLES,
    ADD_ROLE,
    SELECT_ALL_EMPLOYEES,
    ADD_EMPLOYEE,
    UPDATE_EMPLOYEE_ROLE,
    UPDATE_EMPLOYEE_MANAGER
}