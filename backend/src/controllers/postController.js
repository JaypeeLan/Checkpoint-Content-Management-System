const { query } = require('../config/database');
const { setCache } = require('../services/cacheService');
const { indexPost } = require('../services/searchService');
const { emitEvent } = require('../services/websocketService');

async function listPosts(req, res, next) {
  try {
    const result = await query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 100');
    await setCache('posts:list', result.rows, 60);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const { title, slug, content, author_id, category_id, status = 'draft' } = req.body;
    const result = await query(
      `INSERT INTO posts (title, slug, content, author_id, category_id, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, slug, content, author_id || null, category_id || null, status]
    );

    const post = result.rows[0];
    await indexPost(post);
    emitEvent('post:created', { postId: post.post_id, title: post.title });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

async function getPost(req, res, next) {
  try {
    const result = await query('SELECT * FROM posts WHERE post_id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const { title, slug, content, category_id, status } = req.body;
    const result = await query(
      `UPDATE posts
       SET title = COALESCE($2, title),
           slug = COALESCE($3, slug),
           content = COALESCE($4, content),
           category_id = COALESCE($5, category_id),
           status = COALESCE($6, status)
       WHERE post_id = $1
       RETURNING *`,
      [req.params.id, title, slug, content, category_id, status]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const result = await query('DELETE FROM posts WHERE post_id = $1 RETURNING post_id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listPosts, createPost, getPost, updatePost, deletePost };
