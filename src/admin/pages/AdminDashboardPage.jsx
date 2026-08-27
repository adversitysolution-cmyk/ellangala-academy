import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { enrollmentService } from '../services/enrollmentService';
import { orderService } from '../services/orderService';
import { eventService } from '../../features/events/services/eventService';
import { ClipboardList, MessageSquare, ShoppingBag, CalendarDays, ArrowRight, MapPin } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatMonthDay(dateStr) {
  if (!dateStr) return { month: 'JAN', day: '01' };
  try {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.toLocaleDateString('en-US', { day: '2-digit' })
    };
  } catch {
    return { month: 'EVENT', day: '01' };
  }
}

export default function AdminDashboardPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    enrollmentService.getEnrollments().then(setEnrollments).catch(() => {});
    orderService.getOrders().then(setOrders).catch(() => {});
    eventService.getEvents().then(setEvents).catch(() => {});
  }, []);

  const newEnquiriesCount = enrollments.filter(e => e.status === 'New').length;
  const upcomingEvents = events.filter(e => e.date >= new Date().toISOString().split('T')[0] && e.status !== 'completed');

  return (
    <AdminLayout
      title="Good Evening, Administrator"
      subtitle="Here’s what’s happening at Ellangala’s Academy today."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* 4 Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <StatCard
            title="Total Enrollments"
            value={enrollments.length}
            icon={ClipboardList}
            color="#CA8A38"
            bgColor="#FFF7E8"
          />
          <StatCard
            title="New Enquiries"
            value={newEnquiriesCount}
            icon={MessageSquare}
            color="#2563EB"
            bgColor="#EFF6FF"
          />
          <StatCard
            title="Book Orders"
            value={orders.length}
            icon={ShoppingBag}
            color="#059669"
            bgColor="#ECFDF5"
          />
          <StatCard
            title="Upcoming Events"
            value={upcomingEvents.length}
            icon={CalendarDays}
            color="#8B5CF6"
            bgColor="#F3E8FF"
          />
        </div>

        {/* 2-Column Main Dashboard Layout */}
        <div className="row gy-4">
          {/* Left: Recent Enrollments */}
          <div className="col-lg-7">
            <div className="admin-card" style={{ height: '100%' }}>
              <div className="admin-card__header">
                <h3 className="admin-card__title">Recent Enrollments</h3>
                <Link
                  to="/admin/enrollments"
                  style={{ fontSize: '13px', fontWeight: '700', color: '#CA8A38', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>View All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Interest</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.slice(0, 5).map((e) => (
                      <tr key={e.id}>
                        <td>
                          <div style={{ fontWeight: '700', color: '#0A2347' }}>{e.fullName}</div>
                          <div style={{ fontSize: '12px', color: '#667085' }}>{e.phone}</div>
                        </td>
                        <td style={{ fontWeight: '600', color: '#334155' }}>{e.interest}</td>
                        <td>
                          <StatusBadge status={e.status} />
                        </td>
                        <td style={{ fontSize: '12.5px', color: '#667085' }}>{formatDate(e.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Upcoming Events */}
          <div className="col-lg-5">
            <div className="admin-card" style={{ height: '100%' }}>
              <div className="admin-card__header">
                <h3 className="admin-card__title">Upcoming Events</h3>
                <Link
                  to="/admin/events"
                  style={{ fontSize: '13px', fontWeight: '700', color: '#CA8A38', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>View All Events</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {upcomingEvents.length === 0 ? (
                  <p style={{ color: '#667085', fontSize: '14px', margin: 0 }}>No upcoming events scheduled.</p>
                ) : (
                  upcomingEvents.slice(0, 3).map((evt) => {
                    const dateInfo = formatMonthDay(evt.date);
                    return (
                      <div
                        key={evt.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '14px',
                          borderRadius: '10px',
                          backgroundColor: '#FAF8F3',
                          border: '1px solid #E5E7EB'
                        }}
                      >
                        {/* Date Block */}
                        <div
                          style={{
                            width: '48px',
                            height: '52px',
                            borderRadius: '8px',
                            backgroundColor: '#082349',
                            color: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <span style={{ fontSize: '10px', fontWeight: '800', color: '#CA8A38', letterSpacing: '0.5px' }}>{dateInfo.month}</span>
                          <span style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1 }}>{dateInfo.day}</span>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link
                            to={`/admin/events/${evt.id}/edit`}
                            style={{ fontSize: '14px', fontWeight: '700', color: '#0A2347', textDecoration: 'none', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                          >
                            {evt.title}
                          </Link>
                          <div style={{ fontSize: '12px', color: '#667085', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} style={{ color: '#CA8A38' }} />
                            <span>{evt.mode === 'Online' ? 'Online' : `${evt.venue}, ${evt.city}`}</span>
                          </div>
                        </div>

                        <StatusBadge status={evt.status} />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Recent Book Orders */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Recent Book Orders</h3>
            <Link
              to="/admin/orders"
              style={{ fontSize: '13px', fontWeight: '700', color: '#CA8A38', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All Orders</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: '700', color: '#0A2347' }}>
                      {o.id}
                      <div style={{ fontSize: '12px', color: '#667085', fontWeight: '400' }}>{formatDate(o.createdAt)}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#334155' }}>{o.customerName}</div>
                      <div style={{ fontSize: '12px', color: '#667085' }}>{o.phone}</div>
                    </td>
                    <td style={{ fontWeight: '800', color: '#0A2347' }}>₹{o.totalAmount}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
