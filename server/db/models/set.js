const Sequelize = require("sequelize");
const db = require("../database");

const set = db.define("set", {});

module.exports = set;
