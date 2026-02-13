export type FrontendEnv = {
  VITE_API_BASE_URL: string;
  VITE_SOCKET_URL: string;
};

export function validateFrontendEnv(env: Record<string, string | undefined>): FrontendEnv {
  const missing: string[] = [];
  if (!env.VITE_API_BASE_URL) missing.push('VITE_API_BASE_URL');
  if (!env.VITE_SOCKET_URL) missing.push('VITE_SOCKET_URL');

  if (missing.length) {
    throw new Error(`Missing frontend env vars: ${missing.join(', ')}`);
  }

  return {
    VITE_API_BASE_URL: env.VITE_API_BASE_URL,
    VITE_SOCKET_URL: env.VITE_SOCKET_URL
  } as FrontendEnv;
}
