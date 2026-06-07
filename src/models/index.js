const { blogSchema } = require('./blogModel.js');
const { categorySchema } = require('./categoryModel.js')
const { userSchema } = require('./userModel.js')
const { contactSchema } = require('./contactModel.js')

const schemas = [
    {
        model: "Blog", schema: blogSchema, collection: "blogs" 
    },
    {
        model: "Category", schema: categorySchema, collection: "categories"
    },
    {
        model: "User", schema: userSchema, collection: "users"
    },
    {
        model: "Contact", schema: contactSchema, collection: "contacts"
    }
];

module.exports = schemas;