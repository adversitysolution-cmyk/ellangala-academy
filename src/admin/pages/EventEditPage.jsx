import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import EventForm from '../components/EventForm';
import { eventService } from '../../features/events/services/eventService';

export default function EventEditPage() {
  const { id } = useParams();
  const event = eventService.getEventById(id);

  const handleSubmit = (formData) => {
    if (id) {
      eventService.updateEvent(id, formData);
    }
  };

  if (!event) {
    return (
      <AdminLayout title="Edit Event" subtitle="Event not found">
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
          <h3>Event Not Found</h3>
          <p style={{ color: '#64748B', margin: '12px 0 20px' }}>The requested event ID could not be found.</p>
          <Link to="/admin/events" className="thm-btn">Back to Events</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${event.title}`} subtitle={`ID: ${event.id} • Slug: /events/${event.slug}`}>
      <EventForm initialData={event} onSubmit={handleSubmit} isEditing={true} />
    </AdminLayout>
  );
}
