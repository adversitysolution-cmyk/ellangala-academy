import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import { eventService } from '../../features/events/services/eventService';
import { enrollmentService } from '../services/enrollmentService';
import { EVENT_CATEGORIES } from '../../features/events/data/eventSeedData';
import {
  Plus,
  Search,
  CalendarDays,
  Clock,
  CheckCircle,
  Users,
  Eye,
  Edit,
  Power,
  Copy,
  Trash2,
  Award,
  AlertTriangle
} from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function EventListPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [tabFilter, setTabFilter] = useState('All'); // All, Upcoming, Past, Drafts
  const [statusFilter, setStatusFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [deleteModalId, setDeleteModalId] = useState(null);

  const loadEvents = () => {
    eventService.getEvents().then(setEvents).catch(() => {});
    enrollmentService.getEnrollments().then(setEnrollments).catch(() => {});
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const getRegistrationCount = (eventId, eventTitle) => {
    const matched = enrollments.filter(
      (item) =>
        String(item.eventId) === String(eventId) ||
        (item.sourceType === 'Event' && item.eventTitle && item.eventTitle.toLowerCase() === (eventTitle || '').toLowerCase())
    );
    return matched.reduce((sum, item) => sum + (Number(item.attendeesCount) || 1), 0);
  };

  const totalRegistrationsAllEvents = events.reduce((sum, evt) => sum + getRegistrationCount(evt.id, evt.title), 0);
  const upcomingCount = events.filter(evt => evt.date >= today && evt.status !== 'completed').length;
  const publishedCount = events.filter(evt => evt.status === 'published').length;

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.city && evt.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (evt.venue && evt.venue.toLowerCase().includes(searchQuery.toLowerCase()));

    // Tab Filter Logic
    let matchesTab = true;
    if (tabFilter === 'Upcoming') {
      matchesTab = evt.date >= today && evt.status !== 'completed';
    } else if (tabFilter === 'Past') {
      matchesTab = evt.date < today || evt.status === 'completed';
    } else if (tabFilter === 'Drafts') {
      matchesTab = evt.status === 'draft';
    }

    const matchesStatus =
      statusFilter === 'All' || evt.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesMode =
      modeFilter === 'All' || evt.mode.toLowerCase() === modeFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === 'All' || evt.category === categoryFilter;

    return matchesSearch && matchesTab && matchesStatus && matchesMode && matchesCategory;
  });

  const handleTogglePublish = async (evt) => {
    if (evt.status === 'published') {
      await eventService.unpublishEvent(evt.id);
    } else {
      await eventService.publishEvent(evt.id);
    }
    loadEvents();
  };

  const handleDuplicate = async (id) => {
    const dup = await eventService.duplicateEvent(id);
    if (dup) {
      loadEvents();
      navigate(`/admin/events/${dup.id}/edit`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModalId) {
      await eventService.deleteEvent(deleteModalId);
      setDeleteModalId(null);
      loadEvents();
    }
  };

  const primaryAddButton = (
    <Link to="/admin/events/new" className="btn-primary-gold">
      <Plus size={18} />
      <span>Add Event</span>
    </Link>
  );

  return (
    <AdminLayout
      title="Events"
      subtitle="Create, publish and manage workshops, MindGym sessions and Academy experiences."
      action={primaryAddButton}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* 4 Summary KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <StatCard
            title="Total Events"
            value={events.length}
            icon={CalendarDays}
            color="#CA8A38"
            bgColor="#FFF7E8"
          />
          <StatCard
            title="Upcoming"
            value={upcomingCount}
            icon={Clock}
            color="#8B5CF6"
            bgColor="#F3E8FF"
          />
          <StatCard
            title="Published"
            value={publishedCount}
            icon={CheckCircle}
            color="#059669"
            bgColor="#ECFDF5"
          />
          <StatCard
            title="Registrations"
            value={totalRegistrationsAllEvents}
            icon={Users}
            color="#2563EB"
            bgColor="#EFF6FF"
          />
        </div>

        {/* Event Management Card */}
        <div className="admin-card">
          <div className="admin-card__header">
            <div>
              <h3 className="admin-card__title">Event Management</h3>
              <p style={{ fontSize: '13px', color: '#667085', margin: '2px 0 0' }}>View and manage all Academy events.</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#FFF7E8', color: '#CA8A38', padding: '4px 12px', borderRadius: '12px' }}>
              {filteredEvents.length} Events
            </span>
          </div>

          <div className="admin-card__body">
            {/* Search Bar */}
            <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="text"
                placeholder="Search events by title, category, city or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>

            {/* Quick Filter Tabs */}
            <div className="admin-tabs">
              {['All', 'Upcoming', 'Past', 'Drafts'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTabFilter(tab)}
                  className={`admin-tab-btn ${tabFilter === tab ? 'active' : ''}`}
                >
                  {tab === 'All' ? 'All Events' : tab}
                </button>
              ))}
            </div>

            {/* Secondary Filter Controls */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="admin-select"
                style={{ width: 'auto', height: '38px', fontSize: '13px' }}
              >
                <option value="All">Category ▾</option>
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="admin-select"
                style={{ width: 'auto', height: '38px', fontSize: '13px' }}
              >
                <option value="All">Mode ▾</option>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-select"
                style={{ width: 'auto', height: '38px', fontSize: '13px' }}
              >
                <option value="All">Status ▾</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>

              {(categoryFilter !== 'All' || modeFilter !== 'All' || statusFilter !== 'All' || searchQuery || tabFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setTabFilter('All');
                    setCategoryFilter('All');
                    setModeFilter('All');
                    setStatusFilter('All');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px 20px', textAlign: 'center', color: '#667085' }}>
                        No events found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt) => {
                      const regCount = getRegistrationCount(evt.id, evt.title);
                      return (
                        <tr key={evt.id}>
                          {/* Event Column */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#0A2347', flexShrink: 0 }}>
                                <img
                                  src={evt.image}
                                  alt={evt.title}
                                  onError={(e) => { e.currentTarget.src = '/assets/images/blog/blog-positive-psychology.png'; }}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                              <div>
                                <Link to={`/admin/events/${evt.id}/edit`} style={{ fontWeight: '700', color: '#0A2347', textDecoration: 'none', fontSize: '14.5px' }}>
                                  {evt.title}
                                </Link>
                                <div style={{ fontSize: '12px', color: '#667085', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span>{evt.id}</span>
                                  {evt.featured && (
                                    <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#FFF7E8', color: '#CA8A38', padding: '1px 6px', borderRadius: '4px' }}>
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td>
                            <div style={{ fontWeight: '700', color: '#0A2347', fontSize: '13.5px' }}>
                              {formatDate(evt.date)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#667085', marginTop: '2px' }}>
                              {evt.startTime} – {evt.endTime}
                            </div>
                          </td>

                          {/* Category */}
                          <td>
                            <span style={{ backgroundColor: '#FAF8F3', color: '#1E293B', padding: '4px 10px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '600', border: '1px solid #E5E7EB' }}>
                              {evt.category}
                            </span>
                          </td>

                          {/* Location */}
                          <td>
                            <div style={{ fontWeight: '600', color: '#0A2347', fontSize: '13px' }}>
                              {evt.mode === 'Online' ? 'Online Event' : evt.venue}
                            </div>
                            <div style={{ fontSize: '12px', color: '#667085' }}>
                              {evt.mode === 'Online' ? 'Virtual Session' : `${evt.city}${evt.mode === 'Hybrid' ? ' + Online' : ''}`}
                            </div>
                          </td>

                          {/* Registrations */}
                          <td>
                            <Link
                              to={`/admin/events/${evt.id}/registrations`}
                              style={{
                                fontSize: '12.5px',
                                fontWeight: '700',
                                color: regCount > 0 ? '#CA8A38' : '#667085',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <Users size={14} />
                              <span>{evt.capacity ? `${regCount} / ${evt.capacity}` : `${regCount} Registrations`}</span>
                            </Link>
                          </td>

                          {/* Status */}
                          <td>
                            <StatusBadge status={evt.status} />
                          </td>

                          {/* Actions Popover */}
                          <td style={{ textAlign: 'right' }}>
                            <ActionMenu
                              items={[
                                { label: 'View Event', icon: Eye, to: `/events/${evt.slug}`, target: '_blank' },
                                { label: 'Edit Event', icon: Edit, to: `/admin/events/${evt.id}/edit` },
                                { label: 'View Registrations', icon: Users, to: `/admin/events/${evt.id}/registrations` },
                                { label: 'Certificates', icon: Award, to: `/admin/events/${evt.id}/certificates` },
                                { divider: true },
                                {
                                  label: evt.status === 'published' ? 'Unpublish Event' : 'Publish Event',
                                  icon: Power,
                                  onClick: () => handleTogglePublish(evt)
                                },
                                { label: 'Duplicate Event', icon: Copy, onClick: () => handleDuplicate(evt.id) },
                                { divider: true },
                                { label: 'Delete Event', icon: Trash2, danger: true, onClick: () => setDeleteModalId(evt.id) }
                              ]}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div
          onClick={() => setDeleteModalId(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(8, 35, 73, 0.6)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#DC2626', marginBottom: '16px' }}>
              <AlertTriangle size={28} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0A2347' }}>Delete Event?</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#667085', lineHeight: '1.6', marginBottom: '24px' }}>
              This event will be permanently removed. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="btn-secondary-outline"
                onClick={() => setDeleteModalId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
