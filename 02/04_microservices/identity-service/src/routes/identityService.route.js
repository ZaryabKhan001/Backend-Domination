import express from 'express';
import {
  handleRegistration,
  handleLogin,
  handleRefreshToken,
  handleLogout,
} from '../controllers/identity.controller.js';

const router = express.Router();

router.post('/register', handleRegistration);
router.post('/login', handleLogin);
router.post('/refreshToken', handleRefreshToken);
router.post('/logout', handleLogout);

export default router;
