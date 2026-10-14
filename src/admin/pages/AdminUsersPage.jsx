import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { adminUserService } from '../services/adminUserService';
import {
  Users,
  UserCheck,
  UserX,
  Sparkles,
  Search,
  Download,
  Printer,
  Calendar,
  ArrowUpDown,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  Phone,
  Mail,
  BookOpen,
  CalendarDays,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

function formatDate(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoStr;
  }
}

function formatDateTime(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoStr;
  }
}

function getInitials(name) {
  if (!name) return 'U';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, newCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive' | 'new'
  const [sortOption, setSortOption] = useState('newest'); // 'newest' | 'oldest' | 'name-asc' | 'name-desc'
  const [datePreset, setDatePreset] = useState('all'); // 'all' | 'today' | '7days' | '30days' | 'custom'
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [statusFilter, sortOption, datePreset, customFromDate, customToDate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      let fromDate = '';
      let toDate = '';
      const now = new Date();

      if (datePreset === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        fromDate = todayStr;
        toDate = todayStr;
      } else if (datePreset === '7days') {
        const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        fromDate = d.toISOString().split('T')[0];
      } else if (datePreset === '30days') {
        const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        fromDate = d.toISOString().split('T')[0];
      } else if (datePreset === 'custom') {
        fromDate = customFromDate;
        toDate = customToDate;
      }

      const res = await adminUserService.getUsers({
        status: statusFilter,
        search: searchQuery,
        sort: sortOption,
        fromDate,
        toDate
      });

      setUsers(res.users || []);
      setStats(res.stats || { total: 0, active: 0, inactive: 0, newCount: 0 });
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to fetch users list.');
    } finally {
      setLoading(false);
    }
  };

  // Client-side quick filter for instantaneous typing response
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const topics = Array.isArray(u.topics) ? u.topics.join(' ').toLowerCase() : '';
      return name.includes(q) || email.includes(q) || phone.includes(q) || topics.includes(q);
    });
  }, [users, searchQuery]);

  // Batch pagination configuration (15 users per batch)
  const USERS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when any search or filter parameter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortOption, datePreset, customFromDate, customToDate]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / USERS_PER_PAGE));

  // Keep currentPage within bounds if filteredUsers count decreases
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = Math.min(startIndex + USERS_PER_PAGE, totalUsers);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, startIndex, endIndex]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    // Smooth scroll table into view
    const tableEl = document.getElementById('admin-users-table-card');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleStatusToggle = async (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      setActionLoading(true);
      const res = await adminUserService.updateUserStatus(user.id, nextStatus);
      if (res.user) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: res.user.status } : u))
        );
        if (selectedUser?.id === user.id) {
          setSelectedUser((prev) => ({ ...prev, status: res.user.status }));
        }
        setStats((prev) => {
          const wasActive = user.status === 'active';
          return {
            ...prev,
            active: wasActive ? Math.max(0, prev.active - 1) : prev.active + 1,
            inactive: wasActive ? prev.inactive + 1 : Math.max(0, prev.inactive - 1)
          };
        });
      }
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to remove user "${user.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      setActionLoading(true);
      await adminUserService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
      }
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        active: user.status === 'active' ? Math.max(0, prev.active - 1) : prev.active,
        inactive: user.status === 'inactive' ? Math.max(0, prev.inactive - 1) : prev.inactive
      }));
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Export to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    if (filteredUsers.length === 0) {
      alert('No users available to export.');
      return;
    }

    const dataToExport = filteredUsers.map((u, idx) => ({
      'S.No': idx + 1,
      'User ID': u.id,
      'Full Name': u.name || '-',
      'Mobile Phone': u.phone || '-',
      'Email Address': u.email || '-',
      'Account Status': (u.status || 'active').toUpperCase(),
      'New Member': u.isNew ? 'YES' : 'NO',
      'Interested Topics': Array.isArray(u.topics) && u.topics.length ? u.topics.join(', ') : 'None specified',
      'Enrolled Courses Count': Array.isArray(u.enrolledCourses) ? u.enrolledCourses.length : 0,
      'Enrolled Workshops Count': Array.isArray(u.enrolledEvents) ? u.enrolledEvents.length : 0,
      'Registered At': formatDateTime(u.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Auto-size columns
    const colWidths = [
      { wch: 6 },  // S.No
      { wch: 22 }, // User ID
      { wch: 26 }, // Full Name
      { wch: 18 }, // Mobile Phone
      { wch: 28 }, // Email Address
      { wch: 16 }, // Status
      { wch: 12 }, // New Member
      { wch: 40 }, // Topics
      { wch: 22 }, // Enrolled Courses
      { wch: 24 }, // Enrolled Workshops
      { wch: 24 }  // Registered At
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registered Users');

    const fileName = `Ellangala_Registered_Users_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Direct Print
  const handlePrint = () => {
    window.print();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortOption('newest');
    setDatePreset('all');
    setCustomFromDate('');
    setCustomToDate('');
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'all' ||
    sortOption !== 'newest' ||
    datePreset !== 'all' ||
    customFromDate ||
    customToDate;

  return (
    <AdminLayout
      title="Registered Users"
      subtitle="View, search, filter, and export community seekers and registered academy members."
      action={
        <div className="d-flex align-items-center gap-2 flex-wrap no-print">
          <button
            type="button"
            onClick={loadUsers}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
            title="Refresh directory"
            style={{ borderRadius: '8px', padding: '8px 14px', fontWeight: '600' }}
          >
            <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{
              backgroundColor: '#107C41',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(16, 124, 65, 0.25)'
            }}
          >
            <FileSpreadsheet size={16} />
            <span>EXPORT EXCEL</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-sm btn-primary-gold d-flex align-items-center gap-2"
            style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '700' }}
          >
            <Printer size={16} />
            <span>PRINT DIRECTLY</span>
          </button>
        </div>
      }
    >
      {/* Printable Letterhead (visible ONLY during print) */}
      <div className="print-only mb-4" style={{ display: 'none' }}>
        <div style={{ borderBottom: '2px solid #CA8A38', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#082349' }}>
                ELLANGALA’S ACADEMY
              </h1>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#667085' }}>
                OFFICIAL REGISTERED USERS DIRECTORY
              </p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#475467' }}>
              <div><strong>Generated:</strong> {new Date().toLocaleString('en-IN')}</div>
              <div><strong>Total Listed:</strong> {filteredUsers.length} Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-4 no-print">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Users"
            value={stats.total}
            icon={Users}
            color="#082349"
            bgColor="#EEF2F6"
            subtext="Registered across platform"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Active Users"
            value={stats.active}
            icon={UserCheck}
            color="#059669"
            bgColor="#ECFDF5"
            subtext="Engaging with feed & courses"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Inactive Users"
            value={stats.inactive}
            icon={UserX}
            color="#64748B"
            bgColor="#F1F5F9"
            subtext="Dormant or paused accounts"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="New Signups (30d)"
            value={stats.newCount}
            icon={Sparkles}
            color="#CA8A38"
            bgColor="#FFF7E8"
            subtext="Recently joined seekers"
          />
        </div>
      </div>

      {/* Control Panel: Search & Filter Options */}
      <div
        className="card mb-4 no-print"
        style={{
          border: '1px solid var(--admin-border)',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div className="card-body p-3 p-md-4">
          {/* Top Row: Search & Status Tabs */}
          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-between gap-3 mb-3">
            {/* Search Input */}
            <div className="position-relative flex-grow-1" style={{ maxWidth: '420px' }}>
              <Search
                size={17}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8'
                }}
              />
              <input
                type="text"
                placeholder="Search users by name, email, phone, or topics…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{
                  paddingLeft: '40px',
                  paddingRight: searchQuery ? '36px' : '14px',
                  height: '42px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  border: '1px solid #CBD5E1'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="d-flex align-items-center gap-1 p-1 bg-light rounded-3 flex-wrap">
              {[
                { id: 'all', label: 'All Users', count: stats.total },
                { id: 'active', label: 'Active', count: stats.active },
                { id: 'inactive', label: 'Inactive', count: stats.inactive },
                { id: 'new', label: 'New Users', count: stats.newCount }
              ].map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className="btn btn-sm d-flex align-items-center gap-1 px-3 py-2"
                    style={{
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: isActive ? '700' : '600',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? 'var(--admin-navy-deep)' : '#64748B',
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        backgroundColor: isActive ? 'var(--admin-gold-light)' : '#E2E8F0',
                        color: isActive ? 'var(--admin-gold)' : '#64748B'
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Sorting, Date Presets & Custom Date Range */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top">
            <div className="d-flex flex-wrap align-items-center gap-2">
              {/* Sort Filter: New to Old / Old to New / Alphabetical */}
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>
                  <ArrowUpDown size={13} className="me-1" />
                  SORT:
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="form-select form-select-sm"
                  style={{
                    width: 'auto',
                    minWidth: '180px',
                    borderRadius: '7px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1E293B'
                  }}
                >
                  <option value="newest">Newest First (New to Old)</option>
                  <option value="oldest">Oldest First (Old to New)</option>
                  <option value="name-asc">Name (A → Z)</option>
                  <option value="name-desc">Name (Z → A)</option>
                </select>
              </div>

              {/* Date Filter Preset */}
              <div className="d-flex align-items-center gap-2 ms-lg-3">
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>
                  <Calendar size={13} className="me-1" />
                  DATE:
                </span>
                <div className="btn-group btn-group-sm" role="group">
                  {[
                    { id: 'all', label: 'All Time' },
                    { id: 'today', label: 'Today' },
                    { id: '7days', label: 'Last 7 Days' },
                    { id: '30days', label: 'Last 30 Days' },
                    { id: 'custom', label: 'Custom Range' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setDatePreset(p.id)}
                      className={`btn ${datePreset === p.id ? 'btn-navy active' : 'btn-outline-secondary'}`}
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: datePreset === p.id ? 'var(--admin-navy-deep)' : 'transparent',
                        color: datePreset === p.id ? '#FFFFFF' : '#475467',
                        borderColor: '#CBD5E1'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Date Pickers (if datePreset === 'custom') */}
            {datePreset === 'custom' && (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center gap-1">
                  <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>From:</span>
                  <input
                    type="date"
                    value={customFromDate}
                    onChange={(e) => setCustomFromDate(e.target.value)}
                    className="form-control form-control-sm"
                    style={{ width: '135px', fontSize: '12px', borderRadius: '6px' }}
                  />
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>To:</span>
                  <input
                    type="date"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                    className="form-control form-control-sm"
                    style={{ width: '135px', fontSize: '12px', borderRadius: '6px' }}
                  />
                </div>
              </div>
            )}

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-sm btn-link text-decoration-none text-muted p-0"
                style={{ fontSize: '12px', fontWeight: '600' }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div
        id="admin-users-table-card"
        className="card"
        style={{
          border: '1px solid var(--admin-border)',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="card-header bg-white p-3 d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0" style={{ fontSize: '15px', fontWeight: '700', color: 'var(--admin-navy-deep)' }}>
              Registered Members
            </h5>
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--admin-gold-light)',
                color: 'var(--admin-gold)',
                fontSize: '12px',
                fontWeight: '700'
              }}
            >
              {totalUsers} {totalUsers === 1 ? 'user' : 'users'}
            </span>
            {totalUsers > USERS_PER_PAGE && (
              <span
                className="badge bg-light text-secondary border d-none d-sm-inline-block"
                style={{ fontSize: '11px', fontWeight: '600' }}
              >
                15 per batch
              </span>
            )}
          </div>

          <div style={{ fontSize: '12.5px', color: '#64748B' }}>
            Sorted by:{' '}
            <strong>
              {sortOption === 'newest' && 'Newest to Oldest'}
              {sortOption === 'oldest' && 'Oldest to Newest'}
              {sortOption === 'name-asc' && 'Name (A to Z)'}
              {sortOption === 'name-desc' && 'Name (Z to A)'}
            </strong>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
            <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <tr>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#475467', width: '260px' }}>
                  USER / SEEKER
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#475467' }}>
                  CONTACT DETAILS
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#475467' }}>
                  INTERESTED TOPICS
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#475467' }}>
                  ENROLLED PROGRAMS
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#475467' }}>
                  JOINED DATE
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#475467', textAlign: 'center' }}>
                  STATUS
                </th>
                <th
                  className="no-print"
                  style={{
                    padding: '14px 16px',
                    fontWeight: '700',
                    color: '#475467',
                    textAlign: 'right',
                    width: '130px'
                  }}
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div className="spinner-border text-warning" role="status" style={{ width: '2rem', height: '2rem' }}>
                      <span className="visually-hidden">Loading users…</span>
                    </div>
                    <p className="mt-2 text-muted" style={{ fontSize: '13px' }}>
                      Retrieving registered users…
                    </p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#F1F5F9',
                        color: '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px'
                      }}
                    >
                      <Users size={28} />
                    </div>
                    <h6 style={{ fontWeight: '700', color: '#1E293B' }}>No users match your criteria</h6>
                    <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                      Try adjusting your search terms or filter selections.
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="btn btn-sm btn-outline-secondary"
                        style={{ borderRadius: '6px', fontSize: '12.5px' }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isActive = (user.status || 'active').toLowerCase() === 'active';
                  const coursesCount = Array.isArray(user.enrolledCourses) ? user.enrolledCourses.length : 0;
                  const eventsCount = Array.isArray(user.enrolledEvents) ? user.enrolledEvents.length : 0;

                  return (
                    <tr key={user.id} style={{ transition: 'background-color 0.15s' }}>
                      {/* User Column */}
                      <td style={{ padding: '14px 16px' }}>
                        <div className="d-flex align-items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '1.5px solid var(--admin-gold-border)'
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: isActive ? 'var(--admin-navy-deep)' : '#64748B',
                              color: '#FFFFFF',
                              display: user.avatarUrl ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '13px',
                              flexShrink: 0
                            }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className="d-flex align-items-center gap-1">
                              <span style={{ fontWeight: '700', color: 'var(--admin-navy-deep)' }}>
                                {user.name}
                              </span>
                              {user.isNew && (
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: '#FEF3C7',
                                    color: '#B45309',
                                    fontSize: '9.5px',
                                    fontWeight: '800',
                                    padding: '2px 5px',
                                    borderRadius: '4px'
                                  }}
                                  title="New seeker registered in last 30 days"
                                >
                                  NEW
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }} className="font-monospace">
                              {user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {user.email ? (
                            <div className="d-flex align-items-center gap-1" style={{ color: '#334155' }}>
                              <Mail size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
                              <a
                                href={`mailto:${user.email}`}
                                style={{ color: '#0F172A', textDecoration: 'none' }}
                                className="text-truncate"
                              >
                                {user.email}
                              </a>
                            </div>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '12px' }}>
                              No email provided
                            </span>
                          )}

                          {user.phone && (
                            <div className="d-flex align-items-center gap-1" style={{ color: '#475467', fontSize: '12px' }}>
                              <Phone size={12} style={{ color: '#94A3B8', flexShrink: 0 }} />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Interested Topics */}
                      <td style={{ padding: '14px 16px' }}>
                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '240px' }}>
                          {Array.isArray(user.topics) && user.topics.length > 0 ? (
                            user.topics.map((topic, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  backgroundColor: '#F1F5F9',
                                  color: '#334155',
                                  fontWeight: '500'
                                }}
                              >
                                {topic}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted" style={{ fontSize: '12px' }}>
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Enrolled Programs */}
                      <td style={{ padding: '14px 16px' }}>
                        <div className="d-flex flex-column gap-1">
                          {coursesCount > 0 && (
                            <span className="d-flex align-items-center gap-1" style={{ fontSize: '12px', color: '#0369A1' }}>
                              <BookOpen size={13} />
                              <strong>{coursesCount}</strong> Course{coursesCount > 1 ? 's' : ''}
                            </span>
                          )}
                          {eventsCount > 0 && (
                            <span className="d-flex align-items-center gap-1" style={{ fontSize: '12px', color: '#B45309' }}>
                              <CalendarDays size={13} />
                              <strong>{eventsCount}</strong> Workshop{eventsCount > 1 ? 's' : ''}
                            </span>
                          )}
                          {coursesCount === 0 && eventsCount === 0 && (
                            <span className="text-muted" style={{ fontSize: '12px' }}>
                              Community Seeker
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '14px 16px' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1E293B' }}>
                            {formatDate(user.createdAt)}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                            {user.createdAt ? new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span
                          className={`badge ${isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontWeight: '700',
                            fontSize: '11.5px',
                            letterSpacing: '0.3px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isActive ? '#10B981' : '#94A3B8'
                            }}
                          />
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="no-print" style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div className="d-flex align-items-center justify-content-end gap-1">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="btn btn-sm btn-light p-1"
                            title="View seeker profile"
                            style={{ borderRadius: '6px', color: '#475467' }}
                          >
                            <Eye size={16} />
                          </button>

                          {/* Toggle Active / Inactive */}
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(user)}
                            disabled={actionLoading}
                            className={`btn btn-sm p-1 ${isActive ? 'btn-light text-warning' : 'btn-light text-success'}`}
                            title={isActive ? 'Deactivate user' : 'Activate user'}
                            style={{ borderRadius: '6px' }}
                          >
                            {isActive ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                          </button>

                          {/* Delete user */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={actionLoading}
                            className="btn btn-sm btn-light p-1 text-danger"
                            title="Remove user"
                            style={{ borderRadius: '6px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (15 users per batch) */}
        {!loading && totalUsers > 0 && (
          <div
            className="card-footer bg-white border-top p-3 no-print d-flex flex-column flex-md-row align-items-center justify-content-between gap-3"
            style={{ borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}
          >
            {/* Left: Summary of records */}
            <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '13px' }}>
              <span>
                Showing <strong>{startIndex + 1}</strong> to <strong>{endIndex}</strong> of{' '}
                <strong style={{ color: 'var(--admin-navy-deep)' }}>{totalUsers}</strong> users
              </span>
              <span
                className="badge bg-light text-secondary border ms-1"
                style={{ fontSize: '11px', fontWeight: '600' }}
              >
                Batch {currentPage} of {totalPages} (15 per batch)
              </span>
            </div>

            {/* Right: Batch pagination navigation */}
            <div className="d-flex align-items-center gap-1 flex-wrap">
              {/* First Page Button */}
              <button
                type="button"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                style={{
                  borderRadius: '7px',
                  width: '34px',
                  height: '34px',
                  borderColor: '#E2E8F0',
                  color: currentPage === 1 ? '#94A3B8' : '#334155',
                  backgroundColor: currentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
                title="First batch (Page 1)"
              >
                <ChevronsLeft size={15} />
              </button>

              {/* Previous 15 Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-2"
                style={{
                  borderRadius: '7px',
                  height: '34px',
                  borderColor: '#E2E8F0',
                  fontWeight: '600',
                  fontSize: '12.5px',
                  color: currentPage === 1 ? '#94A3B8' : '#334155',
                  backgroundColor: currentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
                title="Previous 15 users"
              >
                <ChevronLeft size={15} />
                <span className="d-none d-sm-inline">Previous 15</span>
              </button>

              {/* Numbered Page Buttons */}
              <div className="d-flex align-items-center gap-1 mx-1">
                {pageNumbers.map((pageNum, idx) => {
                  if (pageNum === '...') {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-muted"
                        style={{ fontSize: '13px', userSelect: 'none' }}
                      >
                        …
                      </span>
                    );
                  }
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className="btn btn-sm"
                      style={{
                        borderRadius: '7px',
                        minWidth: '34px',
                        height: '34px',
                        fontSize: '12.5px',
                        fontWeight: isActive ? '700' : '600',
                        backgroundColor: isActive ? 'var(--admin-navy-deep)' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : '#334155',
                        border: isActive ? '1px solid var(--admin-navy-deep)' : '1px solid #E2E8F0',
                        boxShadow: isActive ? '0 2px 6px rgba(8, 35, 73, 0.25)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                      title={`Batch ${pageNum} (${(pageNum - 1) * USERS_PER_PAGE + 1}–${Math.min(pageNum * USERS_PER_PAGE, totalUsers)})`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next 15 Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-2"
                style={{
                  borderRadius: '7px',
                  height: '34px',
                  borderColor: '#E2E8F0',
                  fontWeight: '600',
                  fontSize: '12.5px',
                  color: currentPage === totalPages ? '#94A3B8' : '#334155',
                  backgroundColor: currentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
                title="Next 15 users"
              >
                <span className="d-none d-sm-inline">Next 15</span>
                <ChevronRight size={15} />
              </button>

              {/* Last Page Button */}
              <button
                type="button"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                style={{
                  borderRadius: '7px',
                  width: '34px',
                  height: '34px',
                  borderColor: '#E2E8F0',
                  color: currentPage === totalPages ? '#94A3B8' : '#334155',
                  backgroundColor: currentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
                title={`Last batch (Page ${totalPages})`}
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="modal fade show no-print"
          style={{ display: 'block', backgroundColor: 'rgba(8, 35, 73, 0.65)', backdropFilter: 'blur(3px)' }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content"
              style={{
                borderRadius: '16px',
                border: '1px solid var(--admin-gold-border)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              {/* Modal Header */}
              <div
                className="modal-header p-4"
                style={{
                  backgroundColor: 'var(--admin-navy-deep)',
                  color: '#FFFFFF',
                  borderBottom: 'none'
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--admin-gold)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '800',
                      boxShadow: '0 4px 12px rgba(202, 138, 56, 0.4)'
                    }}
                  >
                    {getInitials(selectedUser.name)}
                  </div>
                  <div>
                    <h5 className="modal-title mb-1" style={{ fontWeight: '800', fontSize: '18px' }}>
                      {selectedUser.name}
                    </h5>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge font-monospace" style={{ backgroundColor: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>
                        {selectedUser.id}
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: selectedUser.status === 'active' ? '#10B981' : '#64748B',
                          fontSize: '11px'
                        }}
                      >
                        {(selectedUser.status || 'active').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4" style={{ backgroundColor: '#FAF8F3' }}>
                <div className="row g-3">
                  {/* Contact Info Card */}
                  <div className="col-12 col-md-6">
                    <div className="card h-100 p-3 bg-white" style={{ borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <h6 style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px' }}>
                        CONTACT INFORMATION
                      </h6>
                      <div className="mt-3 d-flex flex-column gap-2" style={{ fontSize: '13px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <Mail size={15} className="text-muted" />
                          <span style={{ fontWeight: '600', color: '#1E293B' }}>{selectedUser.email || 'None provided'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Phone size={15} className="text-muted" />
                          <span style={{ fontWeight: '600', color: '#1E293B' }}>{selectedUser.phone || 'None provided'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Calendar size={15} className="text-muted" />
                          <span style={{ color: '#64748B' }}>
                            Registered: <strong>{formatDateTime(selectedUser.createdAt)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Topics Card */}
                  <div className="col-12 col-md-6">
                    <div className="card h-100 p-3 bg-white" style={{ borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <h6 style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px' }}>
                        INTERESTED TOPICS
                      </h6>
                      <div className="mt-3 d-flex flex-wrap gap-1">
                        {Array.isArray(selectedUser.topics) && selectedUser.topics.length ? (
                          selectedUser.topics.map((t, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '11.5px',
                                padding: '3px 10px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--admin-gold-light)',
                                color: 'var(--admin-gold)',
                                fontWeight: '700'
                              }}
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted" style={{ fontSize: '12px' }}>
                            No topics selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enrolled Courses */}
                  <div className="col-12">
                    <div className="card p-3 bg-white" style={{ borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <h6 style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px' }}>
                        ENROLLED COURSES & PROGRESS
                      </h6>
                      <div className="mt-2">
                        {Array.isArray(selectedUser.enrolledCourses) && selectedUser.enrolledCourses.length > 0 ? (
                          <div className="d-flex flex-column gap-2 mt-2">
                            {selectedUser.enrolledCourses.map((c, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-2 d-flex align-items-center justify-content-between"
                                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '13px' }}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <BookOpen size={15} style={{ color: '#0369A1' }} />
                                  <span style={{ fontWeight: '600', color: '#1E293B' }}>{c.title}</span>
                                </div>
                                {c.progress !== undefined && (
                                  <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '11px' }}>
                                    {c.progress}% completed
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted mb-0" style={{ fontSize: '12.5px' }}>
                            Not currently enrolled in any academic programs.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enrolled Workshops */}
                  <div className="col-12">
                    <div className="card p-3 bg-white" style={{ borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <h6 style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px' }}>
                        WORKSHOPS & MASTERCLASSES
                      </h6>
                      <div className="mt-2">
                        {Array.isArray(selectedUser.enrolledEvents) && selectedUser.enrolledEvents.length > 0 ? (
                          <div className="d-flex flex-column gap-2 mt-2">
                            {selectedUser.enrolledEvents.map((ev, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-2 d-flex align-items-center justify-content-between"
                                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '13px' }}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <CalendarDays size={15} style={{ color: '#B45309' }} />
                                  <span style={{ fontWeight: '600', color: '#1E293B' }}>{ev.title}</span>
                                </div>
                                <span className="badge bg-warning-subtle text-warning" style={{ fontSize: '11px' }}>
                                  Registered
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted mb-0" style={{ fontSize: '12.5px' }}>
                            No live workshop registrations found.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer p-3 bg-white border-top d-flex justify-content-between">
                <button
                  type="button"
                  onClick={() => handleStatusToggle(selectedUser)}
                  className={`btn btn-sm ${
                    selectedUser.status === 'active' ? 'btn-outline-secondary' : 'btn-success'
                  }`}
                  style={{ borderRadius: '8px', fontWeight: '600' }}
                >
                  {selectedUser.status === 'active' ? 'Mark Account Inactive' : 'Activate Account'}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-sm btn-primary-gold px-4"
                  style={{ borderRadius: '8px', fontWeight: '700' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
