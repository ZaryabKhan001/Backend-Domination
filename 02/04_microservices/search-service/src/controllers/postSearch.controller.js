import { logger } from '../utils/logger.js';
import { searchPost } from '../utils/es.utils.js';
// import PostSearch from '../models/postSearch.model.js';

//? mongodb search
// export const handleSearchPost = async (req, res) => {
//   logger.info('Post Search Endpoint hit...');
//   try {
//     const { query } = req.query;

//     const results = await PostSearch.find(
//       {
//         $text: { $search: query },
//       },
//       {
//         score: { $meta: 'textScore' },
//       }
//     )
//       .sort({ score: { $meta: 'textScore' } })
//       .limit(10);

//     logger.info('Post Searched Successfully');

//     return res.status(200).json({
//       success: true,
//       message: 'Search Results fetched successfully',
//       results: results,
//     });
//   } catch (error) {
//     logger.error('Post Searched Failed', error);
//     return res.status(500).json({
//       success: false,
//       message: error?.message || 'Search post Failed!',
//     });
//   }
// };

//? elastic search
export const handleSearchPost = async (req, res) => {
  logger.info('Post Search Endpoint hit...');
  try {
    const { query, page = 1, limit = 5 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      });
    }

    const from = (page - 1) * limit;

    const esQuery = {
      bool: {
        should: [
          { match_phrase: { content: { query, boost: 2 } } },
          { match: { content: { query, fuzziness: 'AUTO' } } },
        ],
        minimum_should_match: 1,
      },
    };

    const options = {
      from: from,
      size: Number(limit),
      sort: [{ createdAt: 'desc' }],
    };

    const { total, hits } = await searchPost('posts', esQuery, options);

    logger.info('Post Searched Successfully');

    return res.status(200).json({
      success: true,
      message: 'Search Results fetched successfully',
      totalMatches: total,
      posts: hits,
    });
  } catch (error) {
    logger.error('Post Searched Failed', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Search post Failed!',
    });
  }
};
