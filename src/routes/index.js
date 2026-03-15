const express = require("express");
const blogRoutes = require("./blogRoutes");
const categoryRoutes = require("./categoryRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.use("/api/v1/blogs", blogRoutes);
router.use("/api/v1/categories", categoryRoutes);
router.use("/api/v1/auth", authRoutes);

module.exports = router;
