import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../styles/admin.css';

export default function AdminLayout({ title, subtitle, action, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminHeader title={title} action={action} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="admin-content">
          {subtitle && (
            <div className="admin-page-header">
              <div>
                <h2 className="admin-page-title">{title}</h2>
                {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
              </div>
              {action && <div>{action}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
