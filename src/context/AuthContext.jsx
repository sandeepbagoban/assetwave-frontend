import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as authApi from '../lib/api/auth';
import * as sellerApi from '../lib/api/sellers';

const AuthContext = createContext(null);

const TOKEN_KEY = 'assetwave_access_token';
const REFRESH_KEY = 'assetwave_refresh_token';
const USER_KEY = 'assetwave_user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const persistSession = useCallback(({ accessToken, refreshToken, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const refreshSellerProfile = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) { setSellerProfile(null); return; }
    try {
      setSellerProfile(await sellerApi.getMySellerProfile());
    } catch {
      setSellerProfile(null);
    }
  }, []);

  useEffect(() => {
    if (user) refreshSellerProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      persistSession(result);
      return result.user;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const result = await authApi.register(payload);
      persistSession(result);
      return result.user;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    try { await authApi.logout(refreshToken); } catch { /* best-effort */ }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setSellerProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, sellerProfile, loading, login, register, logout, refreshSellerProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
