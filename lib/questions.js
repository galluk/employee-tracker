const inquirer = require("inquirer");
// require the dbScripts and consts
const dbEngine = require('../db/engine');
const appConsts = require('../const/conts');

// return an array of employees names and id from the db. Used in inquirer query array.
const getEmployeeArray = async () => {
    let employeeData = await dbEngine.selectData(appConsts.EMPLOYEE_STR);
    // map to an array with full name name and value   
    return employeeData.map(item => ({ name: `${item.first_name} ${item.last_name}`, value: item.id }));
}

// return an array of role names and id from the db
const getRoleArray = async () => {
    // // map to an array with title and value
    let roleData = await dbEngine.selectData(appConsts.ROLE_STR);
    return roleData.map(item => ({ name: item.title, value: item.id }));
}

const askNewRole = async () => {
    // get the departments first
    departmentData = await dbEngine.selectData(appConsts.DEPARTMENT_STR);

    // map to an array with name and value for inquirer list prompt
    let depts = departmentData.map(item => ({ name: item.name, value: item.id }));

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
                message: "What is the new Role's Department?",
                choices: depts
            }
        ])
    }
}

const askNewDepartment = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the new Department Name?",
            validate: val => (val.trim() !== "")
        }
    ]);
}

const askNewEmployee = async () => {
    let roles = await getRoleArray();
    let managers = await getEmployeeArray();

    return inquirer.prompt([
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
            message: "Select Employee's Manager:",
            choices: managers,
            when: (answers) => answers.hasManager === true
        }
    ]);
}

const askUpdateEmployeeRole = async () => {
    let employees = await getEmployeeArray();
    let roles = await getRoleArray();

    return inquirer.prompt([
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
    ]);
}

const askUpdateEmployeeManager = async () => {
    let employees = await getEmployeeArray();
    let managers = await getEmployeeArray();

    return inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select the Employee to update:",
            choices: employees
        },
        {
            type: "list",
            name: "manager",
            message: "Select Employee's new Manager:",
            choices: managers,
        }
    ]);
}

module.exports = {
    askNewDepartment,
    askNewRole,
    askNewEmployee,
    askUpdateEmployeeRole,
    askUpdateEmployeeManager
}