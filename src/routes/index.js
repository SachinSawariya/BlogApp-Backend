const express = require("express");
const blogRoutes = require("./blogRoutes");
const categoryRoutes = require("./categoryRoutes");
const authRoutes = require("./authRoutes");
const contactRoutes = require('./contactRoutes');

const router = express.Router();

router.use("/api/v1/blogs", blogRoutes);
router.use("/api/v1/categories", categoryRoutes);
router.use("/api/v1/auth", authRoutes);
router.use('/api/v1/contact', contactRoutes);

module.exports = router;
