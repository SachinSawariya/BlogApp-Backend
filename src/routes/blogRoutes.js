const express = require("express");
const blogController = require("../controllers/blogControllers");
const router = express.Router();

router.get("/get-sections", blogController.getSections);
router.get("/articles/:categorySlug", blogController.getArticlesByCategory);

module.exports = router;
