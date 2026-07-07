import { useState, useEffect } from 'react';
import { getListings, getListing, getPlatformStats } from '../lib/api/listings';

// Generic async data hook — consistent loading/error/data shape
// so every component that fetches from the backend behaves the same way.
export function useListings(params = {}) {
  const [state, setState] = useState({ data: [], meta: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    getListings(params)
      .then(res => { if (!cancelled) setState({ data: res.data, meta: res.meta, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: [], meta: null, loading: false, error: err.message }); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return state;
}

export function useListing(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    getListing(id)
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });

    return () => { cancelled = true; };
  }, [id]);

  return state;
}

export function usePlatformStats() {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    getPlatformStats()
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });
    return () => { cancelled = true; };
  }, []);

  return state;
}
