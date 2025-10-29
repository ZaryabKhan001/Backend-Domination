import { logger } from '../utils/logger.js';
import PostSearch from '../models/postSearch.model.js';

export const handleCreatePost = async (event) => {
  logger.info('Post Creation for Search Started.');
  try {
    const { postId, content, userId } = event;

    await PostSearch.create({
      postId,
      content,
      userId,
      createdAt: Date.now(),
    });
    logger.info('Post Created Successfully for Search');
  } catch (error) {
    logger.error('Post Creation for Search Failed!', error);
  }
};

export const handleDeletePost = async (event) => {
  logger.info('Post Deletion from Search Started');
  try {
    const { postId } = event;
    await PostSearch.findOneAndDelete({ postId: postId });
    logger.info('Post Deleted Successfully from Search');
  } catch (error) {
    logger.error('Post Deletion from Search Failed!', error);
  }
};
