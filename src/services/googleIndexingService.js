const { GoogleAuth } = require('google-auth-library');
const logger = require('../utils/logger');

// Google Indexing API configuration
const INDEXING_API_ENDPOINT =
  'https://indexing.googleapis.com/v3/urlNotifications:publish';

const INDEXING_API_SCOPE =
  'https://www.googleapis.com/auth/indexing';

/**
 * Get authenticated Google client for Indexing API
 *
 * @returns {Promise<Object>} Authenticated HTTP client
 */
const getAuthenticatedClient = async () => {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error(
        'GOOGLE_SERVICE_ACCOUNT_KEY environment variable is missing'
      );
    }

    const credentials = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    );

    const auth = new GoogleAuth({
      credentials,
      scopes: [INDEXING_API_SCOPE],
    });

    const client = await auth.getClient();

    return client;
  } catch (error) {
    logger.error(
      'Error creating Google auth client:',
      error
    );

    throw new Error(
      `Failed to authenticate with Google Indexing API: ${error.message}`
    );
  }
};

/**
 * Send URL notification to Google Indexing API
 *
 * @param {string} url - The URL to index
 * @param {'URL_UPDATED'|'URL_DELETED'} type
 * @returns {Promise<Object>} API response
 */
const indexUrl = async (
  url,
  type = 'URL_UPDATED'
) => {
  try {
    if (!url) {
      throw new Error('URL is required');
    }

    if (
      !['URL_UPDATED', 'URL_DELETED'].includes(type)
    ) {
      throw new Error(
        'Invalid type. Use URL_UPDATED or URL_DELETED'
      );
    }

    const client = await getAuthenticatedClient();

    const requestBody = {
      url,
      type,
    };

    const response = await client.request({
      url: INDEXING_API_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    });

    logger.info(
      `Google Indexing API called successfully for ${type}: ${url}`
    );

    console.log(
      'Google Indexing response:',
      response.data
    );

    return response.data;
  } catch (error) {
    logger.error(
      `Error calling Google Indexing API for ${url}:`,
      error
    );

    throw new Error(
      `Failed to index URL: ${
        error.response?.data?.error?.message ||
        error.message
      }`
    );
  }
};

module.exports = {
  indexUrl,
};