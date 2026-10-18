/**
 * Generates a clean URL slug from a title string.
 */
const slugify = (title) => {
  return title
    .toString()                     // Convert to string (in case input is not)
    .toLowerCase()                  // Convert to lowercase
    .trim()                         // Remove extra spaces
    .replace(/[\s\W-]+/g, '-')      // Replace spaces & non-word chars with -
    .replace(/^-+|-+$/g, '');       // Remove leading/trailing dashes
};

/**
 * Safely decodes a URL component and trims whitespace.
 * @param {string} str
 * @returns {string}
 */
const safeDecodeUriComponent = (str) => {
  try {
    return decodeURIComponent(str || '').trim();
  } catch (error) {
    return (str || '').trim();
  }
};

/**
 * Creates a case-insensitive RegExp that matches both hyphenated/underscored slugs
 * (e.g. 'model-context-protocol') and spaced database records (e.g. 'Model Context Protocol').
 * Safely decodes URL-encoded parameters and escapes regex special characters.
 *
 * @param {string} rawTag
 * @returns {{ decodedTag: string, tagRegex: RegExp }}
 */
const createTagMatcher = (rawTag) => {
  const decodedTag = safeDecodeUriComponent(rawTag);
  // Escape regex special chars except hyphens/underscores/spaces
  const escapedTag = decodedTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = escapedTag.replace(/[-\s_]+/g, '[-\\s_]+');
  const tagRegex = new RegExp(`^${tagPattern}$`, 'i');

  return { decodedTag, tagRegex };
};

/**
 * Resolves the original display casing for a matched tag from an article list,
 * or falls back to a clean space-separated string.
 *
 * @param {Array} articles
 * @param {RegExp} tagRegex
 * @param {string} fallbackTag
 * @returns {string}
 */
const extractDisplayTag = (articles = [], tagRegex, fallbackTag = '') => {
  let displayTag = (fallbackTag || '').replace(/[-_]+/g, ' ');

  if (Array.isArray(articles) && articles.length > 0 && tagRegex) {
    for (const article of articles) {
      if (article.tags && Array.isArray(article.tags)) {
        const foundTag = article.tags.find(
          (t) => typeof t === 'string' && tagRegex.test(t.trim())
        );
        if (foundTag) {
          displayTag = foundTag.trim();
          break;
        }
      }
    }
  }

  return displayTag;
};

module.exports = {
  slugify,
  safeDecodeUriComponent,
  createTagMatcher,
  extractDisplayTag,
};
