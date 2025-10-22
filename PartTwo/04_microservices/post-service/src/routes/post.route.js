import express from 'express';
import { handleCreatePost } from '../controllers/post.controller.js';
import { authenticateRequest } from '../middlewares/auth.middleware.js';
import { rateLimiter } from '../middlewares/rateLimitng.middleware.js';
const router = express.Router();

router.use(authenticateRequest);
router.post('/create', rateLimiter(1 * 60 * 1000, 10), handleCreatePost);

export default router;
