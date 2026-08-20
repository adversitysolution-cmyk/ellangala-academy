import React from 'react';
import '../../assets/css/about-methodology.css';
import methodologyCenterImg from '../../Images/ChatGPT Image Aug 20, 2026, 04_05_27 PM.png';

const AboutMethodologySection = () => {
  return (
    <section className="methodology-section" id="methodology">
      <div className="container">
        {/* Top Header */}
        <div className="methodology-header">
          <div className="methodology-lotus-top">
            <svg width="34" height="28" viewBox="0 0 48 36" fill="none">
              <path d="M24 3C24 3 19 13 19 22C19 26 21 29 24 29C27 29 29 26 29 22C29 13 24 3 24 3Z" fill="#C59239" />
              <path d="M24 9C24 9 13 15 11 23C10 27 12 30 15 30C19 30 23 25 24 9Z" fill="#D8AB5C" opacity="0.95" />
              <path d="M24 9C24 9 35 15 37 23C38 27 36 30 33 30C29 30 25 25 24 9Z" fill="#D8AB5C" opacity="0.95" />
              <path d="M24 17C24 17 10 21 5 27C3 29 5 32 8 32C13 32 21 27 24 17Z" fill="#C59239" opacity="0.8" />
              <path d="M24 17C24 17 38 21 43 27C45 29 43 32 40 32C35 32 27 27 24 17Z" fill="#C59239" opacity="0.8" />
            </svg>
          </div>
          <h2 className="methodology-title">Our Methodology</h2>
          <p className="methodology-subtitle">
            At Ellangala’s Academy, we integrate modern psychological science with Indian wisdom traditions to create a holistic approach to mind training.
          </p>
        </div>

        {/* Center Pill Badge */}
        <div className="methodology-pill-wrap">
          <div className="methodology-pill">Our approach draws from:</div>
          <div className="methodology-dots-row">
            <span style={{ backgroundColor: '#3C7149' }} />
            <span style={{ backgroundColor: '#6B3E93' }} />
            <span style={{ backgroundColor: '#B8681E' }} />
            <span style={{ backgroundColor: '#417855' }} />
            <span style={{ backgroundColor: '#276097' }} />
            <span style={{ backgroundColor: '#C35B27' }} />
            <span style={{ backgroundColor: '#1E8392' }} />
            <span style={{ backgroundColor: '#854D88' }} />
          </div>
        </div>

        {/* Main Diagram Area with Desktop SVG Overlay */}
        <div className="methodology-diagram-wrap">
          {/* SVG Connecting Link Lines Overlay (Balanced 4 on Left, 4 on Right) */}
          <svg
            className="methodology-svg-overlay"
            viewBox="0 0 1200 560"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Left 1: Positive Psychology (Green) */}
            <path
              d="M 360 62 L 405 62 L 452 145"
              stroke="#3C7149"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx="360" cy="62" r="3.5" fill="#3C7149" />
            <circle cx="452" cy="145" r="4.5" fill="#3C7149" stroke="#FFF" strokeWidth="2" />

            {/* Left 2: Neuroscience & Neuroplasticity (Purple) */}
            <path
              d="M 360 195 L 398 195 L 418 226"
              stroke="#6B3E93"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx="360" cy="195" r="3.5" fill="#6B3E93" />
            <circle cx="418" cy="226" r="4.5" fill="#6B3E93" stroke="#FFF" strokeWidth="2" />

            {/* Left 3: Indian Psychology & Spiritual Psychology (Gold) */}
            <path
              d="M 360 335 L 412 335 L 428 348"
              stroke="#B8681E"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx="360" cy="335" r="3.5" fill="#B8681E" />
            <circle cx="428" cy="348" r="4.5" fill="#B8681E" stroke="#FFF" strokeWidth="2" />

            {/* Left 4: Yoga Psychology (Sage) */}
            <path
              d="M 360 472 L 418 472 L 468 440"
              stroke="#417855"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx="360" cy="472" r="3.5" fill="#417855" />
            <circle cx="468" cy="440" r="4.5" fill="#417855" stroke="#FFF" strokeWidth="2" />

            {/* Right 1: NLP (Blue) */}
            <path
              d="M 840 62 L 795 62 L 748 145"
              stroke="#276097"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx="840" cy="62" r="3.5" fill="#276097" />
            <circle cx="748" cy="145" r="4.5" fill="#276097" stroke="#FFF" strokeWidth="2" />

            {/* Right 2: CBT (Orange) */}
            <path
              d="M 840 195 L 802 195 L 782 226"
              stroke="#C35B27"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx="840" cy="195" r="3.5" fill="#C35B27" />
            <circle cx="782" cy="226" r="4.5" fill="#C35B27" stroke="#FFF" strokeWidth="2" />

            {/* Right 3: Psychotherapy (Teal) */}
            <path
              d="M 840 335 L 788 335 L 772 348"
              stroke="#1E8392"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx="840" cy="335" r="3.5" fill="#1E8392" />
            <circle cx="772" cy="348" r="4.5" fill="#1E8392" stroke="#FFF" strokeWidth="2" />

            {/* Right 4: Clinical Hypnotherapy (Violet) */}
            <path
              d="M 840 472 L 782 472 L 732 440"
              stroke="#854D88"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx="840" cy="472" r="3.5" fill="#854D88" />
            <circle cx="732" cy="440" r="4.5" fill="#854D88" stroke="#FFF" strokeWidth="2" />
          </svg>

          <div className="methodology-diagram">
            {/* Left Column (4 Cards) */}
            <div className="methodology-cards-col methodology-cards-col--left">
              {/* 1. Positive Psychology */}
              <div className="methodology-card methodology-card--green">
                <div className="methodology-card-badge">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21V11" />
                    <path d="M12 11c0-4.5 3.5-7 7-7 0 4.5-2.5 7-7 7z" fill="currentColor" fillOpacity="0.2" />
                    <path d="M12 14c0-3.5-3-5.5-6-5.5 0 3.5 2 5.5 6 5.5z" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="12" cy="11" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="methodology-card-content">
                  <h3 className="methodology-card-title">Positive Psychology</h3>
                  <p className="methodology-card-text">
                    Cultivating strengths, wellbeing, resilience, and flourishing.
                  </p>
                </div>
                <span className="methodology-line-tag" />
              </div>

              {/* 2. Neuroscience & Neuroplasticity */}
              <div className="methodology-card methodology-card--purple">
                <div className="methodology-card-badge">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
                  </svg>
                </div>
                <div className="methodology-card-content">
                  <h3 className="methodology-card-title">Neuroscience &amp; Neuroplasticity</h3>
                  <p className="methodology-card-text">
                    Understanding how the brain and mind can change through learning and practice.
                  </p>
                </div>
                <span className="methodology-line-tag" />
              </div>

              {/* 3. Indian Psychology & Spiritual Psychology */}
              <div className="methodology-card methodology-card--gold">
                <div className="methodology-card-badge">
                  <span style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'serif', lineHeight: 1 }}>ॐ</span>
                </div>
                <div className="methodology-card-content">
                  <h3 className="methodology-card-title">Indian Psychology &amp; Spiritual Psychology</h3>
                  <p className="methodology-card-text">
                    Exploring self-awareness, consciousness, purpose of life, values, and inner wellbeing.
                  </p>
                </div>
                <span className="methodology-line-tag" />
              </div>

              {/* 4. Yoga Psychology */}
              <div className="methodology-card methodology-card--sage">
                <div className="methodology-card-badge">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="2.2" />
                    <path d="M12 7.5v6M8 11.5l4 2 4-2M5 18l4-1.8 3 2.5 3-2.5 4 1.8M6.5 16l-3 3.5h17l-3-3.5" />
                  </svg>
                </div>
                <div className="methodology-card-content">
                  <h3 className="methodology-card-title">Yoga Psychology</h3>
                  <p className="methodology-card-text">
                    Developing awareness, balance, concentration, and self-regulation.
                  </p>
                </div>
                <span className="methodology-line-tag" />
              </div>
            </div>

            {/* Center Column: Circular Meditation Visual */}
            <div className="methodology-center-wrap">
              <div className="methodology-circle-container">
                <img
                  src={methodologyCenterImg}
                  alt="Meditation & Holistic Mind Training"
                  className="methodology-circle-img"
                />
              </div>
            </div>

            {/* Right Column (4 Cards) */}
            <div className="methodology-cards-col methodology-cards-col--right">
              {/* 5. NLP (Neuro-Linguistic Programming) */}
              <div className="methodology-card methodology-card--blue">
                <span className="methodology-line-tag" />
                <div className="methodology-card-badge">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0-6 6v3a4 4 0 0 0 4 4h1v3l3-2h1a6 6 0 0 0 6-6V9a6 6 0 0 0-6-6z" />
                    <circle cx="9.5" cy="9" r="1" fill="currentColor" />
                    <circle cx="12.5" cy="9" r="1" fill="currentColor" />
                    <circle cx="15.5" cy="9" r="1" fill="currentColor" />
                  </svg>
                </div>
                <div className="methodology-card-content">
                  <h3 className="methodology-card-title">NLP (Neuro-Linguistic Programming)</h3>
                  <p className="methodology-card-text">
                    Understanding patterns of thinking, communication, and behaviour.
                  </p>
                </div>
              </div>

              {/* 6. CBT (Cognitive Behavioural Therapy) */}
              <div className="methodology-card methodology-card--orange">
                <span className="methodology-line-tag" />
                <div className="methodology-card-badge">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <path d="M10 7a2 2 0 0 1 4 0c0 1.2-1 1.8-2 2" strokeWidth="1.6" />
                    <circle cx="12" cy="11.5" r="0.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="methodology-card-content">
                  <h3 className="methodology-card-title">CBT (Cognitive Behavioural Therapy)</h3>
                  <p className="methodology-card-text">
                    Developing healthier patterns of thinking and behaviour.
                  </p>
                </div>
              </div>

              {/* 7. Psychotherapy */}
              <div className="methodology-card methodology-card--teal">
                <span className="methodology-line-tag" />
                <div className="methodology-card-badge">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    <path d="M12 9v6m-3-3h6" strokeWidth="1.6" />
                  </svg>
                </div>
                <div className="methodology-card-content">
                  <h3 className="methodology-card-title">Psychotherapy</h3>
                  <p className="methodology-card-text">
                    Supporting psychological growth, emotional wellbeing, and personal transformation.
                  </p>
                </div>
              </div>

              {/* 8. Clinical Hypnotherapy (Newly Added for Balance) */}
              <div className="methodology-card methodology-card--violet">
                <span className="methodology-line-tag" />
                <div className="methodology-card-badge">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
                    <circle cx="12" cy="12" r="5.5" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <path d="M12 3v2m0 14v2M3 12h2m14 0h2" strokeWidth="1.6" />
                  </svg>
                </div>
                <div className="methodology-card-content">
                  <h3 className="methodology-card-title">Clinical Hypnotherapy</h3>
                  <p className="methodology-card-text">
                    Using focused attention, relaxation, and guided suggestion to support self-awareness and positive change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Centered Statement (Direct on page, no card, no icons) */}
        <div className="methodology-bottom-statement">
          <h4 className="methodology-bottom-title">
            Our approach is practical, experiential, and evidence-informed.
          </h4>
          <p className="methodology-bottom-desc">
            We focus not only on understanding the mind,<br />
            but also on training the mind through regular practice.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMethodologySection;
