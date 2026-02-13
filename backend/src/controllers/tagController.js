const { query } = require('../config/database');

async function listTags(req, res, next) {
  try {
    const result = await query('SELECT * FROM tags ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
}

async function createTag(req, res, next) {
  try {
    const { name, slug } = req.body;
    const result = await query('INSERT INTO tags (name, slug) VALUES ($1,$2) RETURNING *', [name, slug]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function updateTag(req, res, next) {
  try {
    const { name, slug } = req.body;
    const result = await query(
      'UPDATE tags SET name=COALESCE($2,name), slug=COALESCE($3,slug) WHERE tag_id=$1 RETURNING *',
      [req.params.id, name, slug]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Tag not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function deleteTag(req, res, next) {
  try {
    const result = await query('DELETE FROM tags WHERE tag_id=$1 RETURNING tag_id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Tag not found' });
    res.json({ success: true, message: 'Tag deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listTags, createTag, updateTag, deleteTag };
