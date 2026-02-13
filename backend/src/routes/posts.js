const express = require('express');
const { listPosts, createPost, getPost, updatePost, deletePost } = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

router.get('/', listPosts);
router.get('/:id', getPost);
router.post('/', authenticate, authorize('admin', 'editor', 'author'), createPost);
router.put('/:id', authenticate, authorize('admin', 'editor', 'author'), updatePost);
router.delete('/:id', authenticate, authorize('admin', 'editor'), deletePost);

module.exports = router;
