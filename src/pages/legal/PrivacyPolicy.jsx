import { useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { AlertTriangle } from 'lucide-react';

const SECTIONS = [
  {
    id: 'data-we-collect',
    title: '1. Data we collect',
    body: `Account details you give us (name, email, phone), company details for seller applications, listing and
    order information, and basic technical data (such as pages viewed) needed to operate the site.`,
  },
  {
    id: 'how-we-use-it',
    title: '2. How we use your data',
    body: `To operate your account, process orders, review seller applications, communicate with you about
    transactions, and improve the platform. We do not sell your personal data.`,
  },
  {
    id: 'sharing',
    title: '3. Who we share it with',
    body: `Buyers and sellers see limited information about each other needed to complete a transaction (for
    example, a seller's nickname and country, not their full company name, until an order is confirmed). We
    may share data with service providers who help us run the platform (hosting, email delivery, logistics
    partners), under confidentiality obligations.`,
  },
  {
    id: 'retention',
    title: '4. Data retention',
    body: `We keep account and order data for as long as your account is active and for a reasonable period
    afterward to meet legal, accounting, and dispute-resolution obligations.`,
  },
  {
    id: 'your-rights',
    title: '5. Your rights (GDPR)',
    body: `If you are in the European Economic Area or the UK, you have the right to access, correct, delete, or
    export your personal data, and to object to or restrict certain processing. Contact us at
    privacy@awxchange.com to exercise these rights.`,
  },
  {
    id: 'cookies',
    title: '6. Cookies and local storage',
    body: `We use essential cookies and local storage required for the site to function (for example, keeping you logged in and
    remembering your theme preference). We do not currently use non-essential tracking or advertising cookies.
    If that changes, we will update this policy and ask for your consent via the cookie banner before setting
    any non-essential cookie.`,
  },
  {
    id: 'contact',
    title: '7. Contact',
    body: `Questions about this policy can be sent to privacy@awxchange.com.`,
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy" titleItalic="Policy" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: 14, padding: '16px 20px', marginBottom: 40,
          }}>
            <AlertTriangle size={18} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6 }}>
              <strong>Draft — pending legal review.</strong> This page is a placeholder pending final review by our
              legal counsel and is not yet a definitive statement of our privacy practices. Do not rely on this
              text as final until this notice is removed.
            </p>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text4)', marginBottom: 32 }}>Last updated: 2026</p>

          {SECTIONS.map(s => (
            <div key={s.id} id={s.id} style={{ marginBottom: 32, scrollMarginTop: 100 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{s.title}</h2>
              <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.8 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
