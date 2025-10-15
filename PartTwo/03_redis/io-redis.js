import Redis from 'ioredis';

const redis = new Redis();

const redisFunction = async () => {
  try {
    await redis.set('name', 'Zaryab');
    console.log(await redis.get('name'));
  } catch (error) {
    console.log('Redis Error', error);
  } finally {
    redis.quit();
  }
};
redisFunction();
