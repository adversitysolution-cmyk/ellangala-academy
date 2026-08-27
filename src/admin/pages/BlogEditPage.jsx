import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import BlogForm from '../components/BlogForm';
import { blogService } from '../services/blogService';

export default function BlogEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existing = blogService.getBlogById(id) || blogService.getBlogBySlug(id);
    if (existing) {
      setBlogData(existing);
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      blogService.updateBlog(id, formData);
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Failed to update blog post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!blogData) {
    return (
      <AdminLayout title="Edit Article">
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#64748B' }}>Loading article details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Edit Article: ${blogData.title}`}
      subtitle="Update content, status, and SEO meta tags"
    >
      <BlogForm initialData={blogData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </AdminLayout>
  );
}
