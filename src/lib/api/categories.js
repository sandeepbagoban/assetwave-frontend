// Categories API module — maps to the `categories` backend module.

import { apiClient } from './client';

const MOCK_CATEGORIES = [
  { id: 'transmitters', name: 'Transmitters', slug: 'transmitters' },
  { id: 'cameras', name: 'Cameras', slug: 'cameras' },
  { id: 'audio', name: 'Audio', slug: 'audio' },
  { id: 'satellite', name: 'Satellite', slug: 'satellite' },
  { id: 'lighting', name: 'Lighting', slug: 'lighting' },
];

export async function getCategories() {
  if (apiClient.isUsingMocks) return MOCK_CATEGORIES;
  const res = await apiClient.get('/categories', { auth: false });
  return res.data;
}
