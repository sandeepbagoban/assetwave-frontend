// Sellers API module — maps to the `sellers` backend module (self-service
// seller application, own listings, and orders containing the seller's items).

import { apiClient } from './client';

function requireBackend() {
  if (apiClient.isUsingMocks) {
    throw new Error('Seller tools require a connected backend — set VITE_API_BASE_URL.');
  }
}

export async function applyAsSeller(payload) {
  requireBackend();
  const res = await apiClient.post('/sellers/apply', payload);
  return res.data;
}

export async function getMySellerProfile() {
  requireBackend();
  const res = await apiClient.get('/sellers/me');
  return res.data;
}

export async function getMyListings(params = {}) {
  requireBackend();
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/sellers/me/listings${query ? `?${query}` : ''}`);
}

export async function getMySellerOrders(params = {}) {
  requireBackend();
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/sellers/me/orders${query ? `?${query}` : ''}`);
}

export async function getMyStats() {
  requireBackend();
  const res = await apiClient.get('/sellers/me/stats');
  return res.data;
}
