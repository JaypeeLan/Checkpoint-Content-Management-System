const express = require('express');
const { body } = require('express-validator');
const { login, register } = require('../controllers/authController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login and receive JWT tokens
 */
router.post(
  '/login',
  [body('email').isEmail(), body('password').isString().isLength({ min: 6 })],
  login
);

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register and receive JWT tokens
 */
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
    body('firstName').optional().isString(),
    body('lastName').optional().isString()
  ],
  register
);

module.exports = router;
