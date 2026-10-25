// Central API client for AWXchange frontend.
//
// All backend communication should go through this client so that:
//   1. The base URL is configured once (via VITE_API_BASE_URL env var)
//   2. Auth headers are attached consistently
//   3. Error handling is consistent across the app
//
// Locally served builds use the same-origin Vite proxy, including `vite preview`.
// Deployed sites retain their configured HTTPS API endpoint.
const isLocalHost = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(window.location.hostname);
const BASE_URL = isLocalHost ? '/v1' : (import.meta.env.VITE_API_BASE_URL || '/v1').replace(/\/$/, '');
const USE_MOCKS = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true';

function getAuthToken() {
  return localStorage.getItem('assetwave_access_token');
}

async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  if (USE_MOCKS) {
    throw new Error(
      `API call to ${path} attempted, but no backend is configured (VITE_API_BASE_URL is unset). ` +
      `This module should be using mock data instead — see src/lib/api/mocks/.`
    );
  }

  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorBody;
    try { errorBody = await res.json(); } catch { /* no json body */ }
    const message = errorBody?.error?.message || `Request failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.code = errorBody?.error?.code;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}

async function requestForm(path, formData) {
  if (USE_MOCKS) {
    throw new Error(`API call to ${path} attempted, but no backend is configured (VITE_API_BASE_URL is unset).`);
  }

  const headers = {};
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: formData });

  if (!res.ok) {
    let errorBody;
    try { errorBody = await res.json(); } catch { /* no json body */ }
    const message = errorBody?.error?.message || `Request failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.code = errorBody?.error?.code;
    throw err;
  }

  return res.json();
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  postForm: (path, formData) => requestForm(path, formData),
  isUsingMocks: USE_MOCKS,
};

// The backend serves uploaded images from its own origin, not under /v1 —
// e.g. BASE_URL=http://localhost:4000/v1 but images live at
// http://localhost:4000/uploads/listings/xyz.jpg.
const API_ORIGIN = BASE_URL.replace(/\/v1\/?$/, '');

export function resolveAssetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith('data:')) return path;
  return `${API_ORIGIN}${path}`;
}
