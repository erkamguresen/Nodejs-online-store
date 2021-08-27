const Sequelize = require("sequelize");

const sequelize = require("../utilities/database");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quantity: Sequelize.INTEGER,
  price: Sequelize.DOUBLE,
});

module.exports = OrderItem;
