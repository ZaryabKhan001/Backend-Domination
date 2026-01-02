import express from 'express';
import { handleCreatePost, handleGetAllPosts, handleGetPostById, handleDeletePost } from '../controllers/post.controller.js';
import { authenticateRequest } from '../middlewares/auth.middleware.js';
import { rateLimiter } from '../middlewares/rateLimitng.middleware.js';
const router = express.Router();

router.use(authenticateRequest);
router.post('/create', rateLimiter(1 * 60 * 1000, 50), handleCreatePost);
router.get('/all-posts', rateLimiter(1 * 60 * 1000, 100), handleGetAllPosts);
router.get('/:id', rateLimiter(1 * 60 * 1000, 100), handleGetPostById);
router.delete('/:id', rateLimiter(1 * 60 * 1000, 50), handleDeletePost);

export default router;
