const categoryService = require("../services/categoryService");

const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories();
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
  createCategories,
//   getBlogList,
};
