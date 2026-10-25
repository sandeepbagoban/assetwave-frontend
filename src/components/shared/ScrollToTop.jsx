import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll position on every route change — without this,
// navigating to a new page keeps the previous page's scroll offset.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' }));
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
