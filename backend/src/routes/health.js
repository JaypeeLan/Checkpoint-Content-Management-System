const express = require('express');
const { health } = require('../controllers/healthController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Health check
 */
router.get('/', health);

module.exports = router;
