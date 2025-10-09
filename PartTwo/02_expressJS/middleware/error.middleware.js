class ApiError extends Error {
  constructor(statusCode = 500, message = 'Something went wrong') {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError'; // set the error type to api error
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const globalErrorHandler = async (err, req, res, next) => {
  console.log(err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  } else if (err.name === 'validationError') {
    return res.status(400).json({
      status: 'error',
      message: 'validation Error',
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occured',
    });
  }
};

export default ApiError;
