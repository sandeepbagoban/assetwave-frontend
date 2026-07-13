import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { getNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead } from '../../lib/api/notifications';

const POLL_INTERVAL_MS = 45000;

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState(null);
  const containerRef = useRef(null);

  const refreshCount = useCallback(() => {
    getUnreadCount().then(setUnreadCount).catch(() => {});
  }, []);

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshCount]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && notifications === null) {
      try {
        setNotifications(await getNotifications());
      } catch {
        setNotifications([]);
      }
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setNotifications(list => (list || []).map(x => ({ ...x, read: true })));
      setUnreadCount(0);
    } catch { /* best-effort */ }
  }

  async function handleClickNotification(n) {
    setOpen(false);
    if (n.read) return;
    try {
      await markNotificationRead(n.id);
      setNotifications(list => (list || []).map(x => (x.id === n.id ? { ...x, read: true } : x)));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch { /* best-effort */ }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        style={{
          position: 'relative', width: 40, height: 40, borderRadius: 10,
          background: 'var(--surface)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', flexShrink: 0,
        }}
      >
        <Bell size={17} strokeWidth={1.7} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -5, right: -5, minWidth: 17, height: 17, borderRadius: 100,
            background: 'var(--violet)', color: '#fff', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
          }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="aw-surface" style={{
          position: 'absolute', top: 48, right: 0, width: 340, maxHeight: 420, overflowY: 'auto',
          borderRadius: 14, zIndex: 1100, boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--violet3)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>

          {notifications === null ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 12.5, color: 'var(--text3)' }}>Loading…</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 12.5, color: 'var(--text3)' }}>No notifications yet.</div>
          ) : (
            notifications.map(n => (
              <Link
                key={n.id}
                to={n.link || '#'}
                onClick={() => handleClickNotification(n)}
                style={{
                  display: 'block', padding: '12px 16px', borderBottom: '1px solid var(--border)',
                  background: n.read ? 'transparent' : 'var(--surface2)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{n.title}</div>
                {n.message && <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4, lineHeight: 1.4 }}>{n.message}</div>}
                <div style={{ fontSize: 11, color: 'var(--text4)' }}>{timeAgo(n.created_at)}</div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
