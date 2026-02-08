const { blogSchema } = require('./blogModel.js');
const { categorySchema } = require('./categoryModel.js')

const schemas = [
    {
        model: "Blog", schema: blogSchema, collection: "blogs" 
    },
    {
        model: "Category", schema: categorySchema, collection: "categories"
    }
];

module.exports = schemas;