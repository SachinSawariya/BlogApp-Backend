const express = require("express");
const blogController = require("../controllers/blogControllers");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/get-sections", blogController.getSections);
router.get("/featured-articles", blogController.getFeaturedArticles);
router.get("/articles/:categorySlug", blogController.getArticlesByCategory);
router.get("/article/:slug", blogController.getArticleBySlug);

// Admin routes
router.post("/", authMiddleware, blogController.createBlog);

module.exports = router;
