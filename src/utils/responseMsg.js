const { RESPONSE_CODE } = require('./constant.js');
const responseStatusCode = require('./responseCode.js');

exports.successResponse = (data, res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: data,
    });
};

exports.createdDocumentResponse = (data, res) => {
    return res.status(responseStatusCode.create).json({
      code: RESPONSE_CODE.DEFAULT,
      message: res.message,
      data: data,
    });
};

exports.unAuthenticated = (res) => {
    return res.status(responseStatusCode.unAuthorized).json({
        code: RESPONSE_CODE.UNAUTHENTICATED,
        message: res.message,
        data: {}
    });
};

exports.wrongPassword = (res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {}
    });
};

exports.inValidParam = (message, res) => {
    message = message.replace(/\"/g, "");
    res.message = message;
    return res.status(responseStatusCode.validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: message,
      data: {}
    });
};

exports.failureResponse = (data, res) => {
    let i = 0;
    if (data.name === "ValidationError") {
        Object.keys(data.errors).forEach((key) => {
            if (i !== 1) {
                data.message = data.errors[key].message;
            }
            i++;
        });
    }
    res.message = data.message;
    return res.status(responseStatusCode.validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: data.message ? data.message : data,
    });
};

exports.badRequest = (data, res) => {
    return res.status(responseStatusCode.validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: data,
    });
};

exports.recordNotFound = (res, data) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: data
    });
};

exports.loginSuccess = async (result, res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.LOGIN,
        message: res.message,
        data: result,
    });
};

exports.verificationOTP = (result, res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.OTP,
        message: res.message,
        data: result.token ? result : { message: result },
    });
};

exports.loginFailed = (error, res) => {
    res.message = error.message;
    return res.status(responseStatusCode.validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: error.message,
        data: {}
    });
};

exports.userNotFound = (res) => {
    return res.status(responseStatusCode.validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {}
    });
};

exports.logoutSuccessfull = (result, res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: result,
    });
};

exports.changePasswordFailResponse = (res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

exports.passwordEmailWrong = (res) => {
    return res.status(responseStatusCode.unAuthorized).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {}
    });
};

exports.loginOtpVerified = (data, res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.OTP,
        message: res.message,
        data: data,
    });
};

exports.loginOtpVerificationFailed = (res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {}
    });
};

exports.accountNotVerified = (res) => {
    return res.status(responseStatusCode.success).json({
        code: RESPONSE_CODE.NOT_VERIFIED,
        message: res.message
    });
};

exports.credentialsExists = (res) => {
    return res.status(responseStatusCode.duplicateRecord).json({
        code: RESPONSE_CODE.DUPLICATE,
        message: res.message,
    });
}

exports.internalServerError = (res) => {
    return res.status(responseStatusCode.internalServerError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
    });
}

exports.forbidden = (message, res) => {
    return res.status(responseStatusCode.forbidden).json({
        code: RESPONSE_CODE.ERROR,
        message: message,
        data: {}
    });
};

exports.unAuthorizedRequest = (message, res) => {
    return res.status(responseStatusCode.unAuthorized).json({
      code: RESPONSE_CODE.ERROR,
      message: message,
      data: {}
    });
};