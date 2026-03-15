const categoryService = require("../services/categoryService");
const asyncHandler = require("../utils/asyncHandler");
const utils = require("../utils/responseMsg");

const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories();
  if (result?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, null);
  }
});

const getTopCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getTopCategories();
  if (result?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, null);
  }
});

const createCategories = asyncHandler(async (req, res) => {
  const date = req.body;
  const result = await categoryService.createCategories(date, res);
  if (result?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, null);
  }
});

const getArticleTitlesByCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.getArticleTitlesByCategory(req, res);
  if (result === null) {
    return utils.recordNotFound(res, "Category not found");
  } else if (result?.articles?.length > 0) {
    return utils.successResponse(result, res);
  } else {
    return utils.recordNotFound(res, "No articles found for this category");
  }
});

// const getBlogList = asyncHandler(async (req, res) => {
//   const result = await blogSevice.getAllBlogs(req, res);
//   if (result?.length > 0) {
//     return utils.successResponse(result, res);
//   } else {
//     return utils.recordNotFound(res, null);
//   }
// });

module.exports = {
  getCategories,
  getTopCategories,
  createCategories,
  getArticleTitlesByCategory,
//   getBlogList,
};
