import { logger } from '../utils/logger.js';

export const globalErrorHandler = async (err, req, res, next) => {
  logger.error(err.stack);

  res.status(err?.status || 500).json({
    success: err?.success || false,
    message: err?.message || 'Internal Server Error',
  });
};

// class ApiError extends Error {
//   constructor(
//     success = false,
//     statusCode = 500,
//     message = 'Something went wrong'
//   ) {
//     super(message);
//     this.name = 'ApiError';
//     this.success = success;
//     this.statusCode = statusCode;
//   }
// }

// export const asyncHandler = (fn) => async (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch((error) => next(error));
// };

// export const globalErrorHandler = async (err, req, res, next) => {
//   if (err.name === 'ApiError' || err instanceof ApiError) {
//     return res.status(500).json({
//       success: false,
//       message: err?.message || 'Something went wrong',
//     });
//   } else if (err.name === 'validationError') {
//     return res.status(400).json({
//       success: false,
//       message: err?.message || 'Something went wrong',
//     });
//   } else {
//     return res.status(500).json({
//       success: false,
//       message: 'Something went wrong',
//     });
//   }
// };

// export default ApiError;
