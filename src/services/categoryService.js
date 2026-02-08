const { slugify } = require("../utils/util");

const getCategories = async () => {
  try {
    const { Category } = global.connections.models;
    const result = await Category.find();
    return result;
  } catch (error) {
    logger.error("Error while getting categories ->", error);
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
  getCategories
};
