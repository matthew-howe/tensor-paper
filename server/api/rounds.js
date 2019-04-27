const round = require("../db/models/round");
const router = require("express").Router();

router.post("/", async (req, res, next) => {
  try {
    const newRound = await round.create(req.body);
    res.json(newRound);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const data = await round.findAll();
    if (data) {
      res.json(data);
    } else {
      res.status(404).send("No matching data");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
