import React, { createContext, useContext, useState, useEffect } from 'react';
import { communityService } from '../services/communityService';

const CommunityAuthContext = createContext(null);

const STORAGE_KEY = 'ellangala_community_session';

export function CommunityAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('login'); // 'login' | 'signup'
  const [authModalNotice, setAuthModalNotice] = useState('');

  // 1. Initialize session from localStorage (30-day persistence)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        const expiresAt = session?.tokenExpiresAt ? new Date(session.tokenExpiresAt).getTime() : 0;
        const now = Date.now();

        if (expiresAt > now && session?.token && session?.user) {
          // Session is valid (within 30 days)
          setUser(session.user);
          setToken(session.token);

          // Verify & re-sync with server in background
          communityService.getMe(session.token)
            .then(freshUser => {
              if (freshUser) {
                setUser(freshUser);
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                  ...session,
                  user: freshUser
                }));
              } else {
                // Token invalid on server
                handleClearSession();
              }
            })
            .catch(() => {
              // Network error or offline: keep local cached session alive
            });
        } else {
          // Expired after 30 days
          handleClearSession();
        }
      }
    } catch (e) {
      handleClearSession();
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const [onSuccessCallback, setOnSuccessCallback] = useState(null);

  const openAuthModal = (tab = 'login', notice = '', callback = null) => {
    setAuthModalInitialTab(tab);
    setAuthModalNotice(notice);
    setOnSuccessCallback(() => (typeof callback === 'function' ? callback : null));
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalNotice('');
    setOnSuccessCallback(null);
  };

  const requireAuth = (callback, { tab = 'signup', notice = 'Please sign up or log in to continue.' } = {}) => {
    if (user && token) {
      if (typeof callback === 'function') callback(user);
      return true;
    }
    openAuthModal(tab, notice, callback);
    return false;
  };

  const signup = async ({ name, phone, email, password, avatarUrl, topics }) => {
    const res = await communityService.signUp({ name, phone, email, password, avatarUrl, topics });
    if (res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        token: res.token,
        tokenExpiresAt: res.tokenExpiresAt,
        user: res.user
      }));
      // Also update visitorId and profile for seamless like/save integration
      communityService.setVisitorProfile({
        name: res.user.name,
        email: res.user.email || '',
        avatar: res.user.avatarUrl || ''
      });
      closeAuthModal();

      if (onSuccessCallback) {
        try {
          onSuccessCallback(res.user);
        } catch (cbErr) {
          console.error('Error executing post-auth callback:', cbErr);
        }
        setOnSuccessCallback(null);
      }
      return res.user;
    }
    throw new Error('Could not create account.');
  };

  const login = async ({ identifier, password }) => {
    const res = await communityService.login({ identifier, password });
    if (res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        token: res.token,
        tokenExpiresAt: res.tokenExpiresAt,
        user: res.user
      }));
      // Sync visitor profile
      communityService.setVisitorProfile({
        name: res.user.name,
        email: res.user.email || '',
        avatar: res.user.avatarUrl || ''
      });
      closeAuthModal();

      if (onSuccessCallback) {
        try {
          onSuccessCallback(res.user);
        } catch (cbErr) {
          console.error('Error executing post-auth callback:', cbErr);
        }
        setOnSuccessCallback(null);
      }
      return res.user;
    }
    throw new Error('Authentication failed.');
  };

  const logout = async () => {
    if (token) {
      await communityService.logout(token);
    }
    handleClearSession();
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...session,
          user: updatedUser
        }));
      } catch (_) {}
    }
  };

  return (
    <CommunityAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        isAuthModalOpen,
        authModalInitialTab,
        authModalNotice,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        signup,
        login,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </CommunityAuthContext.Provider>
  );
}

export function useCommunityAuth() {
  const context = useContext(CommunityAuthContext);
  if (!context) {
    throw new Error('useCommunityAuth must be used within a CommunityAuthProvider');
  }
  return context;
}
