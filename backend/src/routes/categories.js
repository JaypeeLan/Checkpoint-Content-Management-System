const express = require('express');
const { listCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

router.get('/', listCategories);
router.post('/', authenticate, authorize('admin', 'editor'), createCategory);
router.put('/:id', authenticate, authorize('admin', 'editor'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
