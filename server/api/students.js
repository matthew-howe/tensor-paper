const router = require("express").Router();
const { students, campuses } = require("../db");
//note plural / singular
router.get("/", async (req, res, next) => {
  console.log("TESTTTTTTT");
  try {
    const student = await students.findAll();
    res.send(student);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
