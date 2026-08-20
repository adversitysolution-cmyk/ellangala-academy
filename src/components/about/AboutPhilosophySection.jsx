import React from 'react';
import '../../assets/css/about-philosophy.css';
import philosophyImg from '../../Images/ChatGPT Image Aug 20, 2026, 03_33_18 PM.png';

const AboutPhilosophySection = () => {
  return (
    <section className="philosophy-section" id="philosophy">
      <div className="container">
        {/* Main 2-Column Grid */}
        <div className="philosophy-grid">
          {/* Left Content Column */}
          <div className="philosophy-content">
            {/* Eyebrow with Lotus */}
            <div className="philosophy-eyebrow-wrap">
              <span className="philosophy-lotus-icon">
                <svg width="24" height="20" viewBox="0 0 48 36" fill="none">
                  <path d="M24 3C24 3 19 13 19 22C19 26 21 29 24 29C27 29 29 26 29 22C29 13 24 3 24 3Z" fill="#C59239" />
                  <path d="M24 9C24 9 13 15 11 23C10 27 12 30 15 30C19 30 23 25 24 9Z" fill="#D8AB5C" opacity="0.95" />
                  <path d="M24 9C24 9 35 15 37 23C38 27 36 30 33 30C29 30 25 25 24 9Z" fill="#D8AB5C" opacity="0.95" />
                  <path d="M24 17C24 17 10 21 5 27C3 29 5 32 8 32C13 32 21 27 24 17Z" fill="#C59239" opacity="0.8" />
                  <path d="M24 17C24 17 38 21 43 27C45 29 43 32 40 32C35 32 27 27 24 17Z" fill="#C59239" opacity="0.8" />
                </svg>
              </span>
              <div className="philosophy-eyebrow-divider" />
              <span className="philosophy-eyebrow">OUR PHILOSOPHY</span>
              <div className="philosophy-eyebrow-line" />
            </div>

            {/* Heading in exact 3 lines */}
            <h2 className="philosophy-heading">
              <span className="philosophy-heading-line">Mind Training is as</span>
              <span className="philosophy-heading-line">important as</span>
              <span className="philosophy-heading-line highlight">Physical Training.</span>
            </h2>

            {/* 3 Core Points with Connector Line */}
            <div className="philosophy-points">
              {/* Point 1: Mind / Brain */}
              <div className="philosophy-point-item">
                <div className="philosophy-point-badge philosophy-point-badge--green">
                  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="#2E7E5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 28v-3c-4.4 0-8-3.6-8-8 0-3.3 2-6.2 5-7.4V9c0-5 4-9 9-9 4.7 0 8.6 3.6 9 8.2 2.9 1.4 5 4.3 5 7.8 0 4.4-3.6 8-8 8v3" />
                    <path d="M14 11c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.1-.6 2.1-1.5 2.6V15" />
                    <path d="M12 17c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
                    <path d="M13 21h6" />
                  </svg>
                </div>
                <div className="philosophy-point-dot philosophy-point-dot--green" />
                <p className="philosophy-point-text">
                  We believe that just as we train and care for the body to maintain physical health, the mind also needs regular training, awareness, and practice to maintain psychological and emotional wellbeing.
                </p>
              </div>

              {/* Point 2: Meditation / Heart Self */}
              <div className="philosophy-point-item">
                <div className="philosophy-point-badge philosophy-point-badge--gold">
                  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="#C29140" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="16" cy="7" r="3.5" />
                    <path d="M9 25c0-4 3.1-7 7-7s7 3 7 7" />
                    <path d="M7 26c1-2 3.5-3 5-3" />
                    <path d="M25 26c-1-2-3.5-3-5-3" />
                    <path d="M16 14.2c-.7-.7-1.7-.6-2.1 0-.5.6-.3 1.4.3 2l1.8 1.8 1.8-1.8c.6-.6.8-1.4.3-2-.4-.6-1.4-.7-2.1 0Z" fill="#C29140" stroke="none" />
                  </svg>
                </div>
                <div className="philosophy-point-dot philosophy-point-dot--gold" />
                <p className="philosophy-point-text">
                  We believe that every individual has the potential to transform their life by training the mind.
                </p>
              </div>

              {/* Point 3: Blooming Lotus */}
              <div className="philosophy-point-item">
                <div className="philosophy-point-badge philosophy-point-badge--blue">
                  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="#3B6E9F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 5c0 0-4 6-4 12 0 3 1.8 5 4 5s4-2 4-5c0-6-4-12-4-12Z" />
                    <path d="M16 11c0 0-7 4-8 10-.5 3 1.5 5 4 5 3 0 4.5-3 4.5-6" />
                    <path d="M16 11c0 0 7 4 8 10 .5 3-1.5 5-4 5-3 0-4.5-3-4.5-6" />
                    <path d="M10 26c3 1.5 9 1.5 12 0" />
                  </svg>
                </div>
                <div className="philosophy-point-dot philosophy-point-dot--blue" />
                <p className="philosophy-point-text">
                  A trained mind can develop healthier thought patterns, emotional resilience, positive habits, meaningful relationships, and a greater sense of purpose.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="philosophy-image-wrap">
            <img
              src={philosophyImg}
              alt="Ellangala Academy - Mind Training Philosophy"
              className="philosophy-main-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPhilosophySection;
