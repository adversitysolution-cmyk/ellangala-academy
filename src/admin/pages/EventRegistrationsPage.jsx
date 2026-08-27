import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { eventService } from '../../features/events/services/eventService';
import { enrollmentService } from '../services/enrollmentService';
import { ArrowLeft, Download, Users, Calendar, MapPin, Search, CheckCircle } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

export default function EventRegistrationsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const evt = eventService.getEventById(id);
    setEvent(evt);

    if (evt) {
      const allEnrollments = await enrollmentService.getEnrollments();
      const eventRegs = allEnrollments.filter(
        (item) =>
          String(item.eventId) === String(evt.id) ||
          item.sourceType === 'Event' && (
            (item.eventTitle && item.eventTitle.toLowerCase() === evt.title.toLowerCase()) ||
            (item.interest && item.interest.toLowerCase() === evt.title.toLowerCase())
          )
      );
      setRegistrations(eventRegs);
    }
  };

  if (!event) {
    return (
      <AdminLayout title="Event Registrations" subtitle="Event not found">
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
          <h3>Event Not Found</h3>
          <p style={{ color: '#64748B', margin: '12px 0 20px' }}>The requested event ID could not be found.</p>
          <Link to="/admin/events" className="thm-btn">Back to All Events</Link>
        </div>
      </AdminLayout>
    );
  }

  const filtered = registrations.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      (r.fullName || '').toLowerCase().includes(q) ||
      (r.phone || '').toLowerCase().includes(q) ||
      (r.email || '').toLowerCase().includes(q) ||
      (r.city || '').toLowerCase().includes(q)
    );
  });

  const totalAttendeesCount = registrations.reduce(
    (sum, item) => sum + (Number(item.attendeesCount) || 1),
    0
  );

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Registration ID', 'Full Name', 'Phone', 'Email', 'City', 'Seats/Attendees', 'Message', 'Status', 'Submitted At'];
    const rows = filtered.map(r => [
      r.id,
      `"${r.fullName}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.city}"`,
      r.attendeesCount || 1,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      r.status || 'Confirmed',
      r.submittedAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Event_Attendees_${event.slug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (regId, newStatus) => {
    await enrollmentService.updateEnrollmentStatus(regId, newStatus);
    loadData();
  };

  return (
    <AdminLayout title={`Registrations: ${event.title}`} subtitle={`Event ID: ${event.id} • ${event.date} • ${event.mode}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Link
            to="/admin/events"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#64748B',
              fontWeight: '700',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Events</span>
          </Link>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            style={{
              backgroundColor: '#0F231B',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              border: 'none',
              cursor: filtered.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              opacity: filtered.length === 0 ? 0.6 : 1
            }}
          >
            <Download size={16} />
            <span>Export Attendee List (CSV)</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <StatCard
            title="Total Registered People"
            value={totalAttendeesCount}
            icon={Users}
            color="#CA8A38"
            bgColor="#FAF5EC"
          />
          <StatCard
            title="Registration Forms"
            value={registrations.length}
            icon={CheckCircle}
            color="#2563EB"
            bgColor="#EFF6FF"
          />
          <StatCard
            title="Seating Capacity"
            value={event.capacity ? `${totalAttendeesCount} / ${event.capacity}` : 'Unlimited'}
            icon={Calendar}
            color="#059669"
            bgColor="#ECFDF5"
          />
        </div>

        {/* Search Bar */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '16px 20px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={18} style={{ color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search registered attendee name, phone, email or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px' }}
          />
        </div>

        {/* Registered People Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F231B', margin: 0 }}>
              Registered Attendees List ({filtered.length})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Attendee Name</th>
                  <th style={{ padding: '14px 16px' }}>Phone &amp; Email</th>
                  <th style={{ padding: '14px 16px' }}>City</th>
                  <th style={{ padding: '14px 16px' }}>Seats</th>
                  <th style={{ padding: '14px 16px' }}>Submitted Date</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
                      No registered attendees found for this event.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0F231B' }}>
                        {item.fullName}
                        {item.message && (
                          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '400', marginTop: '2px' }}>
                            "{item.message}"
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#334155' }}>{item.phone}</div>
                        <div style={{ fontSize: '12.5px', color: '#64748B' }}>{item.email}</div>
                      </td>
                      <td style={{ padding: '16px', color: '#334155', fontWeight: '600' }}>
                        {item.city || '-'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ backgroundColor: '#FAF5EC', color: '#CA8A38', padding: '4px 10px', borderRadius: '12px', fontSize: '12.5px', fontWeight: '800' }}>
                          {item.attendeesCount || 1} Seat(s)
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#64748B' }}>
                        {formatDate(item.submittedAt)}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={item.status || 'Confirmed'}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Attended">Attended</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
