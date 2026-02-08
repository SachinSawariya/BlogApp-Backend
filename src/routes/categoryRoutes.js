const express = require("express");
const categoryController = require("../controllers/categoryControllers")
const router = express.Router();

router.get(
  "/list",
  categoryController.getCategories
);

router.post(
  "/create",
  categoryController.createCategories
);

// router.get("/get-sections", blogController.getSections);

module.exports = router;
