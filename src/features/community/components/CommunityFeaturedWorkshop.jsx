import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Monitor, ChevronRight } from 'lucide-react';

export default function CommunityFeaturedWorkshop({ event }) {
  if (!event) return null;
  const currentEvent = event;

  return (
    <div className="community-workshop-alert-card">
      <div className="community-wa-date-box">
        <span className="community-wa-date-month">{currentEvent.monthDisplay || 'OCT'}</span>
        <span className="community-wa-date-day">{currentEvent.dayDisplay || '21'}</span>
        <span className="community-wa-date-dow">{currentEvent.dayOfWeek || 'TUE'}</span>
      </div>

      <div className="community-wa-content">
        <span className="community-wa-tag">UPCOMING WORKSHOP</span>
        <h4 className="community-wa-title">{currentEvent.title}</h4>
        <div className="community-wa-meta-row">
          <span className="community-wa-meta-item">
            <Clock size={13} className="community-wa-meta-icon" />
            <span>{currentEvent.timeDisplay || '6:30 PM – 7:30 PM (IST)'}</span>
          </span>
          <span className="community-wa-meta-item">
            <Monitor size={13} className="community-wa-meta-icon" />
            <span>{currentEvent.mode || 'Online (Zoom)'}</span>
          </span>
        </div>
      </div>

      <div className="community-wa-action-wrap">
        <Link
          to={`/events/${currentEvent.slug || currentEvent.id}/register`}
          className="community-join-workshop-btn"
        >
          <span>Join Workshop</span>
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}
