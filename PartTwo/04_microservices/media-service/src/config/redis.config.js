import Redis from 'redis';

export const redisClient = new Redis(process.env.REDIS_URL);
