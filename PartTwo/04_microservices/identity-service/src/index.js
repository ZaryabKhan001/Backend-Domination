import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { corsConfig } from './config/cors.config.js';
import { connectDb } from './database/connectDb.js';
import { redisClient } from './config/redis.config.js';
import helmet from 'helmet';

dotenv.config();

const app = express();
const port = process.env.PORT || process.env.BACKUP_PORT;

connectDb();

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});


//? Error Handler
app.use(globalErrorHandler());

app.listen(port, () => {
  logger.info(`App is listening on Port: ${port}`);
});
