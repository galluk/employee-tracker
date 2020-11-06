const mysql = require("mysql");

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

// connection.connect(err => {
//     if (err) throw err;
//     console.log("Connected as id " + connection.threadId);
// });

module.exports = connection;

