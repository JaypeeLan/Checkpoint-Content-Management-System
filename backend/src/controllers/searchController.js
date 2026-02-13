const { query } = require('../config/database');
const { searchPosts } = require('../services/searchService');
const { increment } = require('../services/analyticsService');

async function search(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    let results = [];

    if (!q) {
      const recent = await query('SELECT post_id, title, content, status, created_at FROM posts ORDER BY created_at DESC LIMIT 100');
      results = recent.rows;
    } else {
      results = await searchPosts(q);

      // Fallback when Elasticsearch is disabled or has no indexed documents.
      if (!results.length) {
        const fallback = await query(
          `SELECT post_id, title, content, status, created_at
           FROM posts
           WHERE title ILIKE $1 OR content ILIKE $1
           ORDER BY created_at DESC
           LIMIT 100`,
          [`%${q}%`]
        );
        results = fallback.rows;
      }
    }

    increment('searchRequests');
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}

module.exports = { search };