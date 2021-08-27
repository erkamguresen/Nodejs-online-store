const Sequelize = require("sequelize");

const sequelize = require("../utilities/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  //   password: Sequelize.STRING,
  // role: Sequelize.STRING,
  // status: Sequelize.STRING,
});

module.exports = User;
