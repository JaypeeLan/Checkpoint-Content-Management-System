const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const express = require('express');
const { env } = require('../config/env');

function applySecurityMiddleware(app) {
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
}

module.exports = { applySecurityMiddleware };
