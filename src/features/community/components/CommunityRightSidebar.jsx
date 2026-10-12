import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Star,
  Clock,
  Video,
  ArrowRight,
  Calendar
} from 'lucide-react';

export default function CommunityRightSidebar({ sidebarData }) {
  const featuredCourse = sidebarData?.featuredCourse || {
    title: 'Bhagavad Gita for Modern Life',
    description: 'Timeless wisdom for a calmer, clearer and more purposeful life.',
    image: '/assets/images/community/featured-bhagavad-gita.png',
    badge: 'FEATURED',
    lessons: '12 Lessons',
    rating: '4.9 (1.2k students)',
    slug: 'bhagavad-gita-life'
  };

  const upcomingWorkshops = Array.isArray(sidebarData?.upcomingEvents) ? sidebarData.upcomingEvents : [];

  const recommendedCourses = sidebarData?.recommendedCourses?.length ? sidebarData.recommendedCourses : [
    {
      id: 'rec-1',
      title: 'The Science of Mindfulness',
      subtitle: 'A practical course for modern life.',
      image: '/assets/images/community/science-of-mindfulness-thumb.jpg',
      lessons: '8 Lessons',
      rating: '4.8',
      slug: 'mindfulness'
    },
    {
      id: 'rec-2',
      title: 'Personal Growth Blueprint',
      subtitle: 'Tools for a more intentional life.',
      image: '/assets/images/community/personal-growth-thumb.jpg',
      lessons: '10 Lessons',
      rating: '4.7',
      slug: 'positive-psychology'
    }
  ];

  return (
    <aside className="community-right-sidebar community-sidebar-sticky">
      {/* 1. Featured Course Card */}
      <div className="community-mock-card">
        <div className="community-card-head-row">
          <h4 className="community-card-title">Featured Course</h4>
          <Link to="/positive-workshops" className="community-card-link">
            <span>View all</span>
            <span>→</span>
          </Link>
        </div>

        <div className="community-fc-banner-wrap">
          <img
            src={featuredCourse.image || '/assets/images/community/featured-bhagavad-gita.png'}
            alt={featuredCourse.title}
            className="community-fc-img"
          />
          <span className="community-fc-badge-tag">
            {featuredCourse.badge || 'FEATURED'}
          </span>
        </div>

        <h3 className="community-fc-heading">{featuredCourse.title}</h3>
        <p className="community-fc-subtext">{featuredCourse.description}</p>

        <div className="community-fc-meta-row">
          <div className="community-meta-stat">
            <BookOpen size={13} className="community-meta-icon" />
            <span>{featuredCourse.lessons || '12 Lessons'}</span>
          </div>
          <div className="community-meta-stat">
            <Star size={13} className="community-meta-icon star" />
            <span>{featuredCourse.rating || '4.9 (1.2k students)'}</span>
          </div>
        </div>

        <Link to={`/programs/${featuredCourse.slug || 'bhagavad-gita-life'}`} className="community-fc-action-btn">
          <span>Continue Learning</span>
          <span>→</span>
        </Link>
      </div>

      {/* 2. Upcoming Events Card */}
      <div className="community-mock-card">
        <div className="community-card-head-row">
          <h4 className="community-card-title">Upcoming Events</h4>
          {upcomingWorkshops.length > 0 && (
            <Link to="/events" className="community-card-link">
              <span>See all</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {upcomingWorkshops.length > 0 ? (
          <div className="community-workshops-list">
            {upcomingWorkshops.map((ws, i) => (
              <Link
                key={ws.id || i}
                to={`/events/${ws.slug || ws.id}`}
                className="community-ws-item-link"
              >
                <div className="community-ws-date-badge">
                  <span className="community-ws-date-month">{ws.monthDisplay || ws.month || 'OCT'}</span>
                  <span className="community-ws-date-day">{ws.dayDisplay || ws.day || '21'}</span>
                </div>
                <div className="community-ws-info">
                  <h5 className="community-ws-title">{ws.title}</h5>
                  <div className="community-ws-meta-line">
                    <Clock size={11} />
                    <span>{ws.timeDisplay || ws.time || '6:30 PM - 7:30 PM (IST)'}</span>
                  </div>
                  <div className="community-ws-meta-line">
                    <Video size={11} />
                    <span>{ws.mode || 'Online (Zoom)'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="community-events-empty-card">
            <div className="community-events-empty-circle">
              <Calendar size={24} color="#CA8A38" />
            </div>
            <h5 className="community-events-empty-heading">
              New experiences are coming soon.
            </h5>
            <p className="community-events-empty-text">
              There are no upcoming events published at the moment. Check back for future workshops, MindGym sessions and Academy experiences.
            </p>
          </div>
        )}
      </div>

      {/* 3. Recommended for You Card */}
      <div className="community-mock-card">
        <div className="community-card-head-row">
          <h4 className="community-card-title">Recommended for You</h4>
          <Link to="/positive-workshops" className="community-card-link">
            <span>See all</span>
            <span>→</span>
          </Link>
        </div>

        <div className="community-rec-list">
          {recommendedCourses.map((rc, i) => (
            <Link
              key={rc.id || i}
              to={`/programs/${rc.slug || 'positive-psychology'}`}
              className="community-rec-item-link"
            >
              <img
                src={rc.image}
                alt={rc.title}
                className="community-rec-thumb"
              />
              <div className="community-rec-info">
                <h5 className="community-rec-title">{rc.title}</h5>
                <p className="community-rec-subtitle">{rc.subtitle || rc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
