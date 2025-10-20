import express from 'express';
import { logger } from './utils/logger.js';
import { corsConfig } from './config/cors.config.js';
import helmet from 'helmet';
import { globalErrorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rateLimiting.middleware.js';
import proxy from 'express-http-proxy';
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
  logger.info(`Request body ${req.body}`);
  next();
});

//? Proxy
const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, '/api');
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy Error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: `Internal Server Error, Error: ${err.message}`,
    });
  },
};

//? Setting up proxy for identity service
app.use(
  '/v1/auth',
  proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from Identity service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);

//? Error Handler
app.use(globalErrorHandler);

app.listen(port, () => {
  logger.info(`Api gateway is running on Port: ${port}`);
  logger.info(
    `Identity Service is running on Port: ${process.env.IDENTITY_SERVICE_URL}`
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
