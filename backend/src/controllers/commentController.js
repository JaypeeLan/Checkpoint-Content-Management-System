const { query } = require('../config/database');

async function listComments(req, res, next) {
  try {
    const result = await query(
      `SELECT c.*, p.title AS post_title
       FROM comments c
       LEFT JOIN posts p ON p.post_id = c.post_id
       ORDER BY c.created_at DESC
       LIMIT 200`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
}

async function createComment(req, res, next) {
  try {
    const { post_id, content, parent_id } = req.body;
    const parsedPostId = Number(post_id);

    if (!Number.isInteger(parsedPostId) || parsedPostId <= 0) {
      return res.status(422).json({ success: false, message: 'Valid post_id is required' });
    }

    if (!content || !String(content).trim()) {
      return res.status(422).json({ success: false, message: 'Comment content is required' });
    }

    const postExists = await query('SELECT post_id FROM posts WHERE post_id = $1', [parsedPostId]);
    if (!postExists.rows.length) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const result = await query(
      `INSERT INTO comments (post_id, user_id, content, parent_id, status)
       VALUES ($1,$2,$3,$4,'pending') RETURNING *`,
      [parsedPostId, null, String(content).trim(), parent_id || null]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function updateCommentStatus(req, res, next) {
  try {
    const { status } = req.body;
    const result = await query('UPDATE comments SET status=$2 WHERE comment_id=$1 RETURNING *', [req.params.id, status]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Comment not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const result = await query('DELETE FROM comments WHERE comment_id=$1 RETURNING comment_id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Comment not found' });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listComments, createComment, updateCommentStatus, deleteComment };