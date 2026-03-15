const express = require("express");
const authController = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
