import jwt from 'jsonwebtoken';

export const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(400).json({
        success: false,
        message: 'AccessToken is required',
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Authorization header format. Use Bearer <token>',
      });
    }

    const token = parts[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Access denied, No Token Provided. Please Login',
      });
    }

    let decodedInfo;
    try {
      decodedInfo = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message:
          err.name === 'TokenExpiredError'
            ? 'Token has expired'
            : 'Invalid token',
      });
    }

    req.user = decodedInfo;
    next();
  } catch (error) {
    console.error('Error in Auth middleware:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication Failed',
    });
  }
};

export const checkIsAdmin = async (req, res, next) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.status(400).json({
      success: 'false',
      message: 'Access Denied. Admin rights required',
    });
  }
  next();
};
