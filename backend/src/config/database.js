const { Pool } = require('pg');
const { env } = require('./env');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DB_SSL
    ? {
        rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED
      }
    : false,
  max: 10
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
