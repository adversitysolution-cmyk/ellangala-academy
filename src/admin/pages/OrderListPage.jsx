import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import { orderService } from '../services/orderService';
import { ShoppingBag, MessageSquare, Clock, CheckCircle, Search, Eye, Truck, PackageCheck, XCircle } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabFilter, setTabFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setOrders(await orderService.getOrders());
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const filtered = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (o.id || '').toLowerCase().includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.phone || '').toLowerCase().includes(q);

    const matchesTab =
      tabFilter === 'All' || o.status.toLowerCase() === tabFilter.toLowerCase();

    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout
      title="Book Orders"
      subtitle="Track and manage customer book orders from the Academy shop."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={ShoppingBag}
            color="#CA8A38"
            bgColor="#FFF7E8"
          />
          <StatCard
            title="New Orders"
            value={orders.filter(o => o.status === 'New').length}
            icon={MessageSquare}
            color="#2563EB"
            bgColor="#EFF6FF"
          />
          <StatCard
            title="Processing"
            value={orders.filter(o => o.status === 'Processing').length}
            icon={Clock}
            color="#8B5CF6"
            bgColor="#F3E8FF"
          />
          <StatCard
            title="Delivered"
            value={orders.filter(o => o.status === 'Delivered').length}
            icon={CheckCircle}
            color="#059669"
            bgColor="#ECFDF5"
          />
        </div>

        {/* Orders Card */}
        <div className="admin-card">
          <div className="admin-card__header">
            <div>
              <h3 className="admin-card__title">Book Orders Roster</h3>
              <p style={{ fontSize: '13px', color: '#667085', margin: '2px 0 0' }}>Manage fulfillment and delivery status.</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#FFF7E8', color: '#CA8A38', padding: '4px 12px', borderRadius: '12px' }}>
              {filtered.length} Orders
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
                placeholder="Search by order ID, customer name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>

            {/* Quick Filter Tabs */}
            <div className="admin-tabs">
              {['All', 'New', 'Processing', 'Delivered', 'Cancelled'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTabFilter(tab)}
                  className={`admin-tab-btn ${tabFilter === tab ? 'active' : ''}`}
                >
                  {tab === 'All' ? 'All Orders' : tab}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px 20px', textAlign: 'center', color: '#667085' }}>
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <div style={{ fontWeight: '800', color: '#0A2347' }}>{o.id}</div>
                          <div style={{ fontSize: '12px', color: '#667085' }}>{formatDate(o.createdAt)}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '700', color: '#0A2347' }}>{o.customerName}</div>
                          <div style={{ fontSize: '12.5px', color: '#667085' }}>{o.phone}</div>
                        </td>
                        <td>
                          <span style={{ backgroundColor: '#FAF8F3', color: '#0A2347', padding: '4px 10px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', border: '1px solid #E5E7EB' }}>
                            {o.items?.length || 1} Book(s)
                          </span>
                        </td>
                        <td style={{ fontWeight: '800', color: '#0A2347' }}>
                          ₹{o.totalAmount}
                        </td>
                        <td>
                          <StatusBadge status={o.paymentStatus || 'Paid'} />
                        </td>
                        <td>
                          <StatusBadge status={o.status} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <ActionMenu
                            items={[
                              { label: 'View Order', icon: Eye, to: `/admin/orders/${o.id}` },
                              { divider: true },
                              { label: 'Mark Processing', icon: Clock, onClick: () => handleStatusChange(o.id, 'Processing') },
                              { label: 'Mark Shipped', icon: Truck, onClick: () => handleStatusChange(o.id, 'Shipped') },
                              { label: 'Mark Delivered', icon: PackageCheck, onClick: () => handleStatusChange(o.id, 'Delivered') },
                              { label: 'Cancel Order', icon: XCircle, danger: true, onClick: () => handleStatusChange(o.id, 'Cancelled') }
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
