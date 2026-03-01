const getAllSections = async (req, res) => {
  try {
    const { Blog } = global.connections.models;

    const sections = await Blog.aggregate([
      // 1️⃣ Sort by latest first
      {
        $sort: { createdAt: -1 }
      },

      // 2️⃣ Add row number per category
      {
        $setWindowFields: {
          partitionBy: "$categoryId",
          sortBy: { createdAt: -1 },
          output: {
            rank: { $documentNumber: {} }
          }
        }
      },

      // 3️⃣ Keep only latest 3 per category
      {
        $match: { rank: { $lte: 3 } }
      },

      // 4️⃣ Lookup category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },

      { $unwind: "$category" },

      // 5️⃣ Group final result
      {
        $group: {
          _id: "$category.name",
          articles: {
            $push: {
              id: "$_id",
              title: "$title",
              slug: "$slug",
              coverImage: "$coverImage",
              authorName: "$authorName",
              views: "$views",
              likes: "$likes",
              readTime: "$readTime",
              section: "$section",
              createdAt: "$createdAt",
              content: "$content"
            }
          }
        }
      },

      {
        $project: {
          _id: 0,
          category: "$_id",
          articles: 1
        }
      }
    ]);

    return sections;
  } catch (error) {
    logger.error("Error while fetching blog sections Details ->", error);
    throw new Error(error.message);
  }
};

const getFeaturedArticles = async (req, res) => {
  try {
    const { Blog, Category } = global.connections.models;
    
    // Get featured articles (latest 8 articles across all categories)
    const featuredArticles = await Blog.aggregate([
      // 1️⃣ Sort by latest first and likes (for better featured selection)
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$likes", 2] }, // Likes weighted more
              { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] } // Recency factor
            ]
          }
        }
      },
      
      // 2️⃣ Sort by score (likes + recency)
      {
        $sort: { score: -1, createdAt: -1 }
      },
      
      // 3️⃣ Limit to 8 articles
      {
        $limit: 8
      },
      
      // 4️⃣ Lookup category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      
      { $unwind: "$category" },
      
      // 5️⃣ Project final structure
      {
        $project: {
          id: "$_id",
          title: 1,
          slug: 1,
          content: 1,
          category: "$category.name",
          readTime: 1,
          imageUrl: "$coverImage",
          likes: 1,
          createdAt: 1,
          views: 1
        }
      }
    ]);

    return featuredArticles;
  } catch (error) {
    logger.error("Error while fetching featured articles ->", error);
    throw new Error(error.message);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const { Blog } = global.connections.models;

    const users = await Blog.find({});

    return users;
  } catch (error) {
    logger.error("Error while fetching all blogs Details ->", error);
    throw new Error(error.message);
  }
};

const getArticlesByCategory = async (req, res) => {
  try {
    const { Blog, Category } = global.connections.models;
    const { categorySlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find category by slug
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return null;
    }

    // Get total count for pagination
    const totalCount = await Blog.countDocuments({ categoryId: category._id });

    // Get paginated articles
    const articles = await Blog.find({ categoryId: category._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('categoryId', 'name slug');

    return {
      articles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalArticles: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1
      },
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug
      }
    };
  } catch (error) {
    logger.error("Error while fetching articles by category ->", error);
    throw new Error(error.message);
  }
};

module.exports = {
  getAllBlogs,
  getAllSections,
  getFeaturedArticles,
  getArticlesByCategory
};
