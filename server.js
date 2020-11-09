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
console.log(logo(config).render());

function init() {
    if (connection) {
        connection.connect(err => {
            if (err) throw err;
            console.log("Successfully connected to the database...");
            runMenu();
        });
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
                "Add Employee",
                "Add Role",
                "Add Department",
                "Delete Employee",
                "Delete Role",
                "Delete Department",
                "Update Employee Role",
                "Update Employee Manager",
                "View utilized Department budget",
                "exit"
            ]
        })
        .then(async (answer) => {
            switch (answer.action) {
                case "View All Employees":
                    dbEngine.selectData(appConsts.EMPLOYEE_COMBINED_STR)
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

                case "Delete Employee":
                    questions.askDeleteEmployee().then(async data => {
                        dbEngine.deleteEmployee(data.employee)
                            .then((result) => {
                                if (result.affectedRows === 1) {
                                    console.log(`Employee sucessfully deleted.`);
                                }
                                runMenu();
                            })
                            .catch((err) => {
                                console.log('The following error occured deleting Employee: \n', err.message);
                                runMenu();
                            })
                    });
                    break;

                case "Delete Role":
                    questions.askDeleteRole().then(async data => {
                        if (data.action) {
                            dbEngine.deleteRole(data.roleId)
                                .then((result) => {
                                    if (result.affectedRows === 1) {
                                        console.log(`Role sucessfully deleted.`);
                                    }
                                    runMenu();
                                })
                                .catch((err) => {
                                    console.log('The following error occured deleting Role: \n', err.message);
                                    runMenu();
                                });
                        } else {
                            runMenu();
                        }
                    });
                    break;

                case "Delete Department":
                    questions.askDeleteDepartment().then(async data => {
                        if (data.action) {
                            dbEngine.deleteDepartment(data.departmentId)
                                .then((result) => {
                                    if (result.affectedRows === 1) {
                                        console.log(`Department sucessfully deleted.`);
                                    }
                                    runMenu();
                                })
                                .catch((err) => {
                                    console.log('The following error occured deleting Department: \n', err.message);
                                    runMenu();
                                });
                        } else {
                            runMenu();
                        }
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

                case "View utilized Department budget":
                    dbEngine.selectData(appConsts.DEPARTMENT_BUDGET_STR)
                        .then((data) => {
                            console.table(data);
                            runMenu();
                        })
                        .catch((err) => {
                            console.log('The following error occured getting Department budgets: \n', err.message);
                            runMenu();
                        });
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

init();