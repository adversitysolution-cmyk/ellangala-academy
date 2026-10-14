import React from 'react';
import { Calendar, Clock, MapPin, Video, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CommunityMobileEventsView({ sidebarData, onReturnToFeed }) {
  const events = Array.isArray(sidebarData?.upcomingEvents) && sidebarData.upcomingEvents.length > 0
    ? sidebarData.upcomingEvents
    : [
        {
          id: 'evt-1',
          title: 'Mastering Stress & Emotional Resilience',
          date: 'OCT 24',
          time: '6:30 PM - 8:00 PM IST',
          speaker: 'Dr. Naveen Ellangala',
          mode: 'Online (Zoom Live Circle)',
          spots: 'Few seats remaining',
          badge: 'FEATURED MASTERCLASS'
        },
        {
          id: 'evt-2',
          title: 'Gita Insights for Daily Calm & Decision Making',
          date: 'NOV 02',
          time: '7:00 PM - 8:30 PM IST',
          speaker: 'Dr. Naveen Ellangala',
          mode: 'Live Interactive Circle',
          spots: 'Registrations Open',
          badge: 'WISDOM WORKSHOP'
        }
      ];

  return (
    <div className="community-mobile-events-view">
      {/* Header Banner */}
      <div className="community-events-header-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="#B87B28" />
          <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: '#B87B28', textTransform: 'uppercase' }}>
            Live Wisdom Circles &amp; Masterclasses
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', margin: '0 0 8px 0', fontFamily: "'Playfair Display', Georgia, serif" }}>
          Community Events &amp; Workshops
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
          Join live transformative sessions with Dr. Naveen Ellangala to cultivate deep emotional calm and mental strength.
        </p>
      </div>

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
        {events.map((evt) => (
          <div key={evt.id} className="community-card community-event-item-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="community-event-badge-tag">
                {evt.badge || 'UPCOMING'}
              </span>
              <div className="community-event-date-pill">
                <Calendar size={13} color="#B87B28" />
                <span>{evt.date}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: '0 0 8px 0', lineHeight: 1.35 }}>
              {evt.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} color="#94A3B8" />
                <span>{evt.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Video size={13} color="#94A3B8" />
                <span>{evt.mode}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} color="#94A3B8" />
                <span>Speaker: <strong style={{ color: '#334155' }}>{evt.speaker}</strong></span>
              </div>
            </div>

            <Link
              to="/events"
              className="community-event-register-btn"
            >
              <span>View Details &amp; Register</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
