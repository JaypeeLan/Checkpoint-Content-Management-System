import { api, setToken } from './client';

const TOKEN_KEY = 'educms_token';
const ROLE_KEY = 'educms_role';

export type UserRole = 'admin' | 'editor' | 'author' | 'subscriber';

function persistAuth(token: string, role: UserRole): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  setToken(token);
}

export function routeForRole(role: UserRole): string {
  if (role === 'subscriber') return '/student';
  return '/admin';
}

export async function loginWithPassword(email: string, password: string): Promise<UserRole> {
  const res = await api.post('/auth/login', { email, password });
  const token = res.data?.data?.token as string | undefined;
  const role = res.data?.data?.user?.role as UserRole | undefined;

  if (!token || !role) {
    throw new Error('Login failed: invalid response');
  }

  persistAuth(token, role);
  return role;
}

export async function registerWithPassword(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<UserRole> {
  const res = await api.post('/auth/register', input);
  const token = res.data?.data?.token as string | undefined;
  const role = res.data?.data?.user?.role as UserRole | undefined;

  if (!token || !role) {
    throw new Error('Register failed: invalid response');
  }

  persistAuth(token, role);
  return role;
}

export function loadStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) setToken(token);
  return token;
}

export function getStoredRole(): UserRole | null {
  return (localStorage.getItem(ROLE_KEY) as UserRole | null) || null;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  delete api.defaults.headers.common.Authorization;
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
