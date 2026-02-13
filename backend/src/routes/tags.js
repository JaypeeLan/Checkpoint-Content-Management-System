const express = require('express');
const { listTags, createTag, updateTag, deleteTag } = require('../controllers/tagController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

router.get('/', listTags);
router.post('/', authenticate, authorize('admin', 'editor', 'author'), createTag);
router.put('/:id', authenticate, authorize('admin', 'editor', 'author'), updateTag);
router.delete('/:id', authenticate, authorize('admin', 'editor'), deleteTag);

module.exports = router;
