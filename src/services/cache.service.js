const redis = require("redis");

const cacheInstance = redis.createClient({
  url: process.env.REDIS_URL,
});

const connectCacheService = async () => {
  try {
    let res = await cacheInstance.connect();

    if (res) {
      console.log("Redis connected Successfully");
    }
  } catch (error) {
    console.log("error in cacheService", error);
  }
};

module.exports = {
  connectCacheService,
  cacheInstance,
};
