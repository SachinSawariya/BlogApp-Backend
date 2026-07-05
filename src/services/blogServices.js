const getAllSections = async (req, res) => {
  try {
    const { Blog } = global.connections.models;

    const sections = await Blog.aggregate([
      // 0️⃣ Filter only published articles
      {
        $match: { status: "published" },
      },
      // 1️⃣ Sort by latest first
      {
        $sort: { createdAt: -1 },
      },

      // 2️⃣ Add row number per category
      {
        $setWindowFields: {
          partitionBy: "$categoryId",
          sortBy: { createdAt: -1 },
          output: {
            rank: { $documentNumber: {} },
          },
        },
      },

      // 3️⃣ Keep only latest 3 per category
      {
        $match: { rank: { $lte: 3 } },
      },

      // 4️⃣ Lookup category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
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
              content: "$content",
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          category: "$_id",
          articles: 1,
        },
      },
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
      // 0️⃣ Filter only published articles
      {
        $match: { status: "published" },
      },
      // 1️⃣ Sort by latest first and likes (for better featured selection)
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$likes", 2] }, // Likes weighted more
              {
                $divide: [
                  { $subtract: [new Date(), "$createdAt"] },
                  1000 * 60 * 60 * 24,
                ],
              }, // Recency factor
            ],
          },
        },
      },

      // 2️⃣ Sort by score (likes + recency)
      {
        $sort: { score: -1, createdAt: -1 },
      },

      // 3️⃣ Limit to 8 articles
      {
        $limit: 8,
      },

      // 4️⃣ Lookup category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
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
          views: 1,
        },
      },
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

    const users = await Blog.find({ status: "published" })
      .populate("categoryId", "name slug")
      .select("-content -authorAvatar");

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
    const totalCount = await Blog.countDocuments({
      categoryId: category._id,
      status: "published",
    });

    // Get paginated articles
    const articles = await Blog.find({
      categoryId: category._id,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name slug");

    return {
      articles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalArticles: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      },
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug,
      },
    };
  } catch (error) {
    logger.error("Error while fetching articles by category ->", error);
    throw new Error(error.message);
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const { Blog, Seo } = global.connections.models;
    const { slug } = req.params;

    // Find article by slug and populate category
    const article = await Blog.findOne({ slug, status: "published" }).populate(
      "categoryId",
      "name slug",
    );

    if (!article) {
      return null;
    }

    // Increment view count
    await Blog.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

    // Fetch associated SEO data
    const seo = await Seo.findOne({ blogId: article._id });

    // Return article data with all necessary fields for description page
    return {
      id: article._id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      coverImage: article.coverImage,
      authorName: article.authorName,
      authorAvatar: article.authorAvatar,
      views: article.views + 1, // Include the incremented view count
      likes: article.likes,
      readTime: article.readTime,
      section: article.section,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: article.categoryId,
      tags: article.tags,
      authorId: article.authorId,
      status: article.status,
      // Add SEO fields
      seoTitle: seo?.seoTitle,
      seoDescription: seo?.seoDescription,
      seoKeywords: seo?.seoKeywords,
      seoCanonicalUrl: seo?.seoCanonicalUrl,
      seoAuthor: seo?.seoAuthor,
      seoOgImage: seo?.seoOgImage,
    };
  } catch (error) {
    logger.error("Error while fetching article by slug ->", error);
    throw new Error(error.message);
  }
};

const createBlog = async (req, res) => {
  try {
    const { Blog, Category } = global.connections.models;
    const {
      title,
      slug,
      content,
      coverImage,
      categoryId,
      authorName,
      authorAvatar,
      section,
      tags,
      readTime,
      status,
    } = req.body;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const newBlog = new Blog({
      title,
      slug,
      content,
      coverImage,
      categoryId,
      authorName,
      authorAvatar,
      section: section || "Regular",
      tags: tags || [],
      readTime: readTime || 5,
      status: status || "published",
    });

    const savedBlog = await newBlog.save();

    // Increment category article count
    await Category.findByIdAndUpdate(categoryId, {
      $inc: { articlesCount: 1 },
    });

    return savedBlog;
  } catch (error) {
    logger.error("Error while creating blog ->", error);
    throw new Error(error.message);
  }
};

const getAdminBlogList = async (req, res) => {
  try {
    const { Blog } = global.connections.models;
    // Admins see everything, sorted by latest
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate('categoryId', 'name slug');
    return blogs;
  } catch (error) {
    logger.error("Error while fetching admin blog list ->", error);
    throw new Error(error.message);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { Blog, Category } = global.connections.models;
    const { id } = req.params;
    const updateData = req.body;

    const oldBlog = await Blog.findById(id);
    if (!oldBlog) {
      throw new Error("Article not found");
    }

    // Handle category count changes if category is updated
    if (updateData.categoryId && updateData.categoryId !== oldBlog.categoryId.toString()) {
      // Decrement old
      await Category.findByIdAndUpdate(oldBlog.categoryId, { $inc: { articlesCount: -1 } });
      // Increment new
      await Category.findByIdAndUpdate(updateData.categoryId, { $inc: { articlesCount: 1 } });
    }

    if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    }

    // Separate SEO data
    const seoFields = ['seoTitle', 'seoDescription', 'seoKeywords', 'seoCanonicalUrl', 'seoAuthor', 'seoOgImage'];
    const seoData = {};
    let hasSeoData = false;
    
    seoFields.forEach(field => {
      if (updateData[field] !== undefined) {
        seoData[field] = updateData[field];
        hasSeoData = true;
        delete updateData[field]; // Remove from blog update
      }
    });

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    );

    // Update or create SEO document if SEO data was provided
    if (hasSeoData) {
      const { Seo } = global.connections.models;
      await Seo.findOneAndUpdate(
        { blogId: id },
        { $set: seoData },
        { upsert: true, new: true }
      );
    }

    return updatedBlog;
  } catch (error) {
    logger.error("Error while updating blog ->", error);
    throw new Error(error.message);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { Blog, Category, Seo } = global.connections.models;
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error("Article not found");
    }

    await Blog.findByIdAndDelete(id);

    // Decrement category article count
    await Category.findByIdAndUpdate(blog.categoryId, { $inc: { articlesCount: -1 } });

    // Delete associated SEO data
    await Seo.findOneAndDelete({ blogId: id });

    return { message: "Article deleted successfully" };
  } catch (error) {
    logger.error("Error while deleting blog ->", error);
    throw new Error(error.message);
  }
};

const getAdminArticleBySlug = async (req, res) => {
  try {
    const { Blog, Seo } = global.connections.models;
    const { slug } = req.params;

    const article = await Blog.findOne({ slug }).populate('categoryId', 'name slug');

    if (!article) {
      return null;
    }

    const seo = await Seo.findOne({ blogId: article._id });

    return {
      id: article._id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      coverImage: article.coverImage,
      authorName: article.authorName,
      authorAvatar: article.authorAvatar,
      views: article.views,
      likes: article.likes,
      readTime: article.readTime,
      section: article.section,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: article.categoryId,
      tags: article.tags,
      status: article.status,
      // Add SEO fields
      seoTitle: seo?.seoTitle,
      seoDescription: seo?.seoDescription,
      seoKeywords: seo?.seoKeywords,
      seoCanonicalUrl: seo?.seoCanonicalUrl,
      seoAuthor: seo?.seoAuthor,
      seoOgImage: seo?.seoOgImage,
    };
  } catch (error) {
    logger.error("Error while fetching admin article by slug ->", error);
    throw new Error(error.message);
  }
};

const getArticlesByTag = async (req, res) => {
  try {
    const { Blog } = global.connections.models;
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Blog.countDocuments({
      tags: { $elemMatch: { $regex: new RegExp(`^${tag}$`, "i") } },
      status: "published",
    });

    // Get paginated articles
    const articles = await Blog.find({
      tags: { $elemMatch: { $regex: new RegExp(`^${tag}$`, "i") } },
      status: "published",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name slug");

    console.log("articles", articles);

    // Extract the original casing of the tag from the results
    let displayTag = tag;
    if (articles.length > 0) {
      // Look through all articles to find the best casing match
      for (const article of articles) {
        if (article.tags && Array.isArray(article.tags)) {
          const foundTag = article.tags.find(
            (t) => typeof t === 'string' && t.trim().toLowerCase() === tag.trim().toLowerCase()
          );
          if (foundTag) {
            displayTag = foundTag.trim();
            break; 
          }
        }
      }
    }

    return {
      articles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalArticles: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      },
      tag: displayTag,
    };
  } catch (error) {
    logger.error("Error while fetching articles by tag ->", error);
    throw new Error(error.message);
  }
};

module.exports = {
  getAllBlogs,
  getAllSections,
  getFeaturedArticles,
  getArticlesByCategory,
  getArticlesByTag,
  getArticleBySlug,
  getAdminBlogList,
  getAdminArticleBySlug,
  updateBlog,
  deleteBlog,
  createBlog,
};
