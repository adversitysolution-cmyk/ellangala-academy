import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import { productService } from '../services/productService';
import { Plus, Search, BookOpen, CheckCircle, Tag, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteModalId, setDeleteModalId] = useState(null);

  const loadProducts = () => {
    productService.getProducts().then(setProducts).catch(() => {});
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const publishedCount = products.filter(p => p.status === 'published').length;
  const saleCount = products.filter(p => p.sale).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = async () => {
    if (deleteModalId) {
      await productService.deleteProduct(deleteModalId);
      setDeleteModalId(null);
      loadProducts();
    }
  };

  const primaryAddButton = (
    <Link to="/admin/products/new" className="btn-primary-gold">
      <Plus size={18} />
      <span>Add Product</span>
    </Link>
  );

  return (
    <AdminLayout
      title="Products"
      subtitle="Manage books and resources available in the shop."
      action={primaryAddButton}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <StatCard title="Total Products" value={products.length} icon={BookOpen} color="#CA8A38" bgColor="#FFF7E8" />
          <StatCard title="Published" value={publishedCount} icon={CheckCircle} color="#059669" bgColor="#ECFDF5" />
          <StatCard title="On Sale" value={saleCount} icon={Tag} color="#8B5CF6" bgColor="#F3E8FF" />
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <div>
              <h3 className="admin-card__title">Product Management</h3>
              <p style={{ fontSize: '13px', color: '#667085', margin: '2px 0 0' }}>View and manage all shop products.</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#FFF7E8', color: '#CA8A38', padding: '4px 12px', borderRadius: '12px' }}>
              {filteredProducts.length} Products
            </span>
          </div>

          <div className="admin-card__body">
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-select" style={{ width: 'auto', height: '38px', fontSize: '13px' }}>
                <option value="All">Status ▾</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: '#667085' }}>
                        No products found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0A2347', flexShrink: 0 }}>
                              <img
                                src={p.image || p.img || '/assets/images/books/Bhagavadgeetha for Meaningful Life.png'}
                                alt={p.title}
                                onError={(e) => { e.currentTarget.src = '/assets/images/books/Bhagavadgeetha for Meaningful Life.png'; }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <div>
                              <Link to={`/admin/products/${p.id}/edit`} style={{ fontWeight: '700', color: '#0A2347', textDecoration: 'none', fontSize: '14.5px' }}>
                                {p.title}
                              </Link>
                              <div style={{ fontSize: '12px', color: '#667085', marginTop: '2px' }}>
                                {p.id}{p.sale && ' · On Sale'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ backgroundColor: '#FAF8F3', color: '#1E293B', padding: '4px 10px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '600', border: '1px solid #E5E7EB' }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: '700', color: '#0A2347', fontSize: '13.5px' }}>{p.price}</td>
                        <td><StatusBadge status={p.status} /></td>
                        <td style={{ textAlign: 'right' }}>
                          <ActionMenu
                            items={[
                              { label: 'View Product', icon: Eye, to: `/shop/${p.id}`, target: '_blank' },
                              { label: 'Edit Product', icon: Edit, to: `/admin/products/${p.id}/edit` },
                              { divider: true },
                              { label: 'Delete Product', icon: Trash2, danger: true, onClick: () => setDeleteModalId(p.id) }
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

      {deleteModalId && (
        <div
          onClick={() => setDeleteModalId(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(8, 35, 73, 0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '30px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#DC2626', marginBottom: '16px' }}>
              <AlertTriangle size={28} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0A2347' }}>Delete Product?</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#667085', lineHeight: '1.6', marginBottom: '24px' }}>
              This product will be permanently removed from the shop. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setDeleteModalId(null)}>Cancel</button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
