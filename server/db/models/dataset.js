const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.define('dataset', {
  b: { type: Sequelize.INTEGER },
  g: { type: Sequelize.INTEGER },
  label: { type: Sequelize.STRING },
  r: { type: Sequelize.INTEGER },
  uid: { type: Sequelize.STRING },
});

// dkataset: {
//     type: Sequelize.ARRAY(Sequelize.INTEGER),
//     allowNull: false,
//     validate: {
//       notEmpty: true,
//     },
//   },
