// Listings API module — maps to the `catalog` backend module
// (see docs/api_design.md, Section 7.2 "Catalog").
//
// Components should import from here, never from the mocks directly
// and never call apiClient directly. This is the seam where the
// frontend swaps from mock data to the real backend:
//
//   1. Deploy the backend (see /backend)
//   2. Set VITE_API_BASE_URL in .env
//   3. Done — no component code changes needed.

import { apiClient } from './client';
import { MOCK_LISTINGS, MOCK_PLATFORM_STATS } from './mocks/listings';

export async function getListings(params = {}) {
  if (apiClient.isUsingMocks) {
    // Simulate basic filtering so UI built against mocks behaves
    // the same way it will against the real API.
    let results = [...MOCK_LISTINGS];
    if (params.category) {
      results = results.filter(l => l.category === params.category);
    }
    return { data: results, meta: { total: results.length, page: 1, limit: 20 } };
  }

  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/listings${query ? `?${query}` : ''}`, { auth: false });
}

export async function getListing(id) {
  if (apiClient.isUsingMocks) {
    const listing = MOCK_LISTINGS.find(l => l.id === id);
    if (!listing) throw new Error('Listing not found');
    return listing;
  }
  const res = await apiClient.get(`/listings/${id}`, { auth: false });
  return res.data;
}

export async function getPlatformStats() {
  if (apiClient.isUsingMocks) {
    return MOCK_PLATFORM_STATS;
  }
  // Maps to a future GET /v1/platform/stats endpoint — not yet
  // specified in docs/api_design.md; add it there when building this.
  return apiClient.get('/platform/stats', { auth: false });
}

export async function createListing(payload) {
  if (apiClient.isUsingMocks) {
    throw new Error('createListing requires a connected backend — set VITE_API_BASE_URL.');
  }
  const res = await apiClient.post('/listings', payload);
  return res.data;
}

export async function updateListing(id, payload) {
  if (apiClient.isUsingMocks) {
    throw new Error('updateListing requires a connected backend — set VITE_API_BASE_URL.');
  }
  const res = await apiClient.patch(`/listings/${id}`, payload);
  return res.data;
}

export async function deleteListing(id) {
  if (apiClient.isUsingMocks) {
    throw new Error('deleteListing requires a connected backend — set VITE_API_BASE_URL.');
  }
  return apiClient.delete(`/listings/${id}`);
}

export async function addListingImages(id, files) {
  if (apiClient.isUsingMocks) {
    throw new Error('addListingImages requires a connected backend — set VITE_API_BASE_URL.');
  }
  const formData = new FormData();
  for (const file of files) formData.append('images', file);
  const res = await apiClient.postForm(`/listings/${id}/images`, formData);
  return res.data;
}
