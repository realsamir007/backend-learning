const express = require('express');

const { databaseHealth } = require("../controllers/databaseHealthController");

const router = express.Router();

router.get("/", databaseHealth);

module.exports = router;
