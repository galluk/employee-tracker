// pull in required internal  packages
const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");

// pull in required internal  packages
const questions = require('./lib/questions');

// set up the logo
const logo = require('asciiart-logo');
const config = require('./package.json');
const { insertNewDepartment, newDepartment } = require("./lib/questions");
console.log(logo(config).render());


const connection = mysql.createConnection({
    host: "localhost",
    // use the default port number
    port: 3306,
    // admin user
    user: "root",
    // admin password
    password: "admin2020",
    // name of db
    database: "employees_db"
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    runMenu();
    // connection.end();
});

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
                //   "Update Employee Manager",
                "exit"
            ]
        })
        .then(async function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    questions.selectData(connection, 'E').then((data) => {
                        console.table(data);
                        runMenu();
                    });
                    // let employees = await questions.selectDataAsync(connection, 'E');
                    // if (employees) {
                    //     console.table(employees);
                    // }
                    // runMenu();
                    break;

                case "View All Roles":
                    // await questions.selectData(connection, 'R');
                    questions.selectData(connection, 'R').then((data) => {
                        console.table(data);
                        runMenu();
                    });
                    break;

                case "View All Departments":
                    // await questions.selectData(connection, 'D');
                    questions.selectData(connection, 'D').then((data) => {
                        console.table(data);
                        runMenu();
                    });
                    break;

                case "Add Employee":
                    questions.newEmployee(connection).then((data) => {
                        console.log('New Employee added: ' + data);
                        runMenu();
                    });
                    break;

                case "Add Role":
                    questions.newRole(connection);
                    runMenu();
                    break;

                case "Add Department":
                    questions.newDepartment(connection);
                    runMenu();
                    break;

                case "Update Employee Role":
                    questions.updateEmployeeRole(connection).then((data) => {
                        console.log('Employee updated: ' + data);
                        runMenu();
                    });
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}