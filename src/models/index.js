const { blogSchema } = require('./blogModel.js');
const { categorySchema } = require('./categoryModel.js')
const { userSchema } = require('./userModel.js')

const schemas = [
    {
        model: "Blog", schema: blogSchema, collection: "blogs" 
    },
    {
        model: "Category", schema: categorySchema, collection: "categories"
    },
    {
        model: "User", schema: userSchema, collection: "users"
    }
];

module.exports = schemas;