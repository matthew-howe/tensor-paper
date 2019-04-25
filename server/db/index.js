"use strict";

const db = require("./database");
const campuses = require("../db/models/campuses");
const students = require("../db/models/students");
// The purpose of this module is to bring your Sequelize instance (`db`) together
// with your models (which you should define in separate modules in this directory).
// Example:
//
// const Puppy = require('./puppy')
// const Owner = require('./owner')

// After you've required all of your models into this module, you should establish
// associations (https://sequelize-guides.netlify.com/association-types/) between them here as well!
// Example:
//
// Puppy.belongsTo(Owner)
//TODO: add relationships
students.belongsTo(campuses);
campuses.hasMany(students);
module.exports = {
  // Include your models in this exports object as well!
  campuses,
  students,
  db
};
