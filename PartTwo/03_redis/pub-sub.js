import redis from 'redis';

const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

client.on('error', (error) => {
  console.log('Redis Connection Error');
});

const testAdditionalFeatures = async () => {
  try {
    await client.connect();

    //? consume message
    // const subscriber = client.duplicate();
    // await subscriber.connect();
    // subscriber.subscribe('dummyMessage', (message, channel) => {
    //   console.log(`New message:`);
    //   console.log(`${message} from ${channel}`);
    // });

    //? publish message
    // await client.publish('dummyMessage', 'message 01');
    // await client.publish('dummyMessage', 'message 02');

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // await subscriber.unsubscribe('dummyMessage');
    // await subscriber.quit();

    //? Pipeline
    // const multi = client.multi();

    // multi.set('command1', 'command1 executed');
    // multi.set('command2', 'command2 executed');

    // multi.get('command1');
    // multi.get('command2');

    // const result = await multi.exec();
    // console.log(result);

    //? Transaction
    // const multi = client.multi();

    // multi.set('transaction1', 'transaction1 executed');
    // multi.set('transaction2', 'transaction2 executed');

    // multi.get('transaction1');
    // multi.get('transaction2');

    // const result = await multi.exec();
    // console.log(result);

    //? without Pipelining
    // console.time('without pipelining');
    // for (let i = 0; i < 1000; i = i + 1) {
    //   await client.set(`user:${i}:rollno`, `${i}`);
    // }
    // console.timeEnd('without pipelining');
    //? with Pipelining
    // console.time('with pipelining');
    // const multi = client.multi();
    // for (let i = 0; i < 1000; i = i + 1) {
    //   multi.set(`user:${i}:rollno`, `${i}`);
    // }
    // console.timeEnd('with pipelining');
  } catch (error) {
    console.log('Redis Connection Error', error);
  } finally {
    await client.quit();
  }
};
testAdditionalFeatures();
