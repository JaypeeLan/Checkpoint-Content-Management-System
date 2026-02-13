const { query } = require('../config/database');

async function listCategories(req, res, next) {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, slug, description } = req.body;
    const result = await query(
      'INSERT INTO categories (name, slug, description) VALUES ($1,$2,$3) RETURNING *',
      [name, slug, description || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { name, slug, description } = req.body;
    const result = await query(
      `UPDATE categories
       SET name=COALESCE($2,name), slug=COALESCE($3,slug), description=COALESCE($4,description)
       WHERE category_id=$1 RETURNING *`,
      [req.params.id, name, slug, description]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const result = await query('DELETE FROM categories WHERE category_id=$1 RETURNING category_id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
