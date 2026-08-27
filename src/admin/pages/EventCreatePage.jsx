import React from 'react';
import AdminLayout from '../components/AdminLayout';
import EventForm from '../components/EventForm';
import { eventService } from '../../features/events/services/eventService';

export default function EventCreatePage() {
  const handleSubmit = (formData) => {
    eventService.createEvent(formData);
  };

  return (
    <AdminLayout title="Create Event" subtitle="Add a new event to Ellangala's Academy.">
      <EventForm onSubmit={handleSubmit} isEditing={false} />
    </AdminLayout>
  );
}
