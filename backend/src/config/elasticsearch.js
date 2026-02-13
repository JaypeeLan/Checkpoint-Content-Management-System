const { Client } = require('@elastic/elasticsearch');
const { env } = require('./env');

let client = null;

function getElasticClient() {
  if (!env.ELASTICSEARCH_ENABLED || !env.ELASTICSEARCH_NODE) return null;
  if (client) return client;

  client = new Client({
    node: env.ELASTICSEARCH_NODE,
    auth: env.ELASTICSEARCH_API_KEY ? { apiKey: env.ELASTICSEARCH_API_KEY } : undefined
  });

  return client;
}

module.exports = { getElasticClient };
