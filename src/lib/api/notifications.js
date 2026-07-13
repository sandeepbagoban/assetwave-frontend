// In-app notifications — bell icon in the navbar, no email/push involved.

import { apiClient } from './client';

function requireBackend() {
  if (apiClient.isUsingMocks) {
    throw new Error('Notifications require a connected backend — set VITE_API_BASE_URL.');
  }
}

export async function getNotifications() {
  requireBackend();
  const res = await apiClient.get('/notifications');
  return res.data;
}

export async function getUnreadCount() {
  requireBackend();
  const res = await apiClient.get('/notifications/unread-count');
  return res.data.count;
}

export async function markNotificationRead(id) {
  requireBackend();
  const res = await apiClient.patch(`/notifications/${id}/read`);
  return res.data;
}

export async function markAllNotificationsRead() {
  requireBackend();
  await apiClient.patch('/notifications/read-all');
}
