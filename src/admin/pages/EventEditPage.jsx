import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import EventForm from '../components/EventForm';
import { eventService } from '../../features/events/services/eventService';

export default function EventEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    eventService.getEventById(id).then((evt) => {
      setEvent(evt);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await eventService.updateEvent(id, formData);
      navigate('/admin/events');
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Event">
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#64748B' }}>Loading event details...</p>
        </div>
      </AdminLayout>
    );
  }

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
