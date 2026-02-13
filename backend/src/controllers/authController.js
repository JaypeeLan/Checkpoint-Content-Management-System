const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { env } = require('../config/env');

const registeredUsers = new Map();

function seedDemoUsers() {
  if (registeredUsers.size) return;

  const demoPassword = bcrypt.hashSync('admin123', 10);
  registeredUsers.set('admin@educms.com', { passwordHash: demoPassword, role: 'admin' });
  registeredUsers.set('editor@educms.com', { passwordHash: demoPassword, role: 'editor' });
  registeredUsers.set('author@educms.com', { passwordHash: demoPassword, role: 'author' });
}

function issueTokens(email, role) {
  const token = jwt.sign({ sub: email, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });

  const refreshToken = jwt.sign({ sub: email, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN
  });

  return { token, refreshToken, user: { email, role } };
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  seedDemoUsers();

  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const existing = registeredUsers.get(email);
  if (!existing) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const passwordOk = await bcrypt.compare(password, existing.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  return res.json({ success: true, data: issueTokens(email, existing.role) });
}

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  seedDemoUsers();

  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (registeredUsers.has(email)) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  registeredUsers.set(email, {
    passwordHash,
    role: 'subscriber'
  });

  return res.status(201).json({ success: true, data: issueTokens(email, 'subscriber') });
}

module.exports = { login, register };
