import express from 'express';
import { handleRegistration } from '../controllers/identity.controller.js';

const router = express.Router();

router.post('/register', handleRegistration);

export default router;
