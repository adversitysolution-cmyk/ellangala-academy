import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { orderService } from '../admin/services/orderService';
import SEO from '../seo/SEO';
import { Package, Search, CheckCircle2 } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function TrackOrderPage() {
  useUterpyPlugins();
  const [searchParams] = useSearchParams();

  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setIsLoading(true);
    try {
      const result = await orderService.trackOrder(orderId.trim(), contact.trim());
      setOrder(result);
    } catch (err) {
      setError(err.message || 'Order not found.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO title="Track Your Order | Ellangala’s Academy" canonical="/track-order" noindex={true} />
        <HeaderOne />
        <PageHeader title="Track Your Order" breadcrumb="Track Order" />

        <section style={{ paddingTop: '60px', paddingBottom: '90px', backgroundColor: '#FAF8F5' }}>
          <div className="container" style={{ maxWidth: '640px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '36px',
                border: '1px solid #ECE7DE',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF5EC',
                    color: '#CA8A38',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px'
                  }}
                >
                  <Package size={26} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '6px' }}>
                  Track Your Book Order
                </h2>
                <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                  Enter your Order ID and the email or phone number used at checkout.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Order ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ORD-2026-0001"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14.5px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Email or phone used at checkout"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14.5px', outline: 'none' }}
                  />
                </div>

                {error && <p style={{ color: '#DC2626', fontSize: '13.5px', margin: 0 }}>{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="thm-btn"
                  style={{
                    padding: '14px 20px',
                    fontSize: '14.5px',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Search size={16} />
                  <span>{isLoading ? 'Searching...' : 'Track Order'}</span>
                </button>
              </form>
            </div>

            {order && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid #ECE7DE',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  marginTop: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <CheckCircle2 size={20} style={{ color: '#059669' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F231B', margin: 0 }}>
                    Order {order.id}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#334155', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Status</span>
                    <strong>{order.status}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Payment</span>
                    <strong>{order.paymentStatus} ({order.paymentMethod === 'online' ? 'Online' : 'Cash on Delivery'})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Delivering to</span>
                    <strong>{order.city}{order.state ? `, ${order.state}` : ''}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Placed on</span>
                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Last updated</span>
                    <strong>{formatDate(order.updatedAt)}</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#475569', marginBottom: '8px' }}>
                      <span>{item.title || item.name} {item.quantity ? `× ${item.quantity}` : ''}</span>
                      {item.price !== undefined && <span>₹{item.price}</span>}
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#0F231B', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <FooterOne hideSubscribe={true} />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
