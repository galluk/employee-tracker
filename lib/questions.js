const inquirer = require("inquirer");
// require the dbScripts and consts
const dbEngine = require('../db/engine');
const appConsts = require('../const/conts');

const confirmDelete = async (message) => {
    return inquirer.prompt([
        {
            type: "confirm",
            name: "delete",
            message: message
        }
    ]);
}

// return an array of employees names and id from the db. Used in inquirer query array.
const getEmployeeArray = async () => {
    let employeeData = await dbEngine.selectData(appConsts.EMPLOYEE_STR);
    // map to an array with full name name and value   
    return employeeData.map(item => ({ name: `${item.first_name} ${item.last_name}`, value: item.id }));
}

// return an array of role titles and id from the db
const getRoleArray = async () => {
    // // map to an array with title and value
    let roleData = await dbEngine.selectData(appConsts.ROLE_STR);
    return roleData.map(item => ({ name: item.title, value: item.id }));
}

// return an array of department names and id from the db
const getDepartmentArray = async () => {
    // // map to an array with title and value
    let deptData = await dbEngine.selectData(appConsts.DEPARTMENT_STR);
    return deptData.map(item => ({ name: item.name, value: item.id }));
}

const getNumEmployeesWithRole = async (role) => {
    let data = await dbEngine.countRoleEmployees(role);
    // data contains the count of employees in role
    return data[0].num_employees;
}

const getNumEmployeesWithinDepartment = async (department) => {
    let data = await dbEngine.countDepartmentEmployees(department);
    // data contains the count of employees in department
    return data[0].num_employees;
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

const askDeleteRole = async () => {
    return new Promise(async (resolve, reject) => {
        let roles = await getRoleArray();

        let doDelete = false;

        await inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Select the Role to delete:",
                choices: roles
            }
        ]).then(async data => {
            // check db if employees assigned to role
            let numEmployees = await getNumEmployeesWithRole(data.role);
            if (numEmployees > 0) {
                await confirmDelete(`The selected Role has ${numEmployees} employee(s) assigned to it, whose Role will be cleared. Are you sure you want to delete it?`)
                    .then(deleteData => {
                        doDelete = deleteData.delete;
                    });
            }
            else {
                // no affected employees so allow delete
                doDelete = true;
            }
            resolve({ action: doDelete, roleId: data.role });
        });
    });
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

const askDeleteDepartment = async () => {
    return new Promise(async (resolve, reject) => {
        let roles = await getDepartmentArray();

        let doDelete = false;

        await inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Select the department to delete:",
                choices: roles
            }
        ]).then(async data => {
            // check db if employees assigned to department
            let numEmployees = await getNumEmployeesWithinDepartment(data.department);
            if (numEmployees > 0) {
                await confirmDelete(`The selected Department has ${numEmployees} employee(s) assigned to it, whose Role will be cleared. Are you sure you want to delete it?`)
                    .then(deleteData => {
                        doDelete = deleteData.delete;
                    });
            }
            else {
                // no affected employees so allow delete
                doDelete = true;
            }
            resolve({ action: doDelete, departmentId: data.department });
        });
    });
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

const askDeleteEmployee = async () => {
    let employees = await getEmployeeArray();

    return inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select the Employee to delete:",
            choices: employees
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
    askDeleteDepartment,
    askNewRole,
    askDeleteRole,
    askNewEmployee,
    askDeleteEmployee,
    askUpdateEmployeeRole,
    askUpdateEmployeeManager
}