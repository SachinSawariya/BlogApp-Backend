const { slugify } = require("../utils/util");

const getCategories = async () => {
  try {
    const { Category, Blog } = global.connections.models;
    const result = await Category.find();
    return result;
  } catch (error) {
    logger.error("Error while getting categories ->", error);
    throw new Error(error.message);
  }
};

const getTopCategories = async () => {
  try {
    const { Category, Blog } = global.connections.models;
    
    // Get categories with article counts, sorted by count (descending), limited to 5
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "categoryId",
          as: "articles"
        }
      },
      {
        $addFields: {
          articleCount: { $size: "$articles" }
        }
      },
      {
        $match: {
          articleCount: { $gt: 0 } // Only include categories with articles
        }
      },
      {
        $sort: { articleCount: -1 } // Sort by article count descending
      },
      {
        $limit: 5 // Limit to top 5 categories
      },
      {
        $project: {
          name: 1,
          slug: 1,
          articleCount: 1,
          _id: 1
        }
      }
    ]);

    return categories;
  } catch (error) {
    logger.error("Error while getting top categories ->", error);
    throw new Error(error.message);
  }
};

const createCategories = async (data, res) => {
  try {
    const { Category } = global.connections.models;

    const results = [];
    data.forEach(async (element) => {
      const slug = slugify(element.name);
      element.slug = slug;

      const isCategoryExist = await Category.findOne({ slug });

      if (isCategoryExist) {
        return;
      }

      const response = await Category.create(element);
      results.push(response);
    });
    return results;
  } catch (error) {
    logger.error("Error while creating categories ->", error);
    throw new Error(error.message);
  }
};

module.exports = {
  createCategories,
  getCategories,
  getTopCategories
};
