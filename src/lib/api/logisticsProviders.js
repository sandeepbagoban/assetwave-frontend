// Logistics providers API module — the manually-maintained shipping carrier
// directory (DHL, FedEx, UPS, Chronopost, Colissimo, etc.) surfaced at checkout.

import { apiClient } from './client';

export async function getLogisticsProviders() {
  if (apiClient.isUsingMocks) return [];
  const res = await apiClient.get('/logistics-providers', { auth: false });
  return res.data;
}
