const authService = require("../services/authServices");
const asyncHandler = require("../utils/asyncHandler");
const utils = require("../utils/responseMsg");

const login = asyncHandler(async (req, res) => {
  try {
    const result = await authService.login(req, res);
    res.message = "Login successful";
    return utils.loginSuccess(result, res);
  } catch (error) {
    return utils.loginFailed(error, res);
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
    const result = await authService.getProfile(req, res);
    res.message = "Profile retrieved successfully";
    return utils.successResponse(result, res);
  } catch (error) {
    return utils.failureResponse(error, res);
  }
});

module.exports = {
  login,
  getProfile,
};
