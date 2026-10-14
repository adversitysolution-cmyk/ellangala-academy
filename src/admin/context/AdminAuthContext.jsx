import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthService } from '../services/adminAuthService';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => adminAuthService.isLoggedIn());
  const [currentUser, setCurrentUser] = useState(() => adminAuthService.getCurrentUser());

  useEffect(() => {
    if (isAuthenticated) {
      adminAuthService.getProfile().then(p => {
        if (p) setCurrentUser(p);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const login = async (email, password, remember = true) => {
    const res = await adminAuthService.login(email, password, remember);
    if (res.success) {
      setIsAuthenticated(true);
      setCurrentUser(res.session.user);
    }
    return res;
  };

  const logout = () => {
    adminAuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const updateProfile = async (partial) => {
    const updated = await adminAuthService.updateProfile(partial);
    setCurrentUser(updated);
    return updated;
  };

  const uploadAvatar = async (file) => {
    const res = await adminAuthService.uploadAvatar(file);
    if (res.profile) {
      setCurrentUser(res.profile);
    }
    return res;
  };

  const deleteAvatar = async () => {
    const res = await adminAuthService.deleteAvatar();
    if (res.profile) {
      setCurrentUser(res.profile);
    }
    return res;
  };

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      setCurrentUser,
      login,
      logout,
      updateProfile,
      uploadAvatar,
      deleteAvatar
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
