import express from 'express';
import { validateRequest } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(validateRequest);

export default router;
