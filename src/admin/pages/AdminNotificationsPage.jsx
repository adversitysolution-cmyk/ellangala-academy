import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import { adminNotificationService } from '../services/adminNotificationService';
import {
  Bell,
  CheckCheck,
  Trash2,
  UserPlus,
  Heart,
  MessageSquare,
  GraduationCap,
  ShoppingBag,
  Mail,
  ExternalLink,
  Clock,
  Search,
  Check,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'likes_comments' | 'registrations' | 'orders_enrollments' | 'contact'
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await adminNotificationService.getNotifications({
        type: activeTab,
        unreadOnly,
        limit: 100
      });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Error loading admin notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [activeTab, unreadOnly]);

  const showToast = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await adminNotificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      showToast('Notification marked as read.');
    } catch (err) {
      alert(err.message || 'Error marking as read.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await adminNotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showToast('All notifications marked as read.');
    } catch (err) {
      alert(err.message || 'Error marking all as read.');
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await adminNotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast('Notification deleted.');
    } catch (err) {
      alert(err.message || 'Error deleting notification.');
    }
  };

  const handleClearRead = async () => {
    if (!window.confirm('Are you sure you want to clear all read notifications?')) return;
    try {
      await adminNotificationService.clearRead();
      setNotifications(prev => prev.filter(n => !n.isRead));
      showToast('Cleared all read notifications.');
    } catch (err) {
      alert(err.message || 'Error clearing read notifications.');
    }
  };

  const handleNavigate = (targetUrl, notif) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }
    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  const formatTimestamp = (iso) => {
    if (!iso) return 'Recently';
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'user_register':
        return {
          icon: <UserPlus size={16} color="#059669" />,
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#059669',
          label: 'User Registered'
        };
      case 'comment':
        return {
          icon: <MessageSquare size={16} color="#2563EB" />,
          bg: '#EFF6FF',
          border: '#BFDBFE',
          text: '#2563EB',
          label: 'New Comment'
        };
      case 'like':
        return {
          icon: <Heart size={16} color="#E11D48" />,
          bg: '#FFF1F2',
          border: '#FECDD3',
          text: '#E11D48',
          label: 'Post Liked'
        };
      case 'enrollment':
        return {
          icon: <GraduationCap size={16} color="#7C3AED" />,
          bg: '#F5F3FF',
          border: '#DDD6FE',
          text: '#7C3AED',
          label: 'Workshop Enrollment'
        };
      case 'order':
        return {
          icon: <ShoppingBag size={16} color="#D97706" />,
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#D97706',
          label: 'Book Order'
        };
      case 'contact':
        return {
          icon: <Mail size={16} color="#0284C7" />,
          bg: '#F0F9FF',
          border: '#BAE6FD',
          text: '#0284C7',
          label: 'Inquiry'
        };
      default:
        return {
          icon: <Bell size={16} color="#64748B" />,
          bg: '#F1F5F9',
          border: '#E2E8F0',
          text: '#475569',
          label: 'Notification'
        };
    }
  };

  // Filtered by search query
  const filteredNotifications = notifications.filter(n => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.message?.toLowerCase().includes(q) ||
      n.authorName?.toLowerCase().includes(q) ||
      n.authorEmail?.toLowerCase().includes(q)
    );
  });

  // Calculate metrics
  const totalCount = notifications.length;
  const likesCommentsCount = notifications.filter(n => n.type === 'like' || n.type === 'comment').length;
  const registrationsCount = notifications.filter(n => n.type === 'user_register').length;
  const ordersEnrollmentsCount = notifications.filter(n => n.type === 'order' || n.type === 'enrollment').length;

  return (
    <AdminLayout
      title="Notifications"
      action={
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={loadNotifications}
            className="admin-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#475569',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
            title="Refresh notifications"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="admin-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: unreadCount > 0 ? '#EFF6FF' : '#F8FAFC',
              border: '1px solid #BFDBFE',
              color: unreadCount > 0 ? '#2563EB' : '#94A3B8',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: unreadCount > 0 ? 'pointer' : 'not-allowed',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <CheckCheck size={16} />
            <span>Mark All Read</span>
          </button>
          <button
            type="button"
            onClick={handleClearRead}
            className="admin-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <Trash2 size={15} />
            <span>Clear Read</span>
          </button>
        </div>
      }
    >
      {/* Toast Notification Banner */}
      {actionSuccessMsg && (
        <div style={{
          marginBottom: '16px',
          padding: '10px 16px',
          borderRadius: '8px',
          background: '#DCFCE7',
          color: '#15803D',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
        }}>
          <Check size={16} />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Unread Activity"
          value={unreadCount}
          icon={Bell}
          color="#DC2626"
          subtitle="Awaiting your review"
        />
        <StatCard
          title="Likes & Comments"
          value={likesCommentsCount}
          icon={MessageSquare}
          color="#2563EB"
          subtitle="Feed & workshop engagement"
        />
        <StatCard
          title="Member Registrations"
          value={registrationsCount}
          icon={UserPlus}
          color="#059669"
          subtitle="New seekers & students"
        />
        <StatCard
          title="Orders & Enrollments"
          value={ordersEnrollmentsCount}
          icon={ShoppingBag}
          color="#CA8A38"
          subtitle="Purchases & workshop seats"
        />
      </div>

      {/* Main Container */}
      <div className="admin-card">
        {/* Navigation Tabs & Search Controls */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Updates', icon: Sparkles },
              { id: 'likes_comments', label: 'Likes & Comments', icon: MessageSquare },
              { id: 'registrations', label: 'User Registrations', icon: UserPlus },
              { id: 'orders_enrollments', label: 'Orders & Enrollments', icon: ShoppingBag },
              { id: 'contact', label: 'Inquiries', icon: Mail }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '500',
                    border: isActive ? '1px solid #082349' : '1px solid #E2E8F0',
                    background: isActive ? '#082349' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Unread Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: '500',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                style={{ cursor: 'pointer', width: '15px', height: '15px' }}
              />
              <span>Unread Only ({unreadCount})</span>
            </label>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '6px 12px'
            }}>
              <Search size={15} color="#94A3B8" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search updates..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#1E293B',
                  width: '160px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Notifications Feed */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B', fontSize: '14px' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px', display: 'block', color: '#CA8A38' }} />
            <span>Fetching latest updates from across the website...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#F8FAFC',
            borderRadius: '12px',
            border: '1px dashed #CBD5E1',
            color: '#64748B'
          }}>
            <Bell size={36} style={{ color: '#94A3B8', marginBottom: '10px' }} />
            <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>
              No Notifications Found
            </h4>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {unreadOnly
                ? "You're all caught up! There are no unread updates right now."
                : 'No activities match your current search and filter settings.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map(notif => {
              const badge = getTypeBadge(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNavigate(notif.targetUrl, notif)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: notif.isRead ? '1px solid #E2E8F0' : '1px solid #BFDBFE',
                    background: notif.isRead ? '#FFFFFF' : '#F0F7FF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: notif.isRead ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = notif.isRead ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.06)';
                  }}
                >
                  {/* Left: Icon + Text Content */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
                    {/* Badge Icon */}
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {badge.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`
                        }}>
                          {badge.label}
                        </span>

                        <h4 style={{
                          margin: 0,
                          fontSize: '14px',
                          fontWeight: notif.isRead ? '600' : '700',
                          color: '#0F172A'
                        }}>
                          {notif.title}
                        </h4>

                        {!notif.isRead && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#2563EB',
                            display: 'inline-block'
                          }} />
                        )}
                      </div>

                      <p style={{
                        margin: '0 0 8px 0',
                        fontSize: '13px',
                        color: '#334155',
                        lineHeight: '1.5'
                      }}>
                        {notif.message}
                      </p>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        fontSize: '12px',
                        color: '#64748B'
                      }}>
                        {notif.authorName && (
                          <span>
                            By: <strong style={{ color: '#0F172A' }}>{notif.authorName}</strong>
                            {notif.authorEmail && ` (${notif.authorEmail})`}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {formatTimestamp(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {notif.targetUrl && (
                      <button
                        type="button"
                        onClick={() => handleNavigate(notif.targetUrl, notif)}
                        className="admin-btn"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#F1F5F9',
                          border: 'none',
                          color: '#2563EB',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        title="View details in section"
                      >
                        <span>Open</span>
                        <ArrowRight size={13} />
                      </button>
                    )}

                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#059669',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDelete(notif.id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                      title="Delete notification"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
