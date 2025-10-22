import proxy from 'express-http-proxy';
import { logger } from './logger.js';

export const setupProxy = (
  app,
  route,
  target,
  serviceName,
  middlewares = []
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
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      if (srcReq.user) {
        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
      }
      return proxyReqOpts;
    },

    userResDecorator: (proxyRes, proxyResData) => {
      logger.info(
        `Response received from ${serviceName}. Response: ${proxyRes.statusCode}`
      );
      return proxyResData;
    },
  };

  app.use(route, ...middlewares, proxy(target, proxyOptions));
  logger.info(`Proxy mounted for ${serviceName} => ${route} => ${target}`);
};
