const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
    },
    articlesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


const category = mongoose.model("Category", categorySchema, "category");

module.exports = { category: category, categorySchema: categorySchema };