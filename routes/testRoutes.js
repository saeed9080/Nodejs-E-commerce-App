const express = require("express");
const testController = require("../controllers/testController");

// router object
const router = express.Router();

// routes
router.get("/test",testController);

module.exports = router; // export route object
