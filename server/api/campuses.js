const { students, campuses } = require("../db");
const router = require("express").Router();
router.get("/", async (req, res, next) => {
  console.log("TESTTTTTTT");
  try {
    const campus = await campuses.findAll();
    res.send(campus);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
