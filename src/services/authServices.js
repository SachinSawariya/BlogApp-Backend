const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/config");

const login = async (req, res) => {
  try {
    const { User } = global.connections.models;
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};

const getProfile = async (req, res) => {
  try {
    const { User } = global.connections.models;
    const user = await User.findById(req.user.id).select("-password");
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  login,
  getProfile,
};
