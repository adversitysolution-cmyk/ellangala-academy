import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  FileText,
  ShoppingBag,
  BookOpen,
  TicketPercent,
  LogOut,
  X
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminSidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAdminAuth();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Enrollments', icon: ClipboardList, path: '/admin/enrollments' },
    { label: 'Events', icon: CalendarDays, path: '/admin/events' },
    { label: 'Blogs / Insights', icon: FileText, path: '/admin/blogs' },
    { label: 'Products', icon: BookOpen, path: '/admin/products' },
    { label: 'Coupons', icon: TicketPercent, path: '/admin/coupons' },
    { label: 'Book Orders', icon: ShoppingBag, path: '/admin/orders' }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        {/* Brand Area */}
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-logo">
            <span style={{ fontSize: '18px', fontWeight: '800' }}>E</span>
          </div>
          <div>
            <div className="admin-sidebar__brand-title">ELLANGALA’S ACADEMY</div>
            <div className="admin-sidebar__brand-subtitle">ADMIN PORTAL</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="d-lg-none"
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              marginLeft: 'auto',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="admin-sidebar__nav">
          <div>
            <div className="admin-sidebar__section-label">OPERATIONS</div>
            <div className="admin-sidebar__group">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `admin-sidebar__link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon size={19} className="admin-sidebar__icon" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer Profile & Logout Area */}
      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user-box">
          <div className="admin-sidebar__avatar">AA</div>
          <div>
            <div className="admin-sidebar__user-name">{currentUser?.name || 'Administrator'}</div>
            <div className="admin-sidebar__user-role">Academy Operations</div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          title="Logout of Admin"
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '700',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
