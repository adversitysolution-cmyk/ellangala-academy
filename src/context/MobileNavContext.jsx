import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MobileNavContext = createContext({
  isOpen: false,
  openMobileNav: () => {},
  closeMobileNav: () => {},
  toggleMobileNav: () => {},
});

export function MobileNavProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const openMobileNav = () => setIsOpen(true);
  const closeMobileNav = () => setIsOpen(false);
  const toggleMobileNav = () => setIsOpen((prev) => !prev);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle body lock, Escape key, and focus return to toggle button
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('locked');
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          const toggler = document.querySelector('.mobile-nav__toggler');
          if (toggler && typeof toggler.focus === 'function') {
            setTimeout(() => toggler.focus(), 50);
          }
        }
      };
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.classList.remove('locked');
        document.removeEventListener('keydown', onKeyDown);
      };
    } else {
      document.body.classList.remove('locked');
    }
    return () => {
      document.body.classList.remove('locked');
    };
  }, [isOpen]);

  return (
    <MobileNavContext.Provider
      value={{ isOpen, openMobileNav, closeMobileNav, toggleMobileNav }}
    >
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  return useContext(MobileNavContext);
}
