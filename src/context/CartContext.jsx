import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as cartApi from '../lib/api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!user) { setCart(null); setError(''); return; }
    setLoading(true);
    setError('');
    try {
      setCart(await cartApi.getCart());
    } catch (err) {
      setCart(null);
      setError(err.message || 'Could not load your cart.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem = useCallback(async (listingId, quantity = 1) => {
    setCart(await cartApi.addToCart(listingId, quantity));
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    setCart(await cartApi.updateCartItem(itemId, quantity));
  }, []);

  const removeItem = useCallback(async (itemId) => {
    setCart(await cartApi.removeCartItem(itemId));
  }, []);

  const itemCount = (cart?.items || []).reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, error, itemCount, addItem, updateItem, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
