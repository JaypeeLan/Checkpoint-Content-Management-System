const { getElasticClient } = require('../config/elasticsearch');
const { env } = require('../config/env');

async function ensureIndex() {
  const client = getElasticClient();
  if (!client) return;

  const exists = await client.indices.exists({ index: env.ELASTICSEARCH_INDEX });
  if (!exists) {
    await client.indices.create({ index: env.ELASTICSEARCH_INDEX });
  }
}

async function indexPost(post) {
  const client = getElasticClient();
  if (!client) return;

  await client.index({
    index: env.ELASTICSEARCH_INDEX,
    id: String(post.post_id),
    document: post
  });
}

async function searchPosts(queryText) {
  const client = getElasticClient();
  if (!client) return [];

  const result = await client.search({
    index: env.ELASTICSEARCH_INDEX,
    query: {
      multi_match: {
        query: queryText,
        fields: ['title^3', 'content', 'excerpt']
      }
    }
  });

  return result.hits.hits.map((h) => h._source);
}

module.exports = { ensureIndex, indexPost, searchPosts };
