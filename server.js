// pull in required internal  packages
const inquirer = require("inquirer");
const conTable = require('console.table');

// pull in required internal  packages
const connection = require('./db/dbConnection');
const questions = require('./lib/questions');
const appConsts = require('./const/conts');
const dbEngine = require('./db/engine');

// set up the logo
const logo = require('asciiart-logo');
const config = require('./package.json');
const { ADD_DEPARTMENT } = require("./db/dbScripts");
console.log(logo(config).render());

function init() {
    if (connection) {
        connection.connect(err => {
            if (err) throw err;
            console.log("Connected as id " + connection.threadId);
            runMenu();
        });
    } else {
        init();
    }
}

// show the main menu to the user
function runMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                //   "View All Employees by Department",
                //   "View All Employees by Manager",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee Role",
                "Update Employee Manager",
                "exit"
            ]
        })
        .then(async (answer) => {
            switch (answer.action) {
                case "View All Employees":
                    dbEngine.selectData(appConsts.EMPLOYEE_STR)
                        .then((data) => {
                            console.table(data);
                            runMenu();
                        })
                        .catch((err) => {
                            console.log('The following error occured getting Employees: \n', err.message);
                            runMenu();
                        });
                    break;

                case "View All Roles":
                    dbEngine.selectData(appConsts.ROLE_STR).then((data) => {
                        console.table(data);
                        runMenu();
                    })
                        .catch((err) => {
                            console.log('The following error occured getting Roles: \n', err.message);
                            runMenu();
                        });
                    break;

                case "View All Departments":
                    dbEngine.selectData(appConsts.DEPARTMENT_STR).then((data) => {
                        console.table(data);
                        runMenu();
                    })
                        .catch((err) => {
                            console.log('The following error occured getting Departments: \n', err.message);
                            runMenu();
                        });
                    break;

                case "Add Employee":
                    questions.askNewEmployee().then(async data => {
                        // console.log(data);
                        await dbEngine.insertNewEmployee(data.firstName, data.lastName, data.role, data.manager);
                        runMenu();
                    });
                    break;

                case "Add Role":
                    questions.askNewRole().then(async data => {
                        dbEngine.insertNewRole(data.title, data.salary, data.dept)
                            .then((result) => {
                                if (result.affectedRows === 1) {
                                    console.log(`${data.title} sucessfully added.`);
                                }
                                runMenu();
                            })
                            .catch((err) => {
                                console.log('The following error occured adding new Role: \n', err.message);
                                runMenu();
                            })
                    });
                    break;

                case "Add Department":
                    questions.askNewDepartment().then(async data => {
                        dbEngine.insertNewDepartment(data.name)
                            .then((result) => {
                                if (result.affectedRows === 1) {
                                    console.log(`${data.name} sucessfully added.`);
                                }
                                runMenu();
                            })
                            .catch((err) => {
                                console.log('The following error occured adding new Department: \n', err.message);
                                runMenu();
                            })
                    });
                    break;

                case "Update Employee Role":
                    questions.askUpdateEmployeeRole().then(async data => {
                        dbEngine.updateEmployeeRole(data.employee, data.role)
                            .then((result) => {
                                if (result.affectedRows === 1) {
                                    console.log(`Employee Role sucessfully updated.`);
                                }
                                runMenu();
                            })
                            .catch((err) => {
                                console.log('The following error occured updating Employee Role: \n', err.message);
                                runMenu();
                            })
                    });
                    break;

                case "Update Employee Manager":
                    questions.askUpdateEmployeeManager().then(async data => {
                        await dbEngine.updateEmployeeManager(data.employee, data.manager)
                            .then((result) => {
                                if (result.affectedRows === 1) {
                                    console.log(`Employee Manager sucessfully updated.`);
                                }
                                runMenu();
                            })
                            .catch((err) => {
                                console.log('The following error occured updating Employee Manager: \n', err.message);
                                runMenu();
                            })
                    });
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

init();