const express = require("express");
const blogController = require("../controllers/blogControllers");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/get-sections", blogController.getSections);
router.get("/all-articles", blogController.getBlogList);
router.get("/featured-articles", blogController.getFeaturedArticles);
router.get("/articles/:categorySlug", blogController.getArticlesByCategory);
router.get("/tag/:tag", blogController.getArticlesByTag);
router.get("/article/:slug", blogController.getArticleBySlug);
router.get("/article-seo/:slug", authMiddleware, blogController.getArticleSEO);

// Admin routes
router.post("/", authMiddleware, blogController.createBlog);
router.get("/admin-articles", authMiddleware, blogController.getAdminBlogList);
router.get("/admin-article/:slug", authMiddleware, blogController.getAdminArticleBySlug);
router.put("/:id", authMiddleware, blogController.updateBlog);
router.delete("/:id", authMiddleware, blogController.deleteBlog);


module.exports = router;
