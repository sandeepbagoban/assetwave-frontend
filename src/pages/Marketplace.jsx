import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, ChevronLeft, ChevronRight, Package, MapPin } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { getCategories } from '../lib/api/categories';
import { resolveAssetUrl } from '../lib/api/client';
import { formatPrice } from '../lib/format';
import CountrySelect from '../components/shared/CountrySelect';
import PageHeader from '../components/shared/PageHeader';
import { ErrorBlock, EmptyBlock } from '../components/shared/ui/AsyncBlocks';
import Skeleton from '../components/shared/ui/Skeleton';
function ListingCard({ listing }) {
 return <Link to={`/marketplace/${listing.id}`} className="equipment-card"><div className="equipment-card__image">{listing.images?.[0]?<img src={resolveAssetUrl(listing.images[0])} alt={listing.title} loading="lazy"/>:<div className="equipment-no-image"><Package size={42} strokeWidth={1}/><span>Equipment photo pending</span></div>}<span className="equipment-condition">{listing.condition}</span></div><div className="equipment-card__body"><div className="equipment-card__category">{listing.category?.replaceAll('-',' ')||'Professional equipment'}</div><h2>{listing.title}</h2><p>{[listing.brand,listing.model].filter(Boolean).join(' · ')||'Telecom & broadcast equipment'}</p><div className="equipment-card__location"><MapPin size={13}/>{listing.equipment_location||'Location on request'}<span>·</span>{listing.seller?.name||'Approved seller'}</div><div className="equipment-card__price"><strong>{formatPrice(listing.price_amount,listing.currency)}</strong><ArrowUpRight size={17}/></div></div></Link>;
}
export default function Marketplace(){
 const [categories,setCategories]=useState([]);const [categoryError,setCategoryError]=useState('');const [category,setCategory]=useState('');const [condition,setCondition]=useState('');const [country,setCountry]=useState('');const [query,setQuery]=useState('');const [search,setSearch]=useState('');const [page,setPage]=useState(1);
 useEffect(()=>{getCategories().then(setCategories).catch(e=>setCategoryError(e.message));},[]);
 useEffect(()=>{const timer=setTimeout(()=>setSearch(query),250);return()=>clearTimeout(timer);},[query]);
 useEffect(()=>setPage(1),[category,condition,country,search]);
 const {data:listings,meta,loading,error}=useListings({page,limit:20,...(search?{q:search}:{}),...(category?{category}:{}),...(condition?{condition}:{}),...(country?{country}:{})});
 const pages=Math.max(1,Math.ceil((meta?.total||0)/20));const hasFilters=category||condition||country||query;
 return <><PageHeader eyebrow="Equipment marketplace" title="Find equipment for" titleItalic="your next chapter." desc="Telecom and broadcast equipment from approved sellers. During our pilot, every order is managed personally by the AWXchange team."/><main className="section marketplace-section"><div className="container"><div className="marketplace-toolbar"><div className="marketplace-search"><Search size={19}/><input aria-label="Search equipment" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search equipment, brand or model…"/></div><Link className="button button--secondary" to="/register" state={{intent:'seller'}}>Have equipment to sell? <ArrowUpRight size={15}/></Link></div>
 <div className="marketplace-filters"><label>Equipment category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All equipment</option>{categories.map(c=><option key={c.id} value={c.slug}>{c.name}</option>)}</select></label><label>Condition<select value={condition} onChange={e=>setCondition(e.target.value)}><option value="">Any condition</option><option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option></select></label><label>Equipment location<CountrySelect placeholder="All locations" value={country} onChange={e=>setCountry(e.target.value)}/></label>{hasFilters&&<button className="text-link" onClick={()=>{setCategory('');setCondition('');setCountry('');setQuery('');}}>Clear filters</button>}</div>
 <div className="marketplace-results-header"><p>{loading?'Loading equipment…':`${meta?.total??listings.length} equipment listings`}</p><span>Every deal managed by AWXchange</span></div>{categoryError&&<ErrorBlock message={categoryError} prefix="Could not load categories"/>}{error&&<ErrorBlock message={error} prefix="Could not load equipment"/>}{loading&&<div className="marketplace-grid">{Array.from({length:8},(_,i)=><div key={i}><Skeleton height={220}/><Skeleton height={90} style={{marginTop:16}}/></div>)}</div>}{!loading&&!error&&(listings.length?<div className="marketplace-grid">{listings.map(l=><ListingCard key={l.id} listing={l}/>)}</div>:<EmptyBlock message="No equipment matches your search. Try another category or contact our team."/>)}
 {pages>1&&<div className="marketplace-pagination"><button className="button button--secondary" disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={15}/>Previous</button><span>Page {page} of {pages}</span><button className="button button--secondary" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next<ChevronRight size={15}/></button></div>}
 </div></main></>;
}
