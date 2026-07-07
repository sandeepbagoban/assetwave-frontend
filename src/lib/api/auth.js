// Auth API module — maps to the `auth` backend module (assetwave-backend/src/routes/auth.routes.js).
// No mock fallback here: auth requires a real backend to be meaningful,
// so these calls simply fail loudly if VITE_API_BASE_URL is unset.

import { apiClient } from './client';

export async function register({ email, password, full_name, phone }) {
  return apiClient.post('/auth/register', { email, password, full_name, phone }, { auth: false });
}

export async function login({ email, password }) {
  return apiClient.post('/auth/login', { email, password }, { auth: false });
}

export async function refresh(refresh_token) {
  return apiClient.post('/auth/refresh', { refresh_token }, { auth: false });
}

export async function logout(refresh_token) {
  return apiClient.post('/auth/logout', { refresh_token }, { auth: false });
}

export async function getMe() {
  const res = await apiClient.get('/auth/me');
  return res.data;
}
