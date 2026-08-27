import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ProductForm from '../components/ProductForm';
import { productService } from '../services/productService';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService.getProductById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await productService.updateProduct(id, formData);
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#64748B' }}>Loading product details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Edit Product" subtitle="Product not found">
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
          <h3>Product Not Found</h3>
          <p style={{ color: '#64748B', margin: '12px 0 20px' }}>The requested product could not be found.</p>
          <Link to="/admin/products" className="thm-btn">Back to Products</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${product.title}`} subtitle={`ID: ${product.id}`}>
      <ProductForm initialData={product} onSubmit={handleSubmit} isEditing={true} />
    </AdminLayout>
  );
}
