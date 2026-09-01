import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import { orderService } from '../services/orderService';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, ShoppingBag, CheckCircle2 } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('New');
  const [internalNotes, setInternalNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    orderService.getOrderById(id).then((item) => {
      if (item) {
        setOrder(item);
        setStatus(item.status || 'New');
        setInternalNotes(item.internalNotes || '');
      }
    }).catch(() => {});
  }, [id]);

  if (!order) {
    return (
      <AdminLayout title="Order Details" subtitle="Order not found">
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>Order Not Found</h3>
          <p style={{ color: '#667085', margin: '12px 0 20px' }}>The requested order ID could not be found.</p>
          <Link to="/admin/orders" className="btn-primary-gold">Back to Orders</Link>
        </div>
      </AdminLayout>
    );
  }

  const handleSave = async () => {
    await orderService.updateOrderStatus(order.id, status, internalNotes);
    setToastMessage('Order status updated successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <AdminLayout
      title={`Order: ${order.id}`}
      subtitle={`Placed on ${formatDate(order.createdAt)}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '84px',
              right: '32px',
              backgroundColor: '#047857',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700',
              fontSize: '14px'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/admin/orders" className="btn-secondary-outline">
            <ArrowLeft size={16} />
            <span>Back to All Orders</span>
          </Link>
          <StatusBadge status={status} />
        </div>

        <div className="row gy-4">
          {/* Customer Info Card */}
          <div className="col-md-6">
            <div className="admin-card" style={{ height: '100%' }}>
              <div className="admin-card__header">
                <h3 className="admin-card__title">Customer Information</h3>
              </div>
              <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={18} style={{ color: '#CA8A38' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>CUSTOMER NAME</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2347' }}>{order.customerName}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} style={{ color: '#CA8A38' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>PHONE NUMBER</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2347' }}>{order.phone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} style={{ color: '#CA8A38' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>EMAIL ADDRESS</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2347' }}>{order.email || '-'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={18} style={{ color: '#CA8A38', marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>DELIVERY ADDRESS</div>
                    <div style={{ fontSize: '14px', color: '#334155', marginTop: '2px' }}>{order.address || order.city || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Items */}
          <div className="col-md-6">
            <div className="admin-card" style={{ height: '100%' }}>
              <div className="admin-card__header">
                <h3 className="admin-card__title">Order Summary &amp; Items</h3>
              </div>
              <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#667085', fontWeight: '600' }}>Total Amount</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#0A2347' }}>₹{order.totalAmount}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#667085', fontWeight: '600' }}>Payment Status</span>
                  <StatusBadge status={order.paymentStatus || 'Paid'} />
                </div>

                {order.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#667085', fontWeight: '600' }}>
                      Discount{order.couponCode ? ` (${order.couponCode})` : ''}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#059669' }}>-₹{order.discount}</span>
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700', marginBottom: '8px' }}>ORDERED ITEMS</div>
                  {order.items && order.items.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#0A2347', fontWeight: '600', backgroundColor: '#FAF8F3', padding: '10px 14px', borderRadius: '8px' }}>
                          <span>{item.title || item.name || 'Book Title'} (x{item.quantity || 1})</span>
                          <span>₹{item.price * (item.quantity || 1)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Standard Book Package (1 Copy)</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status & Tracking Card */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Update Order Status</h3>
          </div>
          <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-form-group" style={{ maxWidth: '300px' }}>
              <label className="admin-label">Fulfillment Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="admin-select"
              >
                <option value="New">New</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Internal Fulfillment &amp; Tracking Notes</label>
              <textarea
                rows={3}
                placeholder="Courier partner, tracking number, delivery notes..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="admin-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-primary-gold"
                onClick={handleSave}
              >
                <Save size={16} />
                <span>Update Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
