const express = require("express");
const contactController = require("../controllers/contactControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send-msg", contactController.saveContactFormMsgToDB);
router.get("/get-msgs", authMiddleware, contactController.getAllMsg);

module.exports = router;
