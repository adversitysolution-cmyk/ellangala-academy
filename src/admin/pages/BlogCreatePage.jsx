import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import BlogForm from '../components/BlogForm';
import { blogService } from '../services/blogService';

export default function BlogCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      blogService.createBlog(formData);
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Failed to create blog post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Create New Article"
      subtitle="Publish new Positive Psychology insights, articles, and SEO metadata"
    >
      <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </AdminLayout>
  );
}
