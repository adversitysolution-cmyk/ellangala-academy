import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminHeader({ title, action, onToggleSidebar }) {
  const { currentUser, logout } = useAdminAuth();

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="d-lg-none"
          style={{
            background: 'none',
            border: 'none',
            color: '#334155',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="admin-header__page-title">{title}</h1>
      </div>

      <div className="admin-header__actions">
        {action && <div>{action}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '16px', borderLeft: action ? '1px solid #E5E7EB' : 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#082349',
              color: '#CA8A38',
              fontSize: '13px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #CA8A38'
            }}
          >
            AA
          </div>
          <div className="d-none d-sm-block">
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0A2347', lineHeight: '1.2' }}>
              {currentUser?.name || 'Academy Administrator'}
            </div>
            <div style={{ fontSize: '11px', color: '#667085', fontWeight: '600' }}>
              Administrator
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Logout"
            style={{
              background: 'none',
              border: 'none',
              color: '#667085',
              cursor: 'pointer',
              marginLeft: '4px',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#667085')}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
