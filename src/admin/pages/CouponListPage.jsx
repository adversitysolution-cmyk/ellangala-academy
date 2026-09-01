import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import ActionMenu from '../components/ActionMenu';
import { couponService } from '../services/couponService';
import { Plus, TicketPercent, CheckCircle, TrendingUp, Edit, Trash2, AlertTriangle } from 'lucide-react';

const BLANK = {
  code: '', type: 'percent', value: '', minSubtotal: '', maxDiscount: '',
  usageLimit: '', expiresAt: '', active: true, description: ''
};

export default function CouponListPage() {
  const [coupons, setCoupons] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // coupon being edited, or null for new
  const [form, setForm] = useState(BLANK);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => couponService.getCoupons().then(setCoupons).catch(() => {});
  useEffect(() => { load(); }, []);

  const activeCount = coupons.filter(c => c.active).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  const openNew = () => { setEditing(null); setForm(BLANK); setFormError(''); setFormOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code, type: c.type, value: String(c.value),
      minSubtotal: c.minSubtotal ? String(c.minSubtotal) : '',
      maxDiscount: c.maxDiscount ? String(c.maxDiscount) : '',
      usageLimit: c.usageLimit ? String(c.usageLimit) : '',
      expiresAt: c.expiresAt || '', active: c.active, description: c.description || ''
    });
    setFormError('');
    setFormOpen(true);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minSubtotal: Number(form.minSubtotal) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      usageLimit: Number(form.usageLimit) || 0,
      expiresAt: form.expiresAt || null,
      active: form.active,
      description: form.description
    };
    try {
      if (editing) await couponService.updateCoupon(editing.id, payload);
      else await couponService.createCoupon(payload);
      setFormOpen(false);
      load();
    } catch (err) {
      setFormError(err.message || 'Could not save coupon.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c) => {
    await couponService.updateCoupon(c.id, { ...c, active: !c.active });
    load();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await couponService.deleteCoupon(deleteId);
    setDeleteId(null);
    load();
  };

  const discountLabel = (c) => (c.type === 'fixed' ? `₹${c.value} off` : `${c.value}% off`);

  return (
    <AdminLayout
      title="Coupons"
      subtitle="Create and manage discount codes for the book shop checkout."
      action={
        <button className="btn-primary-gold" onClick={openNew}>
          <Plus size={18} />
          <span>Add Coupon</span>
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <StatCard title="Total Coupons" value={coupons.length} icon={TicketPercent} color="#CA8A38" bgColor="#FFF7E8" />
          <StatCard title="Active" value={activeCount} icon={CheckCircle} color="#059669" bgColor="#ECFDF5" />
          <StatCard title="Total Redemptions" value={totalRedemptions} icon={TrendingUp} color="#8B5CF6" bgColor="#F3E8FF" />
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Discount Codes</h3>
            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#FFF7E8', color: '#CA8A38', padding: '4px 12px', borderRadius: '12px' }}>
              {coupons.length} Coupons
            </span>
          </div>
          <div className="admin-card__body">
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min. Cart</th>
                    <th>Used</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr><td colSpan="7" style={{ padding: '40px 20px', textAlign: 'center', color: '#667085' }}>No coupons yet. Click “Add Coupon” to create one.</td></tr>
                  ) : (
                    coupons.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: '700', color: '#0A2347', fontSize: '14px' }}>{c.code}</div>
                          {c.description && <div style={{ fontSize: '12px', color: '#667085' }}>{c.description}</div>}
                        </td>
                        <td style={{ fontWeight: '600' }}>
                          {discountLabel(c)}
                          {c.type === 'percent' && c.maxDiscount > 0 && (
                            <span style={{ fontSize: '12px', color: '#667085' }}> (max ₹{c.maxDiscount})</span>
                          )}
                        </td>
                        <td>{c.minSubtotal > 0 ? `₹${c.minSubtotal}` : '—'}</td>
                        <td>{c.usedCount}{c.usageLimit > 0 ? ` / ${c.usageLimit}` : ''}</td>
                        <td>{c.expiresAt || '—'}</td>
                        <td>
                          <span style={{
                            fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '10px',
                            backgroundColor: c.active ? '#ECFDF5' : '#FEF2F2',
                            color: c.active ? '#059669' : '#DC2626'
                          }}>
                            {c.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <ActionMenu
                            items={[
                              { label: 'Edit', icon: Edit, onClick: () => openEdit(c) },
                              { label: c.active ? 'Deactivate' : 'Activate', icon: CheckCircle, onClick: () => toggleActive(c) },
                              { divider: true },
                              { label: 'Delete', icon: Trash2, danger: true, onClick: () => setDeleteId(c.id) }
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

      {formOpen && (
        <div onClick={() => setFormOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(8,35,73,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 20px', color: '#0A2347' }}>
              {editing ? `Edit ${editing.code}` : 'New Coupon'}
            </h3>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Coupon Code *</label>
                <input className="admin-input" required value={form.code}
                  onChange={(e) => set('code', e.target.value.toUpperCase())}
                  placeholder="WELCOME10" style={{ textTransform: 'uppercase' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-label">Type *</label>
                  <select className="admin-select" value={form.type} onChange={(e) => set('type', e.target.value)}>
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">{form.type === 'fixed' ? 'Amount (₹) *' : 'Percent (%) *'}</label>
                  <input className="admin-input" required type="number" min="1" value={form.value}
                    onChange={(e) => set('value', e.target.value)} placeholder={form.type === 'fixed' ? '100' : '10'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-label">Min. cart subtotal (₹)</label>
                  <input className="admin-input" type="number" min="0" value={form.minSubtotal}
                    onChange={(e) => set('minSubtotal', e.target.value)} placeholder="0 = none" />
                </div>
                <div>
                  <label className="admin-label">Max discount (₹){form.type === 'fixed' ? ' — n/a' : ''}</label>
                  <input className="admin-input" type="number" min="0" value={form.maxDiscount}
                    onChange={(e) => set('maxDiscount', e.target.value)} placeholder="0 = no cap" disabled={form.type === 'fixed'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-label">Usage limit</label>
                  <input className="admin-input" type="number" min="0" value={form.usageLimit}
                    onChange={(e) => set('usageLimit', e.target.value)} placeholder="0 = unlimited" />
                </div>
                <div>
                  <label className="admin-label">Expires on</label>
                  <input className="admin-input" type="date" value={form.expiresAt}
                    onChange={(e) => set('expiresAt', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="admin-label">Description (internal)</label>
                <input className="admin-input" value={form.description}
                  onChange={(e) => set('description', e.target.value)} placeholder="Festive season offer" />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
                <span>Active (customers can use this code)</span>
              </label>

              {formError && <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{formError}</p>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
                <button type="button" className="btn-secondary-outline" onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary-gold" disabled={saving}>
                  <span>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div onClick={() => setDeleteId(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(8,35,73,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '30px', maxWidth: '440px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#DC2626', marginBottom: '16px' }}>
              <AlertTriangle size={28} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0A2347' }}>Delete Coupon?</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#667085', lineHeight: '1.6', marginBottom: '24px' }}>
              Customers will no longer be able to use this code. This cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button type="button" onClick={confirmDelete} style={{ backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
