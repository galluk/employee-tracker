// department scripts
const SELECT_ALL_DEPARTMENTS = `SELECT * FROM department`;
const ADD_DEPARTMENT = `INSERT INTO department (name) VALUES (?)`;
const DELETE_DEPARTMENT = `DELETE FROM department WHERE id = ?`;
const SELECT_DEPARTMENT_BUDGETS =
    `SELECT d.name AS department, COUNT(e.id) AS num_employees, SUM(role.salary) AS budget
    FROM employee e
    INNER JOIN role ON (role.id = e.role_id)
    INNER JOIN department d ON (d.id = role.department_id)
    GROUP BY department`;

const COUNT_EMPLOYEES_IN_DEPARTMENT =
    `SELECT COUNT(e.id) AS num_employees
    FROM employee e
    INNER JOIN role r on (r.id = e.role_id)
    INNER JOIN department d ON (d.id = r.department_id)
    WHERE d.id = ?`

// role scripts
const SELECT_ALL_ROLES =
    `SELECT role.id, role.title, department.name AS department, role.salary 
     FROM role
     INNER JOIN department ON (department.id = role.department_id)
     ORDER BY role.title`;

const ADD_ROLE = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

const DELETE_ROLE = `DELETE FROM role WHERE id = ?`;

const COUNT_EMPLOYEES_IN_ROLE =
    `SELECT COUNT(e.id) AS num_employees
    FROM employee e
    INNER JOIN role r on (r.id = e.role_id)
    WHERE r.id = ?`;

// employee scripts
const SELECT_ALL_EMPLOYEES_WITH_ROLE_MANAGER =
    `SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, 
        role.salary, concat(m.first_name, ' ', m.last_name) as manager
     FROM employee e
     LEFT JOIN employee m ON (e.manager_id = m.id)
     INNER JOIN role ON (role.id = e.role_id)
     INNER JOIN department ON (department.id = role.department_id)
     ORDER BY e.id`;

const SELECT_ALL_EMPLOYEES = `SELECT * FROM employee`;

const ADD_EMPLOYEE = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

const DELETE_EMPLOYEE = `DELETE FROM employee WHERE id = ?`;

const UPDATE_EMPLOYEE_ROLE = `UPDATE employee SET role_id = ? WHERE id = ?`;

const UPDATE_EMPLOYEE_MANAGER = `UPDATE employee SET manager_id = ? WHERE id = ?`;


module.exports = {
    SELECT_ALL_DEPARTMENTS,
    ADD_DEPARTMENT,
    DELETE_DEPARTMENT,
    COUNT_EMPLOYEES_IN_DEPARTMENT,
    SELECT_ALL_ROLES,
    ADD_ROLE,
    DELETE_ROLE,
    COUNT_EMPLOYEES_IN_ROLE,
    SELECT_ALL_EMPLOYEES_WITH_ROLE_MANAGER,
    SELECT_ALL_EMPLOYEES,
    ADD_EMPLOYEE,
    DELETE_EMPLOYEE,
    UPDATE_EMPLOYEE_ROLE,
    UPDATE_EMPLOYEE_MANAGER,
    SELECT_DEPARTMENT_BUDGETS
}