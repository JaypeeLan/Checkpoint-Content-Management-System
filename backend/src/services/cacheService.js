const { getRedisClient } = require('../config/redis');

async function getCache(key) {
  const redis = await getRedisClient();
  if (!redis) return null;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache(key, value, ttl = 300) {
  const redis = await getRedisClient();
  if (!redis) return;
  await redis.setEx(key, ttl, JSON.stringify(value));
}

module.exports = { getCache, setCache };
