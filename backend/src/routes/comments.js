const express = require('express');
const { listComments, createComment, updateCommentStatus, deleteComment } = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

router.get('/', listComments);
router.post('/', authenticate, authorize('admin', 'editor', 'author', 'subscriber'), createComment);
router.patch('/:id/status', authenticate, authorize('admin', 'editor'), updateCommentStatus);
router.delete('/:id', authenticate, authorize('admin', 'editor'), deleteComment);

module.exports = router;
