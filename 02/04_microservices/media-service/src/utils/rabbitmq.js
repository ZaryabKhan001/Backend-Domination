import amqplib from 'amqplib';
import { logger } from './logger.js';

let connection = null;
let channel = null;

let EXCHANGE_NAME = 'post_events';
let QUEUE_NAME = 'post_service_queue';

export const connectRabbitMQ = async () => {
  if (connection) return;
  connection = await amqplib.connect(process.env.RABBITMQ_URL);
  logger.info('Connected to RabbitMQ');

  channel = await connection.createChannel();
  logger.info('Channel Created');

  await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

  // reconnecting
  connection.on('close', () => {
    connection = null;
    channel = null;
    setTimeout(() => connectRabbitMQ(), 5000);
  });

  // error handling
  connection.on('error', (error) => {
    logger.error('Error Connecting to RabbitMQ', error);
  });

  // gracefully shutting down
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
      logger.info('Closing RabbitMQ connection...');
      try {
        await channel?.close();
        await connection?.close();
      } catch (error) {
        logger.error(
          'Error duting Disconnecting RabbitMQ Connection.',
          error?.message
        );
        process.exit(1);
      }
    });
  });
};

export const publishEvent = async (routingKey, message) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(`${routingKey}: Event published`);
};

export const consumeEvent = async (routingKey, callback) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  const queueName = `${QUEUE_NAME}_${routingKey}`;
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, EXCHANGE_NAME, routingKey);

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      await callback(content);
      channel.ack(msg); // remove msg from queue
    }
  });

  logger.info(`Subscribe To Event: ${routingKey}`);
};
