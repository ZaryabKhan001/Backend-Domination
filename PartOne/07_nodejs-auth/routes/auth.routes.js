import express from 'express';
import {
  handleRegisterUser,
  handleLoginUser,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', handleRegisterUser);
router.post('/login', handleLoginUser);

export default router;
