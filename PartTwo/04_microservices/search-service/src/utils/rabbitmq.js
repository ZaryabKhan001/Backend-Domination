import amqplib from 'amqplib';
import { logger } from './logger.js';

let connection = null;
let channel = null;

let EXCHANGE_NAME = 'post_events';

export const connectRabbitMQ = async () => {
  if (channel) return channel;

  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    logger.info('Connected to RabbitMQ');

    channel = await connection.createChannel();
    logger.info('Channel created');

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

    // reconnecting on disconnecting
    connection.on('close', () => {
      logger.warn('RabbitMQ Connection closed');
      connection = null;
      channel = null;
      setTimeout(connectRabbitMQ, 5000);
    });

    // error handling
    connection.on('error', (error) => {
      logger.error('Error Connecting to RabbitMQ', error?.message);
    });

    ['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.on(signal, async () => {
        try {
          logger.info('Closing RabbitMQ connection...');
          await connection?.close();
          await channel?.close();
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
    logger.error('Failed to connect to RabbitMQ', error);
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
};

export const consumeEvent = async (queueName, routingKey, callback) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, EXCHANGE_NAME, routingKey);

  await channel.prefetch(50); // 50 requests at a time

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      await callback(content);
      channel.ack(msg); // remove msg from queue
    }
  });

  logger.info(`Queue "${queueName}" subscribed to "${routingKey}"`);
};
