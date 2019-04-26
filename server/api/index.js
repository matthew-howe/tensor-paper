"use strict";
const Dataset = require("../db/models/dataset");
const router = require("express").Router();
module.exports = router;

router.get("/dataset", async (req, res, next) => {
  try {
    const data = await Dataset.findAll();
    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
});

router.use("/rounds", require("./rounds"));

router.use((req, res, next) => {
  const err = new Error("API route not found!");
  err.status = 404;
  next(err);
});
