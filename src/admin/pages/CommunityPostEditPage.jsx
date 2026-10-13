import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import CommunityPostForm from '../components/CommunityPostForm';
import { communityAdminService } from '../services/communityAdminService';

export default function CommunityPostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    communityAdminService.getPostById(id)
      .then(setPost)
      .catch(err => {
        alert(err.message || 'Post could not be loaded.');
        navigate('/admin/feed');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await communityAdminService.updatePost(id, formData);
      navigate('/admin/feed');
    } catch (err) {
      alert(err.message || 'Failed to update post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Edit Community Post"
      subtitle={post ? `Editing: ${post.title}` : 'Update community post details'}
    >
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
          Loading post data...
        </div>
      ) : post ? (
        <CommunityPostForm initialData={post} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <div style={{ padding: '60px', textAlign: 'center', color: '#EF4444' }}>
          Post not found.
        </div>
      )}
    </AdminLayout>
  );
}
