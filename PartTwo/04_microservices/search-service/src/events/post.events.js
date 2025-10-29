import { logger } from '../utils/logger.js';
import PostSearch from '../models/postSearch.model.js';

export const handleCreatePost = async (event) => {
  logger.info('Create post for Search  started');
  try {
    const { postId, content, userId } = event;

    await PostSearch.create({
      postId,
      content,
      userId,
      createdAt: Date.now(),
    });
  } catch (error) {
    logger.error('Post Creation for Search Failed!', error);
  }
};

export const handleDeletePost = async (event) => {
  logger.info('Delete post from Search started');
  try {
    const { postId } = event;
    await PostSearch.findOneAndDelete({ postId: postId });
  } catch (error) {
    logger.error('Post Deletion from Search Failed!', error);
  }
};
