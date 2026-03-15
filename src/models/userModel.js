const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema, "users");

module.exports = { user: user, userSchema: userSchema };
