import proxy from 'express-http-proxy';
import { logger } from './logger.js';

export const setupProxy = (
  app,
  route,
  target,
  serviceName,
  middlewares = [],
  parseReqBody = true
) => {
  const proxyOptions = {
    proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1/, '/api'),

    proxyErrorHandler: (err, res) => {
      logger.error(`[${serviceName}] Proxy Error: ${err.message}`);
      res.status(500).json({
        success: false,
        message: `Internal Server Error, Error: ${err.message}`,
      });
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
      }
      if (!srcReq.headers['content-type']?.startsWith('multipart/form-data')) {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
      }
      return proxyReqOpts;
    },

    userResDecorator: (proxyRes, proxyResData) => {
      logger.info(
        `Response received from ${serviceName}. Response: ${proxyRes.statusCode}`
      );
      return proxyResData;
    },
    parseReqBody,
  };

  app.use(route, ...middlewares, proxy(target, proxyOptions));
  logger.info(`Proxy mounted for ${serviceName} => ${route} => ${target}`);
};
