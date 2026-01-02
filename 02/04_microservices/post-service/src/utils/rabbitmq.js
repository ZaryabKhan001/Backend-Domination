import amqplib from 'amqplib';
import { logger } from './logger.js';

let connection = null;
let channel = null;

const EXCHANGE_NAME = 'post_events';

export const connectRabbitMQ = async () => {
  if (channel) return channel;
  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    logger.info('Connected to RabbitMQ');

    channel = await connection.createChannel();
    logger.info('Channel Created');

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

    // reconnecting on closing
    connection.on('close', () => {
      logger.warn('RabbitMQ Connection Closed');
      connection = null;
      channel = null;
      setTimeout(connectRabbitMQ, 5000);
    });

    // error handling
    connection.on('error', (err) => {
      logger.warn('Error Connecting to RabbitMQ', err?.message);
    });

    // Gracefully shutting down
    // SIGINT => ctrc+c
    // SIGTERM => closed by docker
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.on(signal, async () => {
        try {
          logger.info('Closing RabbitMQ connection...');
          await channel?.close();
          await connection?.close();
          process.exit(0);
        } catch (error) {
          logger.error(
            'Error during Disconnecting RabbitMQ Connection.',
            error?.message
          );
          process.exit(1);
        }
      });
    });

    return channel;
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ');
  }
};

export const publishEvent = async (routingKey, message) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message)),
     { persistent: true }
  );
  logger.info(`${routingKey}: Event published`);
};
