import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearTokens, exchangeCode, hasSession, loginWithSpotify } from '../services/spotifyAuth';
import { getProfile } from '../services/spotify';

const AuthContext = createContext(null);


const ADMIN_IDS = (import.meta.env.VITE_ADMIN_IDS || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

function buildUser(profile) {
  return {
    id: profile.id,
    username: profile.display_name || profile.id,
    image: profile.images && profile.images.length > 0 ? profile.images[0].url : null,
    role: ADMIN_IDS.includes(profile.id) ? 'admin' : 'user',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(() => {
    return getProfile()
      .then((profile) => {
        const nextUser = buildUser(profile);
        setUser(nextUser);
        return nextUser;
      })
      .catch((err) => {
        console.error('Could not load Spotify profile:', err);
        clearTokens();
        setUser(null);
        return null;
      });
  }, []);

  
  useEffect(() => {
    if (!hasSession()) {
      setLoading(false);
      return;
    }

    loadProfile().finally(() => setLoading(false));
  }, [loadProfile]);

  const completeLogin = useCallback(
    (code) => {
      return exchangeCode(code)
        .then(() => {
          return loadProfile();
        });
    },
    [loadProfile]
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login: loginWithSpotify, completeLogin, logout }),
    [user, loading, completeLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);