const express = require('express');
const { summary } = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

router.get('/summary', authenticate, authorize('admin', 'editor'), summary);

module.exports = router;
