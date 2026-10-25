import { Link } from 'react-router-dom';
import { Brand } from './Navbar';
export default function Footer(){return <footer className="site-footer"><div className="container"><div className="site-footer__main"><div><Brand/><p>A marketplace for surplus telecom and broadcast equipment. Every deal is managed by the AWXchange team.</p></div>
 <div className="site-footer__links"><h4>Marketplace</h4><Link to="/marketplace">Browse equipment</Link><Link to="/register" state={{intent:'seller'}}>Sell equipment</Link><Link to="/features">How it works</Link></div>
 <div className="site-footer__links"><h4>Company</h4><Link to="/about">About AWXchange</Link><Link to="/resources">Resources</Link><Link to="/contact">Contact our team</Link></div>
 <div className="site-footer__links"><h4>Your account</h4><Link to="/login">Log in</Link><Link to="/register" state={{ intent: 'seller' }}>Become a seller</Link><Link to="/account/orders">Order history</Link></div></div>
 <div className="site-footer__bottom"><span>© 2026 AWXchange. All rights reserved.</span><div><Link to="/terms">Terms of Use</Link><Link to="/privacy">Privacy Policy</Link><Link to="/privacy#cookies">Cookie Policy</Link></div></div></div></footer>;}
