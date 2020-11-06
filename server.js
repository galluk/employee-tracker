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

// const connection = mysql.createConnection({
//     host: "localhost",
//     // use the default port number
//     port: 3306,
//     // admin user
//     user: "root",
//     // admin password
//     password: "admin2020",
//     // name of db
//     database: "employees_db"
// });

// connection.connect(err => {
//     if (err) throw err;
//     console.log("Connected as id " + connection.threadId);
//     dbEngine = new Engine(connection);
//     runMenu();
//     // connection.end();
// });

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
                    dbEngine.selectData(appConsts.EMPLOYEE_STR).then((data) => {
                        console.table(data);
                        runMenu();
                    });
                    break;

                case "View All Roles":
                    dbEngine.selectData(appConsts.ROLE_STR).then((data) => {
                        console.table(data);
                        runMenu();
                    });
                    break;

                case "View All Departments":
                    dbEngine.selectData(appConsts.DEPARTMENT_STR).then((data) => {
                        console.table(data);
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
                        await dbEngine.insertNewRole(data.title, data.salary, data.dept);
                        runMenu();
                    });
                    break;

                case "Add Department":
                    questions.askNewDepartment().then(async data => {
                        await dbEngine.insertNewDepartment(data.name);
                        runMenu();
                    });
                    break;

                case "Update Employee Role":
                    questions.askUpdateEmployeeRole().then(async data => {
                        await dbEngine.updateEmployeeRole(data.employee, data.role);
                        runMenu();
                    });
                    break;

                case "Update Employee Manager":
                    questions.askUpdateEmployeeManager().then(async data => {
                        await dbEngine.updateEmployeeManager(data.employee, data.manager);
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