import PageHeader from '../../components/shared/PageHeader';
import { AlertTriangle } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Who we are',
    body: `AWXchange ("we", "us", "AWXchange") operates a marketplace connecting buyers and sellers of used telecom
    and broadcast equipment. AWXchange is currently running as a pilot with a small group of approved sellers
    and buyers.`,
  },
  {
    title: '2. Accepting these terms',
    body: `By creating an account or using AWXchange, you agree to these Terms of Use. If you do not agree, do not
    use the platform. We may update these terms from time to time; continued use after an update means you
    accept the revised terms.`,
  },
  {
    title: '3. Accounts and eligibility',
    body: `You must provide accurate information when registering. Seller accounts are reviewed and approved by
    our team before listings can be published. We may suspend or terminate an account that violates these
    terms or provides false information.`,
  },
  {
    title: '4. How transactions work',
    body: `During the pilot, every order is handled personally by the AWXchange team: buyers pay AWXchange directly,
    we coordinate collection and shipping with the seller, and the seller is paid after the buyer confirms
    delivery. Online payments and automated buyer protection are on our roadmap but are not yet available.`,
  },
  {
    title: '5. Seller obligations',
    body: `Sellers are responsible for the accuracy of their listings (condition, specifications, origin) and for
    making equipment available for collection as agreed. Misrepresenting equipment or failing to fulfil an
    accepted order may result in account suspension.`,
  },
  {
    title: '6. Buyer obligations',
    body: `Buyers are responsible for inspecting equipment on delivery and reporting any issue within the window
    communicated at checkout. Payment is due as invoiced before shipment is arranged.`,
  },
  {
    title: '7. Fees',
    body: `AWXchange charges sellers a commission on completed sales, deducted from the seller payout. Current
    commission rates are confirmed with sellers before listing.`,
  },
  {
    title: '8. Limitation of liability',
    body: `AWXchange facilitates transactions between independent buyers and sellers. To the fullest extent
    permitted by law, AWXchange is not liable for indirect or consequential losses arising from a transaction.
    Nothing in these terms limits liability that cannot be limited by law.`,
  },
  {
    title: '9. Governing law',
    body: `These terms are governed by the laws of the jurisdiction in which AWXchange is registered. Disputes
    will be handled in that jurisdiction's courts, without prejudice to any mandatory consumer protections
    that apply to you locally.`,
  },
  {
    title: '10. Contact',
    body: `Questions about these terms can be sent to support@awxchange.com.`,
  },
];

export default function TermsOfUse() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of" titleItalic="Use" />
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
              legal counsel and is not yet a definitive statement of our terms. Do not rely on this text as final
              until this notice is removed.
            </p>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text4)', marginBottom: 32 }}>Last updated: 2026</p>

          {SECTIONS.map(s => (
            <div key={s.title} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{s.title}</h2>
              <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.8 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
