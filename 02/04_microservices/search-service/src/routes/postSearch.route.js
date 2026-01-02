import express from 'express';
import { validateRequest } from '../middlewares/auth.middleware.js';
import { handleSearchPost } from '../controllers/postSearch.controller.js';

const router = express.Router();

router.use(validateRequest);

router.get('/posts', handleSearchPost);

export default router;
