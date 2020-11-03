const SELECT_ALL_EMPLOYEES =
    `SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, 
        role.salary, concat(m.first_name, ' ', m.last_name) as manager
     FROM employee e
     LEFT JOIN employee m ON (e.manager_id = m.id)
     INNER JOIN role ON (role.id = e.role_id)
     INNER JOIN department ON (department.id = role.department_id)
     ORDER BY e.id`;

const SELECT_ALL_ROLES =
    `SELECT role.id, role.title, department.name AS department, role.salary 
     FROM role
     INNER JOIN department ON (department.id = role.department_id)
     ORDER BY role.title`;

const SELECT_ALL_DEPARTMENTS = `SELECT * FROM department`;