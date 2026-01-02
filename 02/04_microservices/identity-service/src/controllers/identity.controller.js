import { logger } from '../utils/logger.js';
import { validateRegistration, validateLogin } from '../utils/validation.js';
import { generateTokens } from '../utils/generateTokens.js';
import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';

//? Registration

export const handleRegistration = async (req, res) => {
  logger.info('User Registration Endpoint hit');
  try {
    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn(
        'User Registration Failed! Validation Error: ' +
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

export const handleLogin = async (req, res) => {
  logger.info('User Login Endpoint hit');

  try {
    const { error } = validateLogin(req.body);
    if (error) {
      logger.warn(
        'User Login Failed! Validation Error: ' +
        error.details[0].message
      );
      return res.status(500).json({
        success: false,
        message:
          error.details[0].message || 'User Login Failed! Validation Error',
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('User Login Failed! User not found');
      return res.status(404).json({
        success: false,
        message: 'User Login Failed! User not found',
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      logger.warn('User Login Failed! Invalid credentials');
      return res.status(401).json({
        success: false,
        message: 'User Login Failed! Invalid credentials',
      });
    }
    const { accessToken, refreshToken } = await generateTokens(user);

    logger.info('User Login Successfull', {
      userId: user._id,
      email: user.email,
    });

    logger.info('Tokens generated for user', { userId: user._id });

    return res.status(200).json({
      success: true,
      message: 'User Login Successfull',
      userId: user._id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    logger.error('User Login Failed! Something went wrong', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'User Login Failed! Something went wrong',
    });
  }
};

//? Refresh Token

export const handleRefreshToken = async (req, res) => {
  logger.info('Refresh Token Endpoint hit');
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn('Generating Refresh Token Failed! Refresh token is missing');
      return res.status(400).json({
        success: false,
        message: 'Generating Refresh Token Failed! Refresh token is missing',
      });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn(
        'Generating Refresh Token Failed! Refresh token is invalid or expired'
      );
      return res.status(404).json({
        success: false,
        message:
          'Generating Refresh Token Failed! Refresh token is invalid or expired',
      });
    }

    const user = await User.findOne({ _id: storedToken.user });

    if (!user) {
      logger.warn('Generating Refresh Token Failed! User not found');
      return res.status(404).json({
        success: false,
        message: 'Generating Refresh Token Failed! User not found',
      });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);

    logger.info('New Refresh Token generated successfully');
    return res.status(201).json({
      success: true,
      message: 'New Refresh Token generated successfully',
      userId: user._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error(
      'Generating Refresh Token Failed! Something went wrong.',
      error
    );
    return res.status(500).json({
      success: false,
      message: 'Generating Refresh Token Failed! Something went wrong.',
    });
  }
};

//? Logout

export const handleLogout = async (req, res) => {
  logger.info('User Logout Endpoint hit');
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn('User Logout Failed! Refresh token is missing');
      return res.status(400).json({
        success: false,
        message: 'User Logout Failed! Refresh token is missing',
      });
    }

    const storedToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });

    if (!storedToken) {
      return res.status(404).json({
        success: false,
        message: 'User Logout Failed! Refresh Token is invalid',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User Logout Sucessfull.',
    });
  } catch (error) {
    logger.error('User Logout Failed! Something went wrong.', error);
    return res.status(500).json({
      success: false,
      message: 'User Logout Failed! Something went wrong.',
    });
  }
};
