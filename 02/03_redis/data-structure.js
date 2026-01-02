import redis from 'redis';

const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

// event listener
client.on('error', (error) =>
  console.log('Redis Client Error Occurred', error)
);

const redisDataStructures = async () => {
  try {
    client.connect();

    //? String
    // await client.set('user:name', 'Zaryab Zubair');
    // const name = await client.get('user:name');
    // console.log(name);
    // await client.mSet(['user:name', 'Zaryab Zubair', 'user:age', '23']);

    // const [name, age] = await client.mGet(['user:name', 'user:age']);
    // console.log(name, age);

    //? List
    // await client.lPush('notes', ['note 1', 'note 2', 'note 3']);
    // const notes = await client.lRange('notes', 0, -1);

    // console.log(notes);
    // console.log(await client.RPUSH('notes', ['01', '02']));
    // console.log(await client.RPOP('notes'));
    // const notes = await client.lRange('notes', 0, -1);
    // console.log(notes);

    //? Set
    // await client.SADD('user:nickname', ['john', 'varun']);
    // console.log(await client.sMembers('user:nickname'));

    // const isJohnANickname = await client.sIsMember('user:nickname', 'john'); // 1 for present and 0 for absent
    // console.log(isJohnANickname);

    // await client.sRem('user:nickname', 'varun');
    // console.log(await client.sMembers('user:nickname'));

    //? Sorted Set
    // await client.zAdd('cart', [
    //   {
    //     score: 100,
    //     value: 'Cart 01',
    //   },
    //   {
    //     score: 150,
    //     value: 'Cart 02',
    //   },
    //   {
    //     score: 10,
    //     value: 'Cart 03',
    //   },
    // ]);

    // console.log(await client.zRange('cart', 0, -1));

    // console.log(await client.zRangeWithScores('cart', 0, -1));

    // console.log(await client.zRank('cart', 'Cart 02'));
    //? Hash
    // await client.hSet('product:1', {
    //   name: 'Product 01',
    //   description: 'Produt 01 description',
    //   rating: '5',
    // });

    // console.log(await client.hGet('product:1', 'rating'));

  } catch (error) {
    console.log(error);
  } finally {
    client.quit();
  }
};

redisDataStructures();
