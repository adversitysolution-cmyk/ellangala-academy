import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import CommunityPostForm from '../components/CommunityPostForm';
import { communityAdminService } from '../services/communityAdminService';

export default function CommunityPostCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await communityAdminService.createPost(formData);
      navigate('/admin/feed');
    } catch (err) {
      alert(err.message || 'Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Create Community Post"
      subtitle="Publish positive psychology wisdom, announcements, and media to the community feed"
    >
      <CommunityPostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </AdminLayout>
  );
}
