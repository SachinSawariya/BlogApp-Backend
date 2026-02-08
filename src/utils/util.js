const slugify = (title) => {
  return title
    .toString()                     // Convert to string (in case input is not)
    .toLowerCase()                  // Convert to lowercase
    .trim()                         // Remove extra spaces
    .replace(/[\s\W-]+/g, '-')      // Replace spaces & non-word chars with -
    .replace(/^-+|-+$/g, '');       // Remove leading/trailing dashes
}

module.exports = {
    slugify
}
