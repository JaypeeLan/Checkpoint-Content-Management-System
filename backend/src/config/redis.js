const { createClient } = require('redis');
const { env } = require('./env');

let client = null;

async function getRedisClient() {
  if (!env.REDIS_ENABLED) return null;
  if (client) return client;

  client = createClient({ url: env.REDIS_URL });
  client.on('error', (err) => {
    console.error('Redis error:', err.message);
  });
  await client.connect();
  return client;
}

module.exports = { getRedisClient };
