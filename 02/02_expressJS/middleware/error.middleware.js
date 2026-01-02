class ApiError extends Error {
  constructor(
    statusCode = 500,
    success = false,
    message = 'Something went wrong'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    this.name = 'ApiError';
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const globalErrorHandler = async (err, req, res, next) => {
  console.log(err.stack);

  if (err.name === 'validationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
    });
  }

  if (err instanceof ApiError) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};

export default ApiError;
