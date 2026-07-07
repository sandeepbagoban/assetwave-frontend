// Orders API module — maps to the `orders` backend module (checkout + the
// buyer/seller sides of the escrow lifecycle).

import { apiClient } from './client';

function requireBackend() {
  if (apiClient.isUsingMocks) {
    throw new Error('Checkout requires a connected backend — set VITE_API_BASE_URL.');
  }
}

export async function checkout(shipping_address) {
  requireBackend();
  const res = await apiClient.post('/orders/checkout', { shipping_address });
  return res.data;
}

export async function getOrders(params = {}) {
  requireBackend();
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/orders${query ? `?${query}` : ''}`);
}

export async function getOrder(id) {
  requireBackend();
  const res = await apiClient.get(`/orders/${id}`);
  return res.data;
}

export async function confirmDelivery(id) {
  requireBackend();
  const res = await apiClient.post(`/orders/${id}/confirm-delivery`);
  return res.data;
}

export async function markShipped(id) {
  requireBackend();
  const res = await apiClient.post(`/orders/${id}/ship`);
  return res.data;
}

export async function raiseDispute(id, reason) {
  requireBackend();
  const res = await apiClient.post(`/orders/${id}/dispute`, { reason });
  return res.data;
}
