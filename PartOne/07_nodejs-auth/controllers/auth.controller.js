import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const handleRegisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        messgae: 'User with same email or username already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const userSaved = await newUser.save();

    if (!userSaved) {
      return res.status(401).json({
        success: false,
        message: 'Unable to register user, please try again',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User Registered Successfully',
      data: {
        ...userSaved._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log('Error in User Registration', error);
    return res.status(500).json({
      success: false,
      message: 'Error in User Registration',
    });
  }
};

export const handleLoginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No User is found with this username or email',
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(401).json({
        success: false,
        message: 'Password Incorrect',
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Error in generating jwt token',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User LoggedIn Successfully',
      accessToken: accessToken,
    });
  } catch (error) {
    console.log('Error in User Login', error);
    return res.status(500).json({
      success: false,
      message: 'Error in User Login',
    });
  }
};

export const handleChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both old and new password are required',
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from old password',
      });
    }

    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Old Password is Incorrect',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    const newUser = await User.findByIdAndUpdate(
      user._id,
      { password: newHashedPassword },
      { new: true }
    );

    if (!newUser) {
      return res.status(503).json({
        success: false,
        message: 'Unable to update password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password Changed Successfully',
      data: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log('Password changed failed', error);
    return res.status(500).json({
      success: false,
      message: 'Password changed failed',
    });
  }
};
