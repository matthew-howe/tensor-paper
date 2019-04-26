const Sequelize = require("sequelize");
const db = require("../database");

const dataset = db.define("dataset", {
  b: { type: Sequelize.INTEGER },
  g: { type: Sequelize.INTEGER },
  label: { type: Sequelize.STRING },
  r: { type: Sequelize.INTEGER },
  uid: { type: Sequelize.STRING }
});

module.exports = dataset;
