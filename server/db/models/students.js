const Sequelize = require("sequelize");
const db = require("../database");

module.exports = db.define("students", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: "defaultimage.jpg"
  },
  gpa: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0,
      max: 4
    }
  }
});
