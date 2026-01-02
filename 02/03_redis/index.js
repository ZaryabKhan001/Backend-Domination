import redis from 'redis';

const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

// event listener
client.on('error', (error) =>
  console.log('Redis Client Error Occurred', error)
);

// check connection
const checkRedisConnection = async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');
    await client.set('name', 'zaryab');
    let name = await client.get('name');
    console.log(name);
    const countDelete = await client.del('name');
    console.log(countDelete);

    name = await client.get('name');
    console.log(name);

    await client.set('count', 1000);
    let count;
    count = await client.get('count');
    console.log(count);

    // increment
    await client.incr('count');
    count = await client.get('count');
    console.log(count);
    // decrement
    await client.decr('count');
    count = await client.get('count');
    console.log(count);
  } catch (error) {
    console.log('checking redis connection failed', error);
  } finally {
    client.quit(); // avoid living open connections
  }
};
checkRedisConnection();
