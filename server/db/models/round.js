const Sequelize = require('sequelize')
const db = require('../db')

const round = db.define('round', {
  userThrow: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: true
  },
  cpuThrow: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: true
  },
  cpuWinStatus: {
    type: Sequelize.INTEGER
  }
})

module.exports = round
