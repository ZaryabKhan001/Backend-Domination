import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { logger } from './logger.js';
import RefreshToken from '../models/refreshToken.model.js';

export const generateTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // refresh token expires after 1 day

    await RefreshToken.findOneAndUpdate(
      { user: user._id },
      { token: refreshToken, expiresAt },
      { upsert: true, new: true }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error('Token generation Failed', { error });
    throw new Error(error);
  }
};
