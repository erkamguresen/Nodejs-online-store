// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "sammy",
//   password: "password",
//   database: "node-app",
// });

// module.exports = connection.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-app", "sammy", "password", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
