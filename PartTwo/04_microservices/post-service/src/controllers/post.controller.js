import Post from '../models/post.model.js';
import { logger } from '../utils/logger.js';
import { validateCreatePost } from '../utils/validations.js';
import { redisClient } from '../config/redis.config.js';
import { invalidateCache } from '../utils/invalidateCache.js';
import { redisKeys } from '../utils/redisKeys.js';
import { publishEvent } from '../utils/rabbitmq.js';

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

    const keys = await redisClient.keys(`posts:*`);
    if (keys.length) {
      await invalidateCache(keys);
    }

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
      message: error?.message || 'Post Creation Failed!',
    });
  }
};

export const handleGetPostById = async (req, res) => {
  logger.info('Get Post by ID Endpoint hit');
  try {
    const postId = req.params.id;
    const key = redisKeys.GET_POST(postId);
    const cachedPost = await redisClient.get(key);

    if (cachedPost) {
      logger.info('Returned Cached Post!');
      return res.status(200).json({
        post: JSON.parse(cachedPost),
      });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        success: false,
        message: 'Post not found',
      });
    }

    await redisClient.setex(key, 3600, JSON.stringify(post));
    logger.info('Get Post Successfully!');
    return res.status(200).json({
      success: true,
      post: post,
    });
  } catch (error) {
    logger.error('Get Post by ID Failed!', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Get Post by ID Failed!',
    });
  }
};

export const handleGetAllPosts = async (req, res) => {
  logger.info('Getting all Posts Endpoint hit');
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const key = redisKeys.GET_ALL_POSTS(page, limit);

    const cachedPosts = await redisClient.get(key);

    if (cachedPosts) {
      logger.info('Returned all Cached Posts!');
      return res.status(200).json({
        posts: JSON.parse(cachedPosts),
      });
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    await redisClient.setex(key, 300, JSON.stringify(posts));

    logger.info('Get all Posts Successfully!');
    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      posts: posts,
    });
  } catch (error) {
    logger.error('Getting all Posts Failed!', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Getting all Posts Failed!',
    });
  }
};

export const handleDeletePost = async (req, res) => {
  logger.info('Post Deletion Endpoint hit');
  try {
    const postId = req.params.id;

    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      user: req.user.userId,
    });

    if (!deletedPost) {
      logger.warn(`Post with ID ${postId} not found`);
      return res.status(500).json({
        success: false,
        message: 'Post Deletion Failed! Post not found',
      });
    }

    logger.info('Post Deleted Successfully.');

    //? Delete media event publishing
    publishEvent('post.deleted', {
      postId: postId,
      userId: req.user.userId,
      mediaIds: deletedPost.mediaIds,
    });

    const postKey = redisKeys.GET_POST(postId);
    const postsKeys = await redisClient.keys('posts:*');

    await invalidateCache([postKey, ...postsKeys]);

    return res.status(200).json({
      success: true,
      message: 'Post Deleted Successfully.',
      post: deletedPost,
    });
  } catch (error) {
    logger.error('Post Deletion Failed!', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Post Deletion Failed!',
    });
  }
};
