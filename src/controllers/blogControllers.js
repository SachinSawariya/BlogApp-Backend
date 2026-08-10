const blogSevice = require("../services/blogServices");
const googleIndexingService = require("../services/googleIndexingService");
const asyncHandler = require("../utils/asyncHandler");
const utils = require("../utils/responseMsg");

const getSections = asyncHandler(async (req, res) => {
  const result = await blogSevice.getAllSections(req, res);
  if (result?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, []);
  }
});

const getFeaturedArticles = asyncHandler(async (req, res) => {
  const result = await blogSevice.getFeaturedArticles(req, res);
  if (result?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, []);
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

const getAdminBlogList = asyncHandler(async (req, res) => {
  const result = await blogSevice.getAdminBlogList(req, res);
  if (result?.length >= 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.failureResponse("Failed to fetch articles", res);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const result = await blogSevice.updateBlog(req, res);
  if (result) {
    res.message = "Article updated successfully";
    return utils.successResponse(result, res);
  } else {
    return utils.failureResponse("Failed to update article", res);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const result = await blogSevice.deleteBlog(req, res);
  if (result) {
    res.message = "Article deleted successfully";
    return utils.successResponse(result, res);
  } else {
    return utils.failureResponse("Failed to delete article", res);
  }
});

const getAdminArticleBySlug = asyncHandler(async (req, res) => {
  const result = await blogSevice.getAdminArticleBySlug(req, res);
  if (result) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, "Article not found");
  }
});

const getArticlesByTag = asyncHandler(async (req, res) => {
  const result = await blogSevice.getArticlesByTag(req, res);
  if (result?.articles?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, "No articles found for this tag");
  }
});

const getArticleSEO = asyncHandler(async (req, res) => {
  const result = await blogSevice.getArticleSEO(req, res);
  if (result) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, "Article not found");
  }
});

const indexUrl = asyncHandler(async (req, res) => {
  const { url, type } = req.body;
  
  if (!url) {
    return utils.failureResponse("URL is required", res);
  }

  if (!type || !['URL_UPDATED', 'URL_DELETED'].includes(type)) {
    return utils.failureResponse("Type must be URL_UPDATED or URL_DELETED", res);
  }

  try {
    const result = await googleIndexingService.indexUrl(url, type);
    res.message = "URL indexing request sent to Google successfully";
    return utils.successResponse(result, res);
  } catch (error) {
    return utils.failureResponse(error.message, res);
  }
});

module.exports = {
  getSections,
  getFeaturedArticles,
  getBlogList,
  getAdminBlogList,
  getAdminArticleBySlug,
  getArticlesByCategory,
  getArticlesByTag,
  getArticleBySlug,
  getArticleSEO,
  updateBlog,
  deleteBlog,
  createBlog,
  indexUrl
};
