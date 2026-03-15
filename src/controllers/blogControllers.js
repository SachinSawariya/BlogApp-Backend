const blogSevice = require("../services/blogServices");
const asyncHandler = require("../utils/asyncHandler");
const utils = require("../utils/responseMsg");

const getSections = asyncHandler(async (req, res) => {
  const result = await blogSevice.getAllSections(req, res);
  if (result?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, null);
  }
});

const getFeaturedArticles = asyncHandler(async (req, res) => {
  const result = await blogSevice.getFeaturedArticles(req, res);
  if (result?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, null);
  }
});

const getBlogList = asyncHandler(async (req, res) => {
  const result = await blogSevice.getAllBlogs(req, res);
  if (result?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, null);
  }
});

const getArticlesByCategory = asyncHandler(async (req, res) => {
  const result = await blogSevice.getArticlesByCategory(req, res);
  if (result === null) {
    return utils.recordNotFound(res, "Category not found");
  } else if (result?.articles?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, "No articles found for this category");
  }
});

const getArticleBySlug = asyncHandler(async (req, res) => {
  const result = await blogSevice.getArticleBySlug(req, res);
  if (result) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, "Article not found");
  }
});

const createBlog = asyncHandler(async (req, res) => {
  const result = await blogSevice.createBlog(req, res);
  if (result) {
    res.message = "Blog created successfully";
    return utils.createdDocumentResponse(result, res);
  } else {
    return utils.failureResponse("Failed to create blog", res);
  }
});

module.exports = {
  getSections,
  getFeaturedArticles,
  getBlogList,
  getArticlesByCategory,
  getArticleBySlug,
  createBlog
};
