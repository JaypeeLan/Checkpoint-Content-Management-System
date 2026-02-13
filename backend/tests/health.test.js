process.env.NODE_ENV = 'test';
process.env.PORT = '5000';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/educms_db';
process.env.JWT_SECRET = 'abcdefghijklmnopqrstuvwxyz123456';
process.env.JWT_REFRESH_SECRET = 'abcdefghijklmnopqrstuvwxyz123456';
process.env.CORS_ORIGIN = 'http://localhost:5173';

const request = require('supertest');
const { app } = require('../src/app');

describe('GET /api/v1/health', () => {
  it('returns healthy response', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('ok');
  });
});
