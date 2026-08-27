import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import EventForm from '../components/EventForm';
import { eventService } from '../../features/events/services/eventService';

export default function EventCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await eventService.createEvent(formData);
      navigate('/admin/events');
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  return (
    <AdminLayout title="Create Event" subtitle="Add a new event to Ellangala's Academy.">
      <EventForm onSubmit={handleSubmit} isEditing={false} />
    </AdminLayout>
  );
}
