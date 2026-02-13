process.env.NODE_ENV = 'test';
process.env.PORT = '5000';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/educms_db';
process.env.JWT_SECRET = 'abcdefghijklmnopqrstuvwxyz123456';
process.env.JWT_REFRESH_SECRET = 'abcdefghijklmnopqrstuvwxyz123456';
process.env.CORS_ORIGIN = 'http://localhost:5173';

const { validateEnvVars } = require('../src/config/env');

describe('validateEnvVars', () => {
  const good = {
    NODE_ENV: 'test',
    PORT: '5000',
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/educms_db',
    JWT_SECRET: 'abcdefghijklmnopqrstuvwxyz123456',
    JWT_REFRESH_SECRET: 'abcdefghijklmnopqrstuvwxyz123456',
    CORS_ORIGIN: 'http://localhost:5173'
  };

  it('returns parsed env for valid input', () => {
    const parsed = validateEnvVars(good);
    expect(parsed.PORT).toBe(5000);
    expect(parsed.NODE_ENV).toBe('test');
  });

  it('throws for missing required vars', () => {
    expect(() => validateEnvVars({ ...good, DATABASE_URL: '' })).toThrow();
  });
});
