import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import { enrollmentService } from '../services/enrollmentService';
import { ClipboardList, MessageSquare, Clock, CheckCircle, Search, Download, Eye, CheckSquare } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function EnrollmentListPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabFilter, setTabFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setEnrollments(await enrollmentService.getEnrollments());
  };

  const handleStatusChange = async (id, newStatus) => {
    await enrollmentService.updateEnrollmentStatus(id, newStatus);
    loadData();
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'City', 'Interest/Program', 'Type', 'Status', 'Submitted At'];
    const rows = filtered.map(r => [
      r.id,
      `"${r.fullName}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.city}"`,
      `"${r.interest || r.program}"`,
      r.type || r.sourceType || 'General',
      r.status,
      r.submittedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Enrollments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = enrollments.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (item.fullName || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.interest || item.program || '').toLowerCase().includes(q);

    const matchesTab =
      tabFilter === 'All' || item.status.toLowerCase() === tabFilter.toLowerCase();

    const matchesType =
      typeFilter === 'All' || (item.type || item.sourceType || '').toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesTab && matchesType;
  });

  const exportButton = (
    <button
      type="button"
      onClick={handleExportCSV}
      className="btn-primary-gold"
    >
      <Download size={16} />
      <span>EXPORT CSV</span>
    </button>
  );

  return (
    <AdminLayout
      title="Enrollments"
      subtitle="Manage workshop, mentoring, MindGym and event enquiries."
      action={exportButton}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* KPI Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <StatCard
            title="Total Enrollments"
            value={enrollments.length}
            icon={ClipboardList}
            color="#CA8A38"
            bgColor="#FFF7E8"
          />
          <StatCard
            title="New Enquiries"
            value={enrollments.filter(e => e.status === 'New').length}
            icon={MessageSquare}
            color="#2563EB"
            bgColor="#EFF6FF"
          />
          <StatCard
            title="Follow-Up"
            value={enrollments.filter(e => e.status === 'Follow-Up').length}
            icon={Clock}
            color="#8B5CF6"
            bgColor="#F3E8FF"
          />
          <StatCard
            title="Enrolled"
            value={enrollments.filter(e => e.status === 'Enrolled').length}
            icon={CheckCircle}
            color="#059669"
            bgColor="#ECFDF5"
          />
        </div>

        {/* Main Enrollments Card */}
        <div className="admin-card">
          <div className="admin-card__header">
            <div>
              <h3 className="admin-card__title">Enquiry List</h3>
              <p style={{ fontSize: '13px', color: '#667085', margin: '2px 0 0' }}>View and manage student and participant enquiries.</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#FFF7E8', color: '#CA8A38', padding: '4px 12px', borderRadius: '12px' }}>
              {filtered.length} Entries
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
                placeholder="Search by name, phone, email or program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>

            {/* Quick Filter Tabs */}
            <div className="admin-tabs">
              {['All', 'New', 'Contacted', 'Follow-Up', 'Enrolled', 'Closed'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTabFilter(tab)}
                  className={`admin-tab-btn ${tabFilter === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Secondary Type Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="admin-select"
                style={{ width: 'auto', height: '38px', fontSize: '13px' }}
              >
                <option value="All">Type: All</option>
                <option value="workshop">Workshop</option>
                <option value="mentoring">Mentoring</option>
                <option value="event">Event</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Person</th>
                    <th>Interest</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: '#667085' }}>
                        No enrollment requests found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ fontWeight: '700', color: '#0A2347' }}>{item.fullName}</div>
                          <div style={{ fontSize: '12.5px', color: '#667085' }}>{item.phone} • {item.email}</div>
                        </td>
                        <td style={{ fontWeight: '600', color: '#334155' }}>
                          {item.interest || item.program}
                        </td>
                        <td>
                          <span style={{ backgroundColor: '#FAF8F3', color: '#0A2347', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', border: '1px solid #E5E7EB' }}>
                            {item.type || item.sourceType || 'Workshop'}
                          </span>
                        </td>
                        <td style={{ fontSize: '12.5px', color: '#667085' }}>
                          {formatDate(item.submittedAt)}
                        </td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <ActionMenu
                            items={[
                              { label: 'View Details', icon: Eye, to: `/admin/enrollments/${item.id}` },
                              { divider: true },
                              { label: 'Mark Contacted', icon: CheckSquare, onClick: () => handleStatusChange(item.id, 'Contacted') },
                              { label: 'Mark Follow-Up', icon: Clock, onClick: () => handleStatusChange(item.id, 'Follow-Up') },
                              { label: 'Mark Enrolled', icon: CheckCircle, onClick: () => handleStatusChange(item.id, 'Enrolled') },
                              { label: 'Close Enquiry', icon: CheckSquare, danger: true, onClick: () => handleStatusChange(item.id, 'Closed') }
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
