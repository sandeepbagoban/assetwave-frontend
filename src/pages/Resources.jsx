import { Link } from 'react-router-dom';
import PageHeader from '../components/shared/PageHeader';
export default function Resources() {
  return <><PageHeader eyebrow="Resources" title="Support for the" titleItalic="AWXchange pilot" desc="Our team can help with listing equipment and enquiries about a purchase." />
    <section className="section"><div className="container" style={{ display: 'grid', gap: 24 }}>
      <Link to="/features">How the pilot works →</Link><Link to="/contact">Contact the AWXchange team →</Link>
      <Link to="/terms">Terms of Use →</Link><Link to="/privacy">Privacy Policy and cookies →</Link>
    </div></section></>;
}
