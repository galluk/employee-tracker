const mysql = require("mysql");

var connection;

const createMySQLConnection = async () => {
    connection = mysql.createConnection({
        host: "localhost",
        // use the default port number
        port: 3306,
        // admin user
        user: "root",
        // admin password
        password: "",
        // name of db
        database: "employees_db"
    });
}


const initialise = async () => {
    await createMySQLConnection();
}

initialise();

// connection.connect(err => {
//     if (err) throw err;
//     console.log("Connected as id " + connection.threadId);
// });

module.exports = connection;

