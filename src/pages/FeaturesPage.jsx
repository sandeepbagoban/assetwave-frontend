import PageHeader from '../components/shared/PageHeader';
const SECTIONS = [
  {
    "id": "buying",
    "label": "How buying works",
    "heading": "",
    "ordered": true,
    "points": [
      "Build your basket. Browse telecom and broadcast equipment, add what you need, and submit your basket. Items marked \"Price on request\" are quoted by our team.",
      "Receive your invoice. We confirm availability with the seller and send you one invoice covering the equipment, shipping and any applicable fees.",
      "Pay AWXchange. You pay us directly, by bank transfer to AWXchange. You never pay the seller directly.",
      "We ship. Once your payment is received, we arrange collection and delivery and share tracking with you.",
      "Confirm delivery. Check your equipment on arrival and confirm in your account. If something isn't right, tell us within the timeframe agreed for your order."
    ]
  },
  {
    "id": "selling",
    "label": "How selling works",
    "heading": "",
    "ordered": true,
    "points": [
      "Apply to sell. Register your company. Our team reviews every application before you can list.",
      "List your inventory. Upload your Excel file or add items one by one, with or without an asking price.",
      "Accept the order. When a buyer orders, we contact you to confirm availability and agree collection.",
      "Get paid. We pay you once the buyer confirms delivery, less the AWXchange commission."
    ]
  },
  {
    "id": "approved-sellers",
    "label": "Approved sellers",
    "heading": "Every seller is reviewed by our team.",
    "body": "Before a company can list, we check who they are and confirm their contact details. Approved sellers are marked on their listings.",
    "points": [
      "Every seller application is reviewed by a person",
      "Only approved sellers can publish listings",
      "Company identity stays confidential: buyers see a seller nickname and country, never the company name"
    ]
  },
  {
    "id": "payments",
    "label": "Payments",
    "heading": "One invoice, one trusted counterparty.",
    "body": "Buyers pay AWXchange, not the seller. We pass payment on to the seller only after the buyer confirms the equipment has arrived as described.",
    "points": [
      "One invoice per order, covering equipment and shipping",
      "Bank transfer to AWXchange",
      "Seller paid after delivery is confirmed",
      "Commission is deducted from the seller payout, so there are no hidden buyer fees"
    ]
  },
  {
    "id": "logistics",
    "label": "Logistics",
    "heading": "We coordinate shipping, door to door.",
    "body": "Once your payment is received, AWXchange takes care of getting the equipment to you. We arrange collection from the seller, book trusted freight partners, and handle the paperwork for cross-border shipments between Europe and Africa. You deal with one team from basket to delivery.",
    "extra": "For sellers: we tell you when the collection is booked. You just need the equipment packed and ready, with any accessories and documents listed on the order.",
    "points": [
      "Collection from the seller's site arranged by AWXchange",
      "Freight booked with vetted partners for each route",
      "Export, customs and shipping documents coordinated for you",
      "Shipping cost and estimated delivery time quoted on your invoice",
      "Tracking shared as soon as your equipment is on its way",
      "Proof of delivery recorded on your order"
    ]
  },
  {
    "id": "issues",
    "label": "If something goes wrong",
    "heading": "Talk to a person, not a form.",
    "body": "If equipment arrives damaged or doesn't match its listing, contact us before confirming delivery. Our team works with both sides to agree a fair outcome, such as a repair, a partial refund, a return or a full refund.",
    "points": [
      "Report issues within the timeframe agreed for your order",
      "Send photos so we can assess quickly",
      "The seller isn't paid while an issue is open"
    ]
  },
  {
    "id": "pilot",
    "label": "A note on our pilot",
    "heading": "",
    "body": "AWXchange is currently running with a small group of sellers and buyers. Online payments and automated buyer protection are on our roadmap. Until then, our team manages each transaction personally."
  }
];
export default function FeaturesPage() {
 return <><PageHeader eyebrow="Platform Features" title="Simple, managed deals" titleItalic="from basket to delivery" desc="AWXchange is in its pilot phase. Every deal is handled personally by our team, from approving sellers to delivering your equipment, so you always know who is looking after your order." />
 <section className="section"><div className="container" style={{ maxWidth: 900 }}>{SECTIONS.map(s => {
  const List = s.ordered ? 'ol' : 'ul';
  return <article key={s.id} id={s.id} style={{ padding: '32px 0', borderBottom: '1px solid var(--border)', scrollMarginTop: 110 }}>
   <div className="eyebrow" style={{ marginBottom: 14 }}>{s.label}</div>
   <h2 className="serif" style={{ fontSize: 30, marginBottom: 16 }}>{s.heading || s.label}</h2>
   {s.body && <p style={{ color: 'var(--text2)', lineHeight: 1.8 }}>{s.body}</p>}
   {s.extra && <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginTop: 16 }}>{s.extra}</p>}
   {s.points && <List style={{ paddingLeft: 24, marginTop: 20, color: 'var(--text2)', lineHeight: 1.8 }}>{s.points.map(point => <li key={point} style={{ marginBottom: 12 }}>{point}</li>)}</List>}
  </article>;
 })}</div></section></>;
}
