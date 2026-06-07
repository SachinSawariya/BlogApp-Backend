const contactServices = require("../services/contactServices");
const asyncHandler = require("../utils/asyncHandler");
const utils = require("../utils/responseMsg");

const saveContactFormMsgToDB = asyncHandler(async (req, res) => {
  try {
    const result = await contactServices.saveContactFormMsgToDB(req);
    res.message = "Message sent successfully";
    return utils.loginSuccess(result, res);
  } catch (error) {
    return utils.loginFailed(error, res);
  }
});

const getAllMsg = asyncHandler(async (req, res) => {
  try {
    const result = await contactServices.getAllMsg();
    res.message = "Messages retrieved successfully";
    return utils.loginSuccess(result, res);
  } catch (error) {
    return utils.loginFailed(error, res);
  }
});

module.exports = {
  saveContactFormMsgToDB,
  getAllMsg,
};
