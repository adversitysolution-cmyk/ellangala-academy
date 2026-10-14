import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Camera, Bell } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminNotificationService } from '../services/adminNotificationService';
import AdminProfileModal from './AdminProfileModal';

export default function AdminHeader({ title, action, onToggleSidebar }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAdminAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const count = await adminNotificationService.getUnreadCount();
        if (isMounted) setUnreadCount(count);
      } catch {}
    };

    fetchUnread();
    const timer = setInterval(fetchUnread, 15000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const initials = (currentUser?.name || 'Administrator')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AA';

  return (
    <>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: action ? '1px solid #E5E7EB' : 'none' }}>
            {/* Notifications Bell Button */}
            <button
              type="button"
              onClick={() => navigate('/admin/notifications')}
              title={`Website Notifications & Updates (${unreadCount} unread)`}
              style={{
                position: 'relative',
                background: unreadCount > 0 ? '#EFF6FF' : '#F8FAFC',
                border: unreadCount > 0 ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                color: unreadCount > 0 ? '#2563EB' : '#64748B',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
                e.currentTarget.style.color = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = unreadCount > 0 ? '#EFF6FF' : '#F8FAFC';
                e.currentTarget.style.color = unreadCount > 0 ? '#2563EB' : '#64748B';
              }}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '800',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 4px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              title="Click to update profile photo & details"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ position: 'relative' }}>
                {currentUser?.avatar && !imgError ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser?.name || 'Admin'}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #CA8A38',
                      boxShadow: '0 2px 6px rgba(8, 35, 73, 0.12)',
                      display: 'block'
                    }}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
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
                    {initials}
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#CA8A38',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFFFFF'
                  }}
                  title="Update photo"
                >
                  <Camera size={9} />
                </div>
              </div>

              <div className="d-none d-sm-block">
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0A2347', lineHeight: '1.2' }}>
                  {currentUser?.name || 'Academy Administrator'}
                </div>
                <div style={{ fontSize: '11px', color: '#CA8A38', fontWeight: '700' }}>
                  {currentUser?.role || 'Administrator'} • <span style={{ textDecoration: 'underline', color: '#667085', fontWeight: '500' }}>Edit</span>
                </div>
              </div>
            </button>

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

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
