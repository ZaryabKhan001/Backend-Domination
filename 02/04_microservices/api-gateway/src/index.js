import express from 'express';
import { logger } from './utils/logger.js';
import { corsConfig } from './config/cors.config.js';
import helmet from 'helmet';
import { globalErrorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rateLimiting.middleware.js';
import { verifyToken, validateToken } from './middleware/auth.middleware.js';
import { setupProxy } from './utils/setupProxy.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

//? Rate limiting
app.use(rateLimiter(100, 15 * 60 * 100));

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  req.body && logger.info(`Request body ${req.body}`);
  next();
});

//? Setting up proxy for identity service
setupProxy(
  app,
  '/v1/auth',
  process.env.IDENTITY_SERVICE_URL,
  'identity-service'
);

//? Setting up proxy for post service
setupProxy(app, '/v1/post', process.env.POST_SERVICE_URL, 'post-service', [
  validateToken,
  verifyToken,
]);

//? Setting up proxy for media service
setupProxy(
  app,
  '/v1/media',
  process.env.MEDIA_SERVICE_URL,
  'media-service',
  [validateToken, verifyToken],
);

//? Setting up proxy for search service
setupProxy(
  app,
  '/v1/search',
  process.env.SEARCH_SERVICE_URL,
  'search-service',
  [validateToken, verifyToken],
);

//? Error Handler
app.use(globalErrorHandler);

app.listen(port, () => {
  logger.info(`Api gateway is running on Port: ${port}`);
  logger.info(
    `Identity Service is running on Port: ${process.env.IDENTITY_SERVICE_URL}`
  );
  logger.info(
    `Post Service is running on Port: ${process.env.POST_SERVICE_URL}`
  );
  logger.info(
    `Media Service is running on Port: ${process.env.MEDIA_SERVICE_URL}`
  );
  logger.info(
    `Search Service is running on Port: ${process.env.SEARCH_SERVICE_URL}`
  );
  logger.info(`Redis Url: ${process.env.REDIS_URL}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `Unhandled Rejection at: ${promise}, reason: ${
      reason instanceof Error ? reason.stack : JSON.stringify(reason)
    }`
  );
  process.exit(1);
});
