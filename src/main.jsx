import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import AppRouter from './app/router';
import './assets/css/global-responsive.css';

// Recover automatically if a user with an open tab navigates to a lazy chunk invalidated by a new deploy
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    try {
      const guardKey = `vite_reload_${window.location.pathname}`;
      const last = Number(sessionStorage.getItem(guardKey) || '0');
      if (Date.now() - last > 15000) {
        sessionStorage.setItem(guardKey, String(Date.now()));
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </HelmetProvider>
  </React.StrictMode>
);
