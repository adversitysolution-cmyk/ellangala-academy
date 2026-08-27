import React, { createContext, useContext, useState } from 'react';
import { adminAuthService } from '../services/adminAuthService';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => adminAuthService.isLoggedIn());
  const [currentUser, setCurrentUser] = useState(() => adminAuthService.getCurrentUser());

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

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
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
