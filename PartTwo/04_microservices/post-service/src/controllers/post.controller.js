import Post from '../models/post.model.js';
import { logger } from '../utils/logger.js';
import { validateCreatePost } from '../utils/validations.js';

export const handleCreatePost = async (req, res) => {
  logger.info('Post Creation Endpoint hit');
  try {
    const { error } = validateCreatePost(req.body);

    if (error) {
      logger.warn(
        'Post Creation Failed! Validation Error',
        error.details[0].message
      );
      return res.status(400).json({
        success: false,
        message: error.details[0].message || 'Validation Error',
      });
    }

    const { content, mediaIds } = req.body;

    const newlyCreatedPost = await Post.create({
      user: req.user.userId,
      content: content,
      mediaIds: mediaIds || [],
    });

    logger.info('Post created successfully.');

    return res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      post: newlyCreatedPost,
    });
  } catch (error) {
    logger.error('Post Creation Failed!', error);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Post Creation Failed!',
    });
  }
};

export const handleGetPostById = async (req, res) => {
  logger.info('Get Post by ID Endpoint hit');
  try {
  } catch (error) {
    logger.error('Get Post by ID Failed!', error);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Get Post by ID Failed!',
    });
  }
};

export const handleGetAllPosts = async (req, res) => {
  logger.info('Getting all Posts Endpoint hit');
  try {
  } catch (error) {
    logger.error('Getting all Posts Failed!', error);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Getting all Posts Failed!',
    });
  }
};

export const handleDeletePost = async (req, res) => {
  logger.info('Post Deletion Endpoint hit');
  try {
  } catch (error) {
    logger.error('Post Deletion Failed!', error);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Post Deletion Failed!',
    });
  }
};
