import { checkAuth, checkIsAdmin } from '../middlewares/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/', checkAuth, checkIsAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to Admin Page'
  })
});

export default router;
