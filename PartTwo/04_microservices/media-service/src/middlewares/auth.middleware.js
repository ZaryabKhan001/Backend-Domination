export const v = (req, res, next) => {
  const userId = req.headers.get['x-user-id'];
  if (!userId) {
    logger.warn('Attempting Without Authentication');
    return res.status(400).json({
      success: false,
      message: 'Authentication Required, Please login to continue',
    });
  }

  req.user = { userId };
  next();
};
