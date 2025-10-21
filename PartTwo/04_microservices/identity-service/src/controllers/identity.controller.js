import { logger } from '../utils/logger.js';
import { validateRegistration } from '../utils/validation.js';
import { generateTokens } from '../utils/generateTokens.js';
import User from '../models/user.model.js';

//? Registration

export const handleRegistration = async (req, res) => {
  logger.info('User Registration Endpoint hit');
  try {
    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn(
        'User Registration Failed! Validation Error',
        error.details[0].message
      );
      return res.status(400).json({
        success: false,
        message: error.details[0].message || 'Validation Error',
      });
    }

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (isUserAlreadyExists) {
      logger.warn('User Registration Failed! User already exists');
      return res.status(400).json({
        success: false,
        message: 'User Registration Failed! User already exists',
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    logger.info('User Registration Successfull', {
      userId: user._id,
      email: user.email,
    });

    // generate token
    const { accessToken, refreshToken } = await generateTokens(user);

    logger.info('Tokens generated for user', { userId: user._id });

    return res.status(201).json({
      success: true,
      message: 'User Registration Successfull',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    logger.error('User Registration Failed! Something went wrong', error);
    return res.status(500).json({
      success: false,
      message:
        error?.message || 'User Registration Failed! Something went wrong',
    });
  }
};

//? Login

export const handleLogin = async (req, res) => {};

//? Refresh Token

export const handleRefreshToken = async (req, res) => {};

//? Logout

export const handleLogout = async (req, res) => {};
