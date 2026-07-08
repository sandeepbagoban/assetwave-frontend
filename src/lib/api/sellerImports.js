// Seller-scoped bulk listing import — maps to the seller import routes
// (assetwave-backend/src/routes/seller.routes.js). No mock fallback, same
// reasoning as sellers.js/cart.js: meaningless without a real backend.

import { apiClient } from './client';

export const SELLER_IMPORT_COLUMNS = [
  'title',
  'category_slug',
  'brand',
  'model',
  'year_manufactured',
  'condition',
  'description',
  'price_amount',
  'currency',
  'origin_country',
  'new_price_estimate',
  'quantity',
];

function requireBackend() {
  if (apiClient.isUsingMocks) {
    throw new Error('Bulk upload requires a connected backend — set VITE_API_BASE_URL.');
  }
}

export async function previewSellerImport(file) {
  requireBackend();
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.postForm('/sellers/me/imports/listings/preview', formData);
  return res.data;
}

export async function commitSellerImport(jobId) {
  requireBackend();
  const res = await apiClient.post(`/sellers/me/imports/listings/${jobId}/commit`);
  return res.data;
}

export async function getSellerImportJob(jobId) {
  requireBackend();
  const res = await apiClient.get(`/sellers/me/imports/${jobId}`);
  return res.data;
}
