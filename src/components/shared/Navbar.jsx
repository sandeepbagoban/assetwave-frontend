import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sun, Moon, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
export function Brand({ subtitle = 'Pilot · early access' }) {
 return <Link className="brand" to="/" aria-label="AWXchange home"><span className="brand__mark" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 26 26" fill="none"><path d="M13 2L23 8V18L13 24L3 18V8L13 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M13 2V24M3 8L23 18M23 8L3 18" stroke="currentColor" strokeWidth=".7" opacity=".65"/></svg></span><span><span className="brand__name">AWXchange</span><span className="brand__pilot" style={{ display:'block' }}>{subtitle}</span></span></Link>;
}
const links=[['Marketplace','/marketplace'],['How it works','/features'],['About','/about'],['Resources','/resources'],['Contact','/contact']];
export default function Navbar(){
 const {pathname}=useLocation();const {user,sellerProfile,logout}=useAuth();const {theme,toggleTheme}=useTheme();const navigate=useNavigate();
 const [scrolled,setScrolled]=useState(false);const [open,setOpen]=useState(false);
 useEffect(()=>{const onScroll=()=>setScrolled(scrollY>24);onScroll();window.addEventListener('scroll',onScroll);return()=>window.removeEventListener('scroll',onScroll);},[]);
 useEffect(()=>setOpen(false),[pathname]);
 const overlay=pathname==='/'&&!scrolled&&!open;
 const hasSellerAccount=user?.role==='seller'||Boolean(sellerProfile);
 const accountPath=hasSellerAccount?'/account/seller':'/account/orders';
 const accountLabel=hasSellerAccount?'Seller workspace':'My account';
 async function signOut(){await logout();navigate('/');}
 return <nav className={`site-nav${overlay?' is-overlay':''}`} aria-label="Main navigation"><div className="container site-nav__inner"><Brand />
 <div className="site-nav__links">{links.map(([label,to])=><NavLink key={to} to={to}>{label}</NavLink>)}</div>
 <div className="site-nav__actions"><button className="nav-icon desktop-action" onClick={toggleTheme} aria-label={theme==='dark'?'Switch to light mode':'Switch to dark mode'}>{theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}</button>
 {user?<><Link className="desktop-action" to={accountPath}>{accountLabel}</Link>{(user.pilot_buyer||user.role==='admin')&&<Link className="nav-icon desktop-action" aria-label="Shopping cart" to="/cart"><ShoppingCart size={16}/></Link>}<button className="nav-icon desktop-action" title="Log out" onClick={signOut}>↪</button></>:<><Link className="desktop-action" to="/login">Log in</Link><Link className="button desktop-action" to="/register">Get started <ArrowUpRight size={15}/></Link></>}
 <button className="nav-icon nav-menu-button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={19}/>:<Menu size={19}/>}</button></div></div>
 {open&&<div className="site-mobile-menu">{links.map(([label,to])=><Link key={to} to={to}>{label}</Link>)}{user?<><Link to={accountPath}>{accountLabel}</Link><Link to="/account/orders">My orders</Link><button onClick={signOut}>Log out</button></>:<><Link to="/login">Log in</Link><Link to="/register">Create an account</Link></>}<button onClick={toggleTheme}>Switch to {theme==='dark'?'light':'dark'} mode</button></div>}</nav>;
}
