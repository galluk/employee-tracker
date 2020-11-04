// require the dbScripts
const inquirer = require("inquirer");
const conTable = require('console.table');
const util = require("util");

const dbScripts = require('../scripts/dbScripts');

// const selectDataAsync = util.promisify(selectData);

function selectData(dbConnect, dataType) {
    return new Promise(function (resolve, reject) {
        let queryStr = '';
        switch (dataType) {
            case "E":
                queryStr = dbScripts.SELECT_ALL_EMPLOYEES;
                break;

            case "R":
                queryStr = dbScripts.SELECT_ALL_ROLES;
                break;

            case "D":
                queryStr = dbScripts.SELECT_ALL_DEPARTMENTS;
                break;
        }

        dbConnect.query(queryStr, function (error, result) {
            if (error) return reject(error);
            // if (error) throw error;
            resolve(result);
            // return result;
        });
    });
}

function newDepartment() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the new Department name?",
            validate: val => (val.trim() !== "")
        }
    ]);
}

async function newRole(dbConnect) {
    // let depts = await getDepartments(dbConnect);
    // get the departments first
    selectData(dbConnect, 'D').then((data) => {
        // map to an array with name and value for inquirer list prompt
        let depts = data.map(item => ({ name: item.name, value: item.id }));
        if (depts) {
            return inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the new Role title?",
                    validate: val => (val.trim() !== "")
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the new Role salary?",
                    validate: val => /[0-9]+/gi.test(val)
                },
                {
                    type: "list",
                    name: "dept",
                    message: "What is the new Role Department?",
                    choices: depts
                }
            ])
                .then(data => {
                    // console.log(data);
                    insertNewRole(dbConnect, data.title, data.salary, data.dept);
                });
        }
    })
}

function newDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the new Department Name?",
            validate: val => (val.trim() !== "")
        }
    ]).then(data => {
        insertNewDepartment(connection, data.name);
    });
}

function insertNewDepartment(dbConnect, deptName) {
    if (dbConnect && deptName) {
        dbConnect.query(dbScripts.ADD_DEPARTMENT, [deptName], function (error, result) {
            if (error) throw error;
            console.log(result);
            return result;
        });
    }
}

function insertNewRole(dbConnect, title, salary, deptId) {
    if (dbConnect && title) {
        dbConnect.query(dbScripts.ADD_ROLE, [title, salary, deptId], function (error, result) {
            if (error) throw error;
            return result;
        });
    }
}

function newEmployee(dbConnect) {
    return new Promise(function (resolve, reject) {
        let roles;
        let managers;

        // get the roles first
        selectData(dbConnect, 'R').then((data) => {
            // map to an array with name and value for inquirer list prompt
            roles = data.map(item => ({ name: item.title, value: item.id }));
            console.log(roles);

            // now get the other employees as potential managers
            selectData(dbConnect, 'E').then((data) => {

                // map to an array with name and value for inquirer list prompt        
                managers = data.map(item => ({ name: `${item.first_name} ${item.last_name}`, value: item.id }));
                console.log(managers);

                inquirer.prompt([
                    {
                        type: "input",
                        name: "firstName",
                        message: "Enter Employee first name:",
                        validate: val => (val.trim() !== "")
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "Enter Employee last name:",
                        validate: val => (val.trim() !== "")
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select Employee role:",
                        choices: roles,
                    },
                    {
                        type: "confirm",
                        name: "hasManager",
                        message: "Does the new Employee have a Manager?"
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Select Employee Manager:",
                        choices: managers,
                        when: (answers) => answers.hasManager === true
                    }
                ]).then(data => {
                    console.log(data);
                    let result = insertNewEmployee(dbConnect, data.firstName, data.lastName, data.role, data.manager);
                    resolve(result);
                });
            });
        });
    });
}

function insertNewEmployee(dbConnect, fName, lName, roleId, managerId) {
    if (dbConnect && fName && lName) {
        dbConnect.query(dbScripts.ADD_EMPLOYEE, [fName, lName, roleId, managerId], function (error, result) {
            if (error) throw error;
            return result;
        });
    }
}

function updateEmployeeRole(dbConnect) {
    return new Promise(function (resolve, reject) {
        let employees;
        let roles;

        // get the employees
        selectData(dbConnect, 'E').then((data) => {
            // map to an array with name and value for inquirer list prompt        
            employees = data.map(item => ({ name: `${item.first_name} ${item.last_name}`, value: item.id }));
            console.log(employees);

            // and get the roles
            selectData(dbConnect, 'R').then((data) => {
                // map to an array with name and value for inquirer list prompt
                roles = data.map(item => ({ name: item.title, value: item.id }));
                console.log(roles);

                inquirer.prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the Employee to update:",
                        choices: employees
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select Employee's new role:",
                        choices: roles,
                    }
                ]).then(data => {
                    dbConnect.query(dbScripts.UPDATE_EMPLOYEE_ROLE, [data.employee, data.role], function (error, result) {
                        if (error) throw error;
                        resolve(result);
                    });
                });
            });
        });
    });
}

module.exports = {
    // selectDataAsync,
    selectData,
    newDepartment,
    newRole,
    newEmployee,
    updateEmployeeRole
}