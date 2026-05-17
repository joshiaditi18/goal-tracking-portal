import { createContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, logout as logoutApi, fetchProfile } from '../api/auth.js';

export const AuthContext = createContext(null);

const AUTH_KEY = 'inhouse_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await fetchProfile(token);
        setUser(profile);
      } catch (error) {
        localStorage.removeItem('authToken');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    localStorage.setItem('authToken', response.token);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await logoutApi(token);
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
