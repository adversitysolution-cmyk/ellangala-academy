import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Monitor, ChevronRight, Calendar } from 'lucide-react';

export default function CommunityFeaturedWorkshop({ event }) {
  let monthDisplay = event?.monthDisplay;
  let dayDisplay = event?.dayDisplay;
  let dayOfWeek = event?.dayOfWeek;

  if (event?.date && (!monthDisplay || !dayDisplay || !dayOfWeek)) {
    try {
      const parts = event.date.split('-');
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(d.getTime())) {
        if (!monthDisplay) monthDisplay = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        if (!dayDisplay) dayDisplay = String(d.getDate()).padStart(2, '0');
        if (!dayOfWeek) dayOfWeek = d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
      }
    } catch (_) {}
  }

  const detailUrl = event ? `/events/${event.slug || event.id}` : '/events';
  const timeText = event?.timeDisplay || (event?.startTime ? `${event.startTime}${event?.endTime ? ` – ${event.endTime}` : ''}` : '6:30 PM – 7:30 PM (IST)');
  const tagText = event?.featured ? 'FEATURED EVENT' : (event?.subtitle || event?.category || 'UPCOMING EVENT').toUpperCase();

  return (
    <div className="community-workshop-alert-card">
      <div className="community-wa-header-row">
        <h4 className="community-wa-section-title">Featured Events</h4>
        <Link to="/events" className="community-card-link">
          <span>View all</span>
          <span>→</span>
        </Link>
      </div>

      {event ? (
        <div className="community-wa-body-row">
          <Link to={detailUrl} style={{ textDecoration: 'none' }}>
            <div className="community-wa-date-box" style={{ cursor: 'pointer' }}>
              <span className="community-wa-date-month">{monthDisplay || 'OCT'}</span>
              <span className="community-wa-date-day">{dayDisplay || '10'}</span>
              <span className="community-wa-date-dow">{dayOfWeek || 'SAT'}</span>
            </div>
          </Link>

          <div className="community-wa-content">
            <span className="community-wa-tag">{tagText}</span>
            <h4 className="community-wa-title">
              <Link to={detailUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
                {event.title}
              </Link>
            </h4>
            <div className="community-wa-meta-row">
              <span className="community-wa-meta-item">
                <Clock size={13} className="community-wa-meta-icon" />
                <span>{timeText}</span>
              </span>
              <span className="community-wa-meta-item">
                <Monitor size={13} className="community-wa-meta-icon" />
                <span>{event.mode || 'Online'}</span>
              </span>
            </div>
          </div>

          <div className="community-wa-action-wrap">
            <Link
              to={detailUrl}
              className="community-join-workshop-btn"
            >
              <span>View Event</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="community-wa-empty-bar">
          <div className="community-wa-empty-inner">
            <div className="community-wa-empty-icon">
              <Calendar size={18} color="#CA8A38" />
            </div>
            <span className="community-wa-empty-text">
              New experiences are coming soon.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
