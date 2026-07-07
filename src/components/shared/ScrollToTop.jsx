import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll position on every route change — without this,
// navigating to a new page keeps the previous page's scroll offset.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
