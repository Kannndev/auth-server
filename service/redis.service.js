const Redis = require('ioredis');

const redis = new Redis(`${process.env.REDIS_URL}`);

redis.on('error', (err) => {
  console.log(`Redis error: ${err}`);
});

redis.on('connect', (err) => {
  console.log('Connected to Redis');
});

module.exports = redis;
