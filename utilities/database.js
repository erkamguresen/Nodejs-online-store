const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "sammy",
  password: "password",
  database: "node-app",
});

module.exports = connection.promise();
