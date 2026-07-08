// Cart API module — maps to the `cart` backend module. Requires an
// authenticated buyer, so there's no meaningful mock fallback: like
// createListing() in listings.js, these just fail loudly without a backend.

import { apiClient } from './client';

function requireBackend() {
  if (apiClient.isUsingMocks) {
    throw new Error('Cart requires a connected backend — set VITE_API_BASE_URL.');
  }
}

export async function getCart() {
  requireBackend();
  const res = await apiClient.get('/cart');
  return res.data;
}

export async function addToCart(listing_id, quantity = 1) {
  requireBackend();
  const res = await apiClient.post('/cart/items', { listing_id, quantity });
  return res.data;
}

export async function updateCartItem(itemId, quantity) {
  requireBackend();
  const res = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
  return res.data;
}

export async function removeCartItem(itemId) {
  requireBackend();
  const res = await apiClient.delete(`/cart/items/${itemId}`);
  return res.data;
}

// No bulk-clear endpoint exists on the backend, so isolating a single item
// for "Buy now" means looping single-item deletes.
export async function clearOtherItems(cart, keepListingId) {
  const others = (cart?.items || []).filter(i => i.listing.id !== keepListingId);
  await Promise.all(others.map(i => removeCartItem(i.id)));
}
