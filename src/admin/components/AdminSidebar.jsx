import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  ShoppingBag,
  BookOpen,
  TicketPercent,
  Award,
  MessageSquareShare,
  LogOut,
  X,
  Camera,
  Bell
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import AdminProfileModal from './AdminProfileModal';

export default function AdminSidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAdminAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const initials = (currentUser?.name || 'Administrator')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AA';

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { label: 'Enrollments', icon: ClipboardList, path: '/admin/enrollments' },
    { label: 'Events', icon: CalendarDays, path: '/admin/events' },
    { label: 'Certificate Templates', icon: Award, path: '/admin/certificate-templates' },
    { label: 'Feed', icon: MessageSquareShare, path: '/admin/feed' },
    { label: 'Products', icon: BookOpen, path: '/admin/products' },
    { label: 'Coupons', icon: TicketPercent, path: '/admin/coupons' },
    { label: 'Book Orders', icon: ShoppingBag, path: '/admin/orders' }
  ];

  return (
    <>
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
          <div
            className="admin-sidebar__user-box"
            onClick={() => setIsProfileModalOpen(true)}
            style={{ cursor: 'pointer', flex: 1, marginRight: '8px' }}
            title="Click to update admin photo & details"
          >
            <div style={{ position: 'relative' }}>
              {currentUser?.avatar && !imgError ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser?.name || 'Admin'}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #CA8A38',
                    display: 'block'
                  }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="admin-sidebar__avatar">{initials}</div>
              )}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#CA8A38',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #082349'
                }}
              >
                <Camera size={8} />
              </div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="admin-sidebar__user-name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser?.name || 'Administrator'}
              </div>
              <div className="admin-sidebar__user-role">
                {currentUser?.role || 'Academy Operations'}
              </div>
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

      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
