import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useCommunityAuth } from '../context/CommunityAuthContext';
import { communityService } from '../services/communityService';

export default function CommunityWorkshopsView({ onReturnToFeed }) {
  const { user, token } = useCommunityAuth();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityService.getUserWorkshops(token)
      .then(res => setWorkshops(res?.enrolledEvents || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const list = workshops.length > 0 ? workshops : (user?.enrolledEvents || []);

  return (
    <div className="community-workshops-view">
      {/* Header */}
      <div className="community-learning-header-card">
        <div className="community-learning-header-meta">
          <div className="community-learning-badge">
            <Sparkles size={14} color="#CA8A38" />
            <span>Live Interactive Sessions</span>
          </div>
          <h2 className="community-learning-title">
            My Enrolled Workshops
          </h2>
          <p className="community-learning-desc">
            View your upcoming live masterclasses, interactive healing circles, and direct Zoom meeting links.
          </p>
        </div>
      </div>

      <div className="community-section-title-row" style={{ marginTop: '20px' }}>
        <h3 className="community-subheading">Upcoming Registered Circles</h3>
        <button
          type="button"
          className="community-btn-text-link"
          onClick={onReturnToFeed}
        >
          ← Back to Community Feed
        </button>
      </div>

      {list.length === 0 ? (
        <div className="community-empty-card-container">
          <div className="community-empty-icon-circle">
            <Calendar size={32} color="#CA8A38" />
          </div>
          <h4 style={{ margin: '10px 0 6px 0', fontSize: '17px', color: '#0F172A', fontWeight: '700' }}>
            New experiences are coming soon.
          </h4>
          <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '13px', maxWidth: '400px' }}>
            You haven't enrolled in any live workshops yet. Check our upcoming events to reserve your seat in the next session.
          </p>
          <Link
            to="/events"
            className="community-btn-join"
            style={{ display: 'inline-flex', padding: '9px 20px', textDecoration: 'none' }}
          >
            Explore Academy Workshops
          </Link>
        </div>
      ) : (
        <div className="community-workshops-cards-grid">
          {list.map((evt) => (
            <div key={evt.id || evt.slug} className="community-enrolled-workshop-card">
              <div className="workshop-date-flag">
                <span className="month">{evt.monthDisplay || 'OCT'}</span>
                <span className="day">{evt.dayDisplay || '21'}</span>
                <span className="dow">{evt.dayOfWeek || 'TUE'}</span>
              </div>

              <div className="workshop-info-block">
                <div className="workshop-status-row">
                  <span className="workshop-cat-badge">{evt.category || 'Healing Workshop'}</span>
                  <span className="workshop-confirmed-badge">
                    <CheckCircle2 size={13} />
                    <span>Seat Confirmed</span>
                  </span>
                </div>

                <h4 className="workshop-event-title">{evt.title}</h4>

                <div className="workshop-meta-items">
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>{evt.timeDisplay || '6:30 PM – 7:30 PM (IST)'}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={14} />
                    <span>{evt.venue || 'Online (Zoom)'}</span>
                  </div>
                </div>

                <div className="workshop-action-row">
                  <a
                    href={evt.zoomLink || 'https://zoom.us'}
                    target="_blank"
                    rel="noreferrer"
                    className="workshop-zoom-btn"
                  >
                    <Video size={16} />
                    <span>Join Live Zoom Session</span>
                    <ExternalLink size={13} />
                  </a>

                  <Link
                    to={`/events/${evt.slug}`}
                    className="workshop-details-link"
                  >
                    <span>View Workshop Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
