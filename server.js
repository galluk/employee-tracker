// pull in required packages
const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require('console.table');

// require the dbScripts

// set up the logo
const logo = require('asciiart-logo');
const config = require('./package.json');
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
    selectEmployees();
    connection.end();
});

function selectEmployees() {
    connection.query(
        SELECT_ALL_EMPLOYEES,
        function (error, result) {
            if (error) throw error;
            // Log all results of the SELECT statement
            console.table(result);
        });
}