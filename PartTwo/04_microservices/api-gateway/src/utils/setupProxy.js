import proxy from 'express-http-proxy';
import { logger } from './logger.js';
import {shouldParseJson} from "./checkParsing.js"

export const setupProxy = (
  app,
  route,
  target,
  serviceName,
  middlewares = [],
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
      if (shouldParseJson(srcReq)) {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
      }
      return proxyReqOpts;
    },

    proxyReqBodyDecorator: (bodyContent, srcReq) => {
      if (shouldParseJson(srcReq)) {
        return JSON.stringify(srcReq.body || {});
      }
      return bodyContent;
    },

    userResDecorator: (proxyRes, proxyResData) => {
      logger.info(
        `Response received from ${serviceName}. Response: ${proxyRes.statusCode}`
      );
      return proxyResData;
    },
    parseBody: false,
  };

  app.use(route, ...middlewares, proxy(target, proxyOptions));
  logger.info(`Proxy mounted for ${serviceName} => ${route} => ${target}`);
};
