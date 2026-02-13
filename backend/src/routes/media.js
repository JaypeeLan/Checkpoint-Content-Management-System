const express = require('express');
const { body } = require('express-validator');
const { getUploadSignature } = require('../controllers/mediaController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

router.post(
  '/signature',
  authenticate,
  authorize('admin', 'editor', 'author'),
  [body('filename').isString().notEmpty()],
  getUploadSignature
);

module.exports = router;
