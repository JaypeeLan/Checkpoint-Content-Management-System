import { describe, expect, it } from 'vitest';
import { validateFrontendEnv } from '../env';

describe('validateFrontendEnv', () => {
  it('passes with required vars', () => {
    const env = validateFrontendEnv({
      VITE_API_BASE_URL: 'http://localhost:5000/api/v1',
      VITE_SOCKET_URL: 'http://localhost:5000'
    });
    expect(env.VITE_API_BASE_URL).toContain('/api/v1');
  });

  it('throws for missing vars', () => {
    expect(() => validateFrontendEnv({ VITE_API_BASE_URL: '' })).toThrow();
  });
});
