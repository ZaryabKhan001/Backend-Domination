import { logger } from '../utils/logger.js';
import PostSearch from '../models/postSearch.model.js';

export const handleSearchPost = async (req, res) => {
  logger.info('Search post Endpoint hit...');
  try {
    const { query } = req.query;

    const results = await PostSearch.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: 'textScore' },
      }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: 'Search Results fetched successfully',
      results: results,
    });
  } catch (error) {
    logger.error('Search post Failed', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Search post Failed!',
    });
  }
};
