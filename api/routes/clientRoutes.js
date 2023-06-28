const clientModel = require("../models/clientModel");
const express = require("express");
const clientController = require("../controllers/clientController");
const router = express.Router();

router.post("/", clientController.createClient);

module.exports = router;