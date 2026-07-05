const mongoose = require("mongoose");
const { Schema } = mongoose;

const seoSchema = new Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      unique: true,
    },
    seoTitle: {
      type: String,
      trim: true
    },
    seoDescription: {
      type: String
    },
    seoKeywords: {
      type: String
    },
    seoCanonicalUrl: {
      type: String
    },
    seoAuthor: {
      type: String,
      trim: true
    },
    seoOgImage: {
      type: String
    }
  },
  { timestamps: true }
);

const seo = mongoose.model("Seo", seoSchema, "seos");

module.exports = { seo, seoSchema };
