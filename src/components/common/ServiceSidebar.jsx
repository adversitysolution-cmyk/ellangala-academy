import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEnrollModal } from '../../context/EnrollModalContext';

const WORKSHOP_ITEMS = [
  { name: "Positive Psychology for a Meaningful Life", path: "/programs/positive-psychology-meaningful-life" },
  { name: "Spiritual Psychology for Daily Life", path: "/programs/spiritual-psychology-purposeful-life" },
  { name: "Positive Parenting", path: "/programs/positive-parenting" },
  { name: "Positive Teaching", path: "/programs/positive-teaching" },
  { name: "Student Success Mindset", path: "/programs/student-success-mindset" },
  { name: "The Art of Mind Training", path: "/programs/the-art-of-mind-training" },
  { name: "Positive Psychology at Workplace", path: "/programs/positive-psychology-at-the-workplace" },
  { name: "Bhagavad Gita for Daily Life", path: "/programs/bhagavadgita-for-daily-life" },
  { name: "Mind & Emotional Wellness", path: "/programs/mind-and-emotional-wellness" }
];

const MENTORING_ITEMS = [
  { name: "Student Mentoring", path: "/mentoring/student-mentoring" },
  { name: "Parent Mentoring", path: "/mentoring/parent-mentoring" },
  { name: "Teacher Mentoring", path: "/mentoring/teacher-mentoring" },
  { name: "Personal Mentoring", path: "/mentoring/personal-mentoring" },
  { name: "Life Mentoring", path: "/mentoring/life-mentoring" },
  { name: "Career Mentoring", path: "/mentoring/career-mentoring" },
  { name: "Purpose Mentoring", path: "/mentoring/purpose-mentoring" },
  { name: "Mindset Mentoring", path: "/mentoring/mindset-mentoring" },
  { name: "Spiritual Mentoring", path: "/mentoring/spiritual-mentoring" }
];

const MINDGYM_ITEMS = [
  { name: "Positive MindGym App", path: "/mindgym/app" },
  { name: "Positive MindGym Centre", path: "/mindgym/mind-gym" },
  { name: "Positive Mind Toolkit", path: "/mindgym/toolkit" }
];

export default function ServiceSidebar({ currentProgram, category }) {
  const location = useLocation();
  const { openEnrollModal } = useEnrollModal();

  const path = location.pathname.toLowerCase();
  const catLower = (category || '').toLowerCase();

  let sidebarTitle = "Positive Workshops";
  let sidebarItems = WORKSHOP_ITEMS;

  if (path.includes('/mentoring') || catLower.includes('mentoring')) {
    sidebarTitle = "Positive Mentoring";
    sidebarItems = MENTORING_ITEMS;
  } else if (path.includes('/mindgym') || catLower.includes('mindgym')) {
    sidebarTitle = "Positive MindGym";
    sidebarItems = MINDGYM_ITEMS;
  } else {
    sidebarTitle = "Positive Workshops";
    sidebarItems = WORKSHOP_ITEMS;
  }

  const activeProgramTitle = currentProgram || "Academy Programs";

  return (
    <div className="col-xl-4">
      <div className="sidebar">
        {/* Services List Sidebar */}
        <div className="sidebar__single sidebar__services wow animated fadeInUp" data-wow-delay="0.1s">
          <div className="title-box">
            <h2>{sidebarTitle}</h2>
          </div>
          <div className="sidebar__services-box">
            <ul className="sidebar__services-box-list clearfix">
              {sidebarItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={index}>
                    <Link className={isActive ? 'active' : ''} to={item.path}>
                      {item.name}
                      <span className="icon-diagonal-arrow"></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Redesigned Sidebar CTA Banner (Matching Image 1) */}
        <div
          className="sidebar__single sidebar__contact-redesigned wow animated fadeInUp"
          data-wow-delay="0.3s"
          style={{
            backgroundImage: 'linear-gradient(rgba(35, 25, 20, 0.4), rgba(35, 25, 20, 0.4)), url("/assets/images/slider/sidebanner bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '16px',
            padding: '36px 24px 32px',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Circular Icon Badge */}
          <div
            style={{
              width: '82px',
              height: '82px',
              borderRadius: '50%',
              backgroundColor: '#D4A359',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 6px 16px rgba(212, 163, 89, 0.3)',
            }}
          >
            <i
              className="fas fa-id-card"
              style={{
                fontSize: '36px',
                color: '#ffffff',
              }}
            ></i>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#ffffff',
              lineHeight: '1.3',
              marginBottom: '24px',
              fontFamily: 'var(--uterpy-font, sans-serif)',
            }}
          >
            Ready to begin <br />
            your journey?
          </h2>

          {/* ENROLL NOW Button */}
          <button
            type="button"
            onClick={() => openEnrollModal(activeProgramTitle)}
            style={{
              width: '100%',
              padding: '14px 20px',
              backgroundColor: '#D4A359',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(212, 163, 89, 0.4)',
              transition: 'all 0.25s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#CA8A38';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(202, 138, 56, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D4A359';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 163, 89, 0.4)';
            }}
          >
            <span>ENROLL NOW</span>
            <i className="fas fa-arrow-right" style={{ fontSize: '13px' }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
