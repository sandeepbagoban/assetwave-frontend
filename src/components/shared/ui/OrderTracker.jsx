import { CheckCircle2, Circle } from 'lucide-react';

// Buyer-facing shipment progress — a UI-only view built from the existing
// order status, not a separate tracked field. Exception branches
// (disputed/refunded/cancelled) fall outside this linear path and are
// already surfaced by the status badge elsewhere, so the tracker just hides.
const STEPS = [
  { key: 'placed', label: 'Placed & paid' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
];

const EXCEPTION_STATUSES = ['disputed', 'refunded', 'cancelled', 'pending_payment'];

const STEP_INDEX_BY_STATUS = { paid: 0, shipped: 1, delivered: 2, released: 3 };

export default function OrderTracker({ status, compact = false }) {
  if (EXCEPTION_STATUSES.includes(status)) return null;
  const activeIndex = STEP_INDEX_BY_STATUS[status] ?? 0;
  const iconSize = compact ? 13 : 18;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {STEPS.map((step, i) => (
          <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            {i <= activeIndex
              ? <CheckCircle2 size={iconSize} color="var(--green)" style={{ flexShrink: 0 }} />
              : <Circle size={iconSize} color="var(--text4)" style={{ flexShrink: 0 }} />}
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, minWidth: compact ? 14 : 24, margin: compact ? '0 4px' : '0 8px',
                background: i < activeIndex ? 'var(--green)' : 'var(--border)',
              }} />
            )}
          </div>
        ))}
      </div>
      {!compact && (
        <div style={{ display: 'flex', marginTop: 6 }}>
          {STEPS.map((step, i) => (
            <div key={step.key} style={{
              flex: i < STEPS.length - 1 ? 1 : 'none', textAlign: i === 0 ? 'left' : i === STEPS.length - 1 ? 'right' : 'center',
              fontSize: 10.5, color: i <= activeIndex ? 'var(--text2)' : 'var(--text4)',
            }}>
              {step.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
