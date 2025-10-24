import { redisClient } from '../config/redis.config.js';
import { logger } from './logger.js';

export const invalidateCache = async (keys) => {
  try {
    const keysArray = Array.isArray(keys) ? keys : [keys];

    const validKeys = keysArray.filter((key) => key && typeof key === 'string');

    if (!validKeys.length) {
      logger.warn(
        'Cached Keys Expiration Failed! keys are missing or not correct.'
      );
      return false;
    }

    const existingKeys = [];
    for (const key of validKeys) {
      const exists = await redisClient.exists(key);
      if (exists) existingKeys.push(key);
    }

    if (!existingKeys.length) {
      logger.warn(`Cached Keys Expiration Failed! Invalid Keys.`);
      return false;
    }

    const deletedKeys = await redisClient.del(existingKeys);

    logger.info('Cached Key Expiration Successfull!');
    return deletedKeys === existingKeys.length;
  } catch (error) {
    logger.warn('Cached Keys Expiration Failed!');
    return false;
  }
};
