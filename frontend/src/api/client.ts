import axios from 'axios';
import { validateFrontendEnv } from '../env';

const env = validateFrontendEnv(import.meta.env as Record<string, string | undefined>);

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export function setToken(token: string) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}
