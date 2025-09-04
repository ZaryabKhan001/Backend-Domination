import express from 'express';
import {
  handleRegisterUser,
  handleLoginUser,
  handleChangePassword,
} from '../controllers/auth.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', handleRegisterUser);
router.post('/login', handleLoginUser);
router.post('/change-password', checkAuth, handleChangePassword);

export default router;
