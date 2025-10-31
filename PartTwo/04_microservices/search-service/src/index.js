import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { corsConfig } from './config/cors.config.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import postSearchRouter from './routes/postSearch.route.js';
import { dbConnect } from './database/dbConnect.js';
import { connectRabbitMQ, consumeEvent } from './utils/rabbitmq.js';
import { handleCreatePost, handleDeletePost } from './events/post.events.js';
import { es } from './config/es.config.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

dbConnect();

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req?.method} request for ${req?.url}`);
  next();
});

app.use('/api/search', postSearchRouter);

//? Error Handling
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectRabbitMQ();

    await consumeEvent(
      'post_search_created_queue',
      'post.created',
      handleCreatePost
    );
    await consumeEvent(
      'post_search_deleted_queue',
      'post.deleted',
      handleDeletePost
    );

    app.listen(port, () => {
      logger.info(`Search service is running on Port:${port}`);
    });
  } catch (error) {
    logger.error('Failed to start Search Service');
    process.exit(1);
  }
};
startServer();

const checkConnection = async () => {
  try {
    const health = await es.cluster.health();
    console.log('Elasticsearch cluster is up:', health);
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error);
  }
};
checkConnection();

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `Unhandled Rejection at: ${promise}, reason: ${
      reason instanceof Error ? reason.stack : JSON.stringify(reason)
    }`
  );
  process.exit(1);
});
