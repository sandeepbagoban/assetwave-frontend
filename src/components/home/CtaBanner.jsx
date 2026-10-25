import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
export default function CtaBanner(){return <section className="inventory-cta"><div className="container inventory-cta__inner"><div><h2>Upload your inventory</h2><p>Turn surplus telecom and broadcast equipment into your next opportunity. Apply as a seller and our team will help you get started.</p></div><Link className="button" to="/register" state={{intent:'seller'}}>Upload your inventory<ArrowUpRight size={17}/></Link></div></section>;}
