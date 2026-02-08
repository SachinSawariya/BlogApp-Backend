const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    section: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary or CDN URL
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorAvatar: {
      type: String,
    },
    tags: [String],

    // Blog status (for future guest author moderation)
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    // Basic counters
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 5 
    }
  },
  { timestamps: true }
);

const blog = mongoose.model("Blog", blogSchema, "blog");

module.exports = { blog: blog, blogSchema: blogSchema };
