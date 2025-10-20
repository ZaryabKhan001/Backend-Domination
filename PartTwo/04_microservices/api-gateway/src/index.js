import express from 'express';
import { logger } from './utils/logger.js';
import { corsConfig } from './config/cors.config.js';
import helmet from 'helmet';
import { globalErrorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rateLimiting.middleware.js';

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});

//? Rate limiting
app.use(rateLimiter(100, 15 * 60 * 100));

//? Error Handler
app.use(globalErrorHandler);

app.listen(port, () => {
  logger.info(`Api gateway is running on Port: ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection on', promise, 'with reason:', reason);
  process.exit(1);
});
