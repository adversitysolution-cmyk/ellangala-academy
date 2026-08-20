import React from 'react';
import '../../assets/css/about-foundation.css';
import centerArtworkImg from '../../Images/about-foundation-center.png';

const AboutFoundationSection = () => {
  return (
    <section className="foundation-section" id="foundation">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" id="vision-mission">
          <div className="foundation-lotus-icon">
            <svg width="44" height="34" viewBox="0 0 48 36" fill="none">
              <path d="M24 3C24 3 19 13 19 22C19 26 21 29 24 29C27 29 29 26 29 22C29 13 24 3 24 3Z" fill="#C79B3B" />
              <path d="M24 9C24 9 13 15 11 23C10 27 12 30 15 30C19 30 23 25 24 9Z" fill="#D8AB5C" opacity="0.95" />
              <path d="M24 9C24 9 35 15 37 23C38 27 36 30 33 30C29 30 25 25 24 9Z" fill="#D8AB5C" opacity="0.95" />
              <path d="M24 17C24 17 10 21 5 27C3 29 5 32 8 32C13 32 21 27 24 17Z" fill="#C79B3B" opacity="0.8" />
              <path d="M24 17C24 17 38 21 43 27C45 29 43 32 40 32C35 32 27 27 24 17Z" fill="#C79B3B" opacity="0.8" />
            </svg>
          </div>
          <span className="eyebrow">— OUR FOUNDATION —</span>
          <h2>Guided by Purpose. Inspired by Vision.</h2>
          <p>
            The principles that shape every mind-training journey at Ellangala Academy.
          </p>
        </div>

        {/* Foundation Grid */}
        <div className="foundation-grid">
          {/* Mission Content */}
          <div className="foundation-card mission-card">
            <h3>OUR <span>MISSION</span></h3>
            <div className="card-statement">
              To empower individuals to transform their lives through systematic mind training.
            </div>
            <p className="card-desc">
              We aim to make mind training a practical and meaningful part of everyday life. Through Positive Psychology, Neuroscience, Spiritual Psychology, and evidence-informed mind training methods, we help people cultivate emotional wellbeing, mental resilience, self-awareness, and a meaningful life.
            </p>
            <div className="features">
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2F8F9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04Z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04Z" />
                </svg>
                Systematic Mind Training
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2F8F9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                Emotional Wellbeing
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2F8F9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2.5" />
                  <path d="M6 19a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4" />
                  <path d="M4 17l4-3 4 2 4-2 4 3" />
                </svg>
                Positive Psychology
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2F8F9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Practical Daily Application
              </div>
            </div>
          </div>

          {/* Center Brain Artwork */}
          <div className="center-brain">
            <div className="brain-rings"></div>
            <img
              src={centerArtworkImg}
              alt="Ellangala Academy Mind Training & Lotus Bloom"
            />
          </div>

          {/* Vision Content */}
          <div className="foundation-card vision-card">
            <h3>OUR <span>VISION</span></h3>
            <div className="card-statement">
              To create a mentally healthy, emotionally balanced, purposeful, and spiritually enriched society through mind training.
            </div>
            <p className="card-desc">
              We envision communities where individuals are equipped with the awareness, skills, and inner strength needed to thrive personally, professionally, and socially.
            </p>
            <div className="features">
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3B76BB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Mentally Healthy Society
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3B76BB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                </svg>
                Purposeful Living
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3B76BB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4C12 4 8 10 8 16C8 19 10 21 12 21C14 21 16 19 16 16C16 10 12 4 12 4Z" />
                  <path d="M12 10C9 13 4 16 4 19C4 21 6 22 8 22C11 22 12 18 12 10Z" />
                  <path d="M12 10C15 13 20 16 20 19C20 21 18 22 16 22C13 22 12 18 12 10Z" />
                </svg>
                Spiritual Growth
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3B76BB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                  <path d="M14 9h5v5" />
                </svg>
                Lifelong Transformation
              </div>
            </div>
          </div>
        </div>

        {/* Quote Box */}
        <div className="quote-box">
          <span style={{ color: '#C79B3B', fontSize: '28px', fontStyle: 'normal' }}>❝</span>
          When the mind is trained, life transforms.
          <span style={{ color: '#C79B3B', fontSize: '28px', fontStyle: 'normal' }}>❞</span>
        </div>
      </div>
    </section>
  );
};

export default AboutFoundationSection;
