const { RESPONSE_CODE } = require('./constant');
const responseCode = require('./responseCode')

const asyncHandler = (fn) => (req, res, next ) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        logger.error(err.message);
        res.status(responseCode.internalServerError).json({
          code: RESPONSE_CODE.ERROR,
          message: err.message,
          data: {},
        });
    });
}

module.exports = asyncHandler