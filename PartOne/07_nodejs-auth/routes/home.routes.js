import express from 'express';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', checkAuth, (req, res) => {
  const user = req.user;
  return res.status(200).json({
    success: true,
    message: 'Welcome to Home Page',
    user: user,
  });
});

export default router;
