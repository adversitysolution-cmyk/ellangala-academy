import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../styles/admin.css';

export default function AdminLayout({ title, subtitle, action, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminHeader title={title} action={action} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
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
