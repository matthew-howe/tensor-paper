const db = require("./database");
const dataset = require("../db/models/dataset");
const Round = require("../db/models/round");
const Set = require("../db/models/set");

// Round.belongsTo(Set);

// Set.hasMany(Round);

// console.log(Round);

async function assignRound() {
  await Round.setSet(Set);
}

module.exports = {
  Round,
  Set,
  dataset,
  db
};

// pug.getOwner() // returns a promise for the pug's owner

// pug.setOwner(owner) // updates the pug's ownerId to be the id of the passed-in owner, and returns a promise for the updated pug

// owner.getPugs() // returns a promise for an array of all of the owner's pugs (that is, all pugs with ownerId equal to the owner's id)

// owner.setPugs(arrayOfPugs)
