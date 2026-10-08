import React from 'react';
import { Calendar, BookOpen, Users, Bell, ArrowRight } from 'lucide-react';
import communityLogo from '../../Images/Positive MindGym Community Logo.png';
import qrBanner from '../../Images/WhatsApp Community Join Banner.png';
import '../../assets/css/whatsapp-community-section.css';

const DEFAULT_WHATSAPP_LINK = 'https://chat.whatsapp.com/IyZEAg56HsI1VGZOXFojfa?s=cl&p=i&ilr=4&iam=2';

export default function WhatsAppCommunitySection({
  whatsappUrl = DEFAULT_WHATSAPP_LINK
}) {
  const features = [
    {
      id: 'announcements',
      icon: <Calendar size={22} strokeWidth={2.2} />,
      label: 'Program Announcements'
    },
    {
      id: 'workshops',
      icon: <BookOpen size={22} strokeWidth={2.2} />,
      label: 'Workshop Updates'
    },
    {
      id: 'events',
      icon: <Users size={22} strokeWidth={2.2} />,
      label: 'New Courses & Events'
    },
    {
      id: 'info',
      icon: <Bell size={22} strokeWidth={2.2} />,
      label: 'Important Information'
    }
  ];

  return (
    <section className="pmg-community-section" aria-label="Positive MindGym WhatsApp Community">
      {/* Background organic blur accents */}
      <div className="pmg-community-bg-shape-left" aria-hidden="true" />
      <div className="pmg-community-bg-shape-right" aria-hidden="true" />

      {/* Subtle organic waves */}
      <svg
        className="pmg-community-wave-svg"
        viewBox="0 0 1440 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,160 C320,240 420,80 720,130 C1020,180 1140,40 1440,110 L1440,220 L0,220 Z"
          fill="rgba(16, 185, 129, 0.05)"
        />
        <path
          d="M0,190 C360,110 520,230 860,150 C1200,70 1320,180 1440,140 L1440,220 L0,220 Z"
          fill="rgba(5, 150, 105, 0.04)"
        />
      </svg>

      <div className="pmg-community-container">
        <div className="pmg-community-row">
          {/* 1. Left Column: Logo moved 1cm to the border + 30% larger */}
          <div className="pmg-community-col-left">
            <div className="pmg-community-logo-wrap">
              <img
                src={communityLogo}
                alt="Positive MindGym Community - Train Your Mind, Transform Your Life"
                className="pmg-community-logo-img"
                loading="lazy"
              />
            </div>
            {/* Vertical divider */}
            <div className="pmg-community-divider" aria-hidden="true" />
          </div>

          {/* 2. Middle Column: Placed in EXACT middle, texts and button centered */}
          <div className="pmg-community-col-middle">
            <h2 className="pmg-community-title">
              Join Our <span className="pmg-community-title-highlight">WhatsApp Community</span>
            </h2>
            <p className="pmg-community-subtitle">
              Get latest program updates, workshop info, new courses and more.
            </p>

            <div className="pmg-community-features">
              {features.map((item) => (
                <div key={item.id} className="pmg-community-feature-item">
                  <div className="pmg-community-icon-circle">
                    {item.icon}
                  </div>
                  <p className="pmg-community-feature-label">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Join button in exact middle */}
            <div className="pmg-community-btn-wrap">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pmg-community-join-btn"
                aria-label="Join Our WhatsApp Community"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.186 8.186 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24h-.18zm-3.56 4.38c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52s1.08 2.92 1.23 3.12c.15.2 2.08 3.18 5.08 4.47.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.2-.58-.35-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.25-.58-.5-.5-.68-.51l-.58-.01z" />
                </svg>
                <span>Join WhatsApp Community</span>
                <ArrowRight size={17} className="pmg-btn-arrow" />
              </a>
            </div>
          </div>

          {/* 3. Right Column: Scanner image moved 1cm to the border + 20% larger */}
          <div className="pmg-community-col-right">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pmg-community-banner-wrap"
              title="Scan or Click to Join Our WhatsApp Community"
              aria-label="Scan QR code or click to join our WhatsApp Community"
            >
              <img
                src={qrBanner}
                alt="Scan & Join Our WhatsApp Community - Stay updated. Learn together. Grow together."
                className="pmg-community-banner-img"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
