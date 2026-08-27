import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ProductForm from '../components/ProductForm';
import { productService } from '../services/productService';

export default function ProductCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await productService.createProduct(formData);
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  return (
    <AdminLayout title="Add Product" subtitle="Add a new book or resource to the shop.">
      <ProductForm onSubmit={handleSubmit} isEditing={false} />
    </AdminLayout>
  );
}
