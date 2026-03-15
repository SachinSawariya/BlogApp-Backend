const jwt = require("jsonwebtoken");
const utils = require("../utils/responseMsg");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return utils.unAuthenticated(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded;
    
    // Check if admin role is required (default behavior for this app's admin section)
    if (req.user.role !== 'admin') {
        return utils.forbidden("Access denied. Admins only.", res);
    }
    
    next();
  } catch (error) {
    return utils.unAuthenticated(res);
  }
};

module.exports = authMiddleware;
