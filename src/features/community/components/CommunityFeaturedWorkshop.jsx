import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Monitor, ChevronRight, Calendar } from 'lucide-react';

export default function CommunityFeaturedWorkshop({ event }) {
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
          <div className="community-wa-date-box">
            <span className="community-wa-date-month">{event.monthDisplay || 'OCT'}</span>
            <span className="community-wa-date-day">{event.dayDisplay || '21'}</span>
            <span className="community-wa-date-dow">{event.dayOfWeek || 'TUE'}</span>
          </div>

          <div className="community-wa-content">
            <span className="community-wa-tag">FEATURED EVENT</span>
            <h4 className="community-wa-title">{event.title}</h4>
            <div className="community-wa-meta-row">
              <span className="community-wa-meta-item">
                <Clock size={13} className="community-wa-meta-icon" />
                <span>{event.timeDisplay || '6:30 PM – 7:30 PM (IST)'}</span>
              </span>
              <span className="community-wa-meta-item">
                <Monitor size={13} className="community-wa-meta-icon" />
                <span>{event.mode || 'Online (Zoom)'}</span>
              </span>
            </div>
          </div>

          <div className="community-wa-action-wrap">
            <Link
              to={`/events/${event.slug || event.id}`}
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
