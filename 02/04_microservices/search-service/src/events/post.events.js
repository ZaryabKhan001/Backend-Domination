import { logger } from '../utils/logger.js';
// import PostSearch from '../models/postSearch.model.js';
import * as esUtils from '../utils/es.utils.js';

//? mongodb
// export const handleCreatePost = async (event) => {
//   logger.info('Post Creation for Search Started.');
//   try {
//     const { postId, content, userId } = event;

//     await PostSearch.create({
//       postId,
//       content,
//       userId,
//       createdAt: Date.now(),
//     });
//     logger.info('Post Created Successfully for Search');
//   } catch (error) {
//     logger.error('Post Creation for Search Failed!', error);
//   }
// };

// export const handleDeletePost = async (event) => {
//   logger.info('Post Deletion from Search Started');
//   try {
//     const { postId } = event;
//     await PostSearch.findOneAndDelete({ postId: postId });
//     logger.info('Post Deleted Successfully from Search');
//   } catch (error) {
//     logger.error('Post Deletion from Search Failed!', error);
//   }
// };

//? elastic search
export const handleCreatePost = async (event) => {
  logger.info('Post Creation for Search Started.');
  try {
    const { postId, content, userId } = event;

    const result = await esUtils.addDocument(
      'posts',
      {
        postId: postId,
        userId: userId,
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      postId
    );
    if (!result) {
      throw new Error('Error in Post Creation for Search.');
    }
    logger.info('Post Created Successfully for Search');
  } catch (error) {
    logger.error('Post Creation for Search Failed!', error);
  }
};

export const handleDeletePost = async (event) => {
  logger.info('Post Deletion from Search Started');
  try {
    const { postId } = event;

    const result = await esUtils.deleteDocument('posts', postId);

    if (!result) {
      throw new Error('Error in Post Deletion from Search.');
    }

    logger.info('Post Deleted Successfully from Search');
  } catch (error) {
    logger.error('Post Deletion from Search Failed!', error);
  }
};
