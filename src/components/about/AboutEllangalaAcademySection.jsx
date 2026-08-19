import React from 'react';
import academyVideo from '../../this_vidio_have_tumbnail_at_th.mp4';

export default function AboutEllangalaAcademySection() {
  const points = [
    {
      id: 1,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#CA8A38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Head profile facing right with smooth silhouette */}
          <path d="M8.5 21v-3.5a4 4 0 0 1 1.2-2.8L10 14h2l1-1a5.5 5.5 0 0 0 1.8-4c0-.5-.1-1-.2-1.5l.4-.5h1.5l.8 1.2a1 1 0 0 0 .8.5h.9v1.2l-.8.8v1.3l1.2 1.2a1 1 0 0 1 .2.8l-.5 2a2 2 0 0 1-1.4 1.4L16.5 21" />
          <path d="M8.5 17.5a8 8 0 0 1-2-5.5 8 8 0 0 1 9.5-7.8c2.2.5 4 2.2 4.5 4.5" />
          {/* Outlined heart in brain */}
          <path d="M12.8 7a1.2 1.2 0 0 0-1.7 0l-.3.3-.3-.3a1.2 1.2 0 0 0-1.7 1.7l2 2 2-2a1.2 1.2 0 0 0 0-1.7z" />
        </svg>
      ),
      text: "At Ellangala’s Academy, we are committed to nurturing positive minds and empowering individuals to lead meaningful, resilient, and fulfilling lives. By integrating the science of Positive Psychology with practical mind-training techniques and holistic well-being practices, we help people unlock their true potential and thrive in every aspect of life."
    },
    {
      id: 2,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#CA8A38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* User profile with star */}
          <circle cx="10" cy="7" r="4" />
          <path d="M3 20c0-3.3 2.7-6 6-6h2c1.8 0 3.3.8 4.4 2" />
          <polygon points="18.5 13 19.5 15.2 22 15.5 20.2 17.2 20.7 19.6 18.5 18.4 16.3 19.6 16.8 17.2 15 15.5 17.5 15.2 18.5 13" fill="none" stroke="#CA8A38" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      text: "Founded by Dr. Naveen Ellangala, a Positive Psychologist, Holistic Mind Coach, Psychotherapist, and author with over 17 years of experience, the academy has positively impacted thousands of individuals across schools, colleges, corporate organizations, and community groups."
    },
    {
      id: 3,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#CA8A38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Symmetrical 5-petal Lotus */}
          <path d="M12 3.5c-1.8 3.5-2.2 6.5-2.2 9 0 2.5 1 4 2.2 4.5 1.2-.5 2.2-2 2.2-4.5 0-2.5-.4-5.5-2.2-9z" />
          <path d="M12 17c-2.5 0-5.5-1.5-6.5-4.5-.8-2.5 0-5.5 1.8-7 1.5 2.2 2.8 5 4.7 6" />
          <path d="M12 17c2.5 0 5.5-1.5 6.5-4.5.8-2.5 0-5.5-1.8-7-1.5 2.2-2.8 5-4.7 6" />
          <path d="M4.5 15.5c2.5 1.5 5 2 7.5 2s5-.5 7.5-2" />
        </svg>
      ),
      text: "Our evidence-based workshops and training programs focus on developing mental resilience, emotional intelligence, self-awareness, positive thinking, and overall psychological well-being. Every program is designed to transform knowledge into daily practice, enabling individuals to build healthy thought patterns, manage emotions effectively, and cultivate lasting happiness."
    },
    {
      id: 4,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#CA8A38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Open Book */}
          <path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h5v14.5H6A2.5 2.5 0 0 0 3.5 21V6.5z" />
          <path d="M20.5 6.5A2.5 2.5 0 0 0 18 4h-5v14.5h5a2.5 2.5 0 0 1 2.5 2.5V6.5z" />
          <path d="M7 8.5h2" />
          <path d="M15 8.5h2" />
          <path d="M7 12.5h2" />
          <path d="M15 12.5h2" />
        </svg>
      ),
      text: "Dr. Naveen Ellangala’s sessions are known for their scientific foundation, practical application, engaging delivery, and transformative impact. By blending modern psychological research with timeless wisdom, he empowers participants to create meaningful and sustainable personal growth."
    },
    {
      id: 5,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#CA8A38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* 3 People Community Group */}
          <circle cx="12" cy="7.5" r="3" />
          <path d="M7 19.5v-1a5 5 0 0 1 10 0v1" />
          <circle cx="6" cy="11" r="2.2" />
          <path d="M2.5 19.5v-.5a4 4 0 0 1 4-4h.5" />
          <circle cx="18" cy="11" r="2.2" />
          <path d="M17 15h.5a4 4 0 0 1 4 4v.5" />
        </svg>
      ),
      text: "Whether you are a student striving for success, a parent seeking positive parenting strategies, a professional looking to enhance emotional well-being, or an organization aiming to build a mentally healthy workforce, Ellangala’s Academy provides the guidance, tools, and support you need."
    }
  ];

  return (
    <section
      className="about-ellangala-exact-section"
      style={{
        backgroundColor: '#FAF7F2',
        paddingTop: '110px',
        paddingBottom: '110px',
        position: 'relative',
        zIndex: 5,
        clear: 'both',
        fontFamily: "'Outfit', 'DM Sans', sans-serif"
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', position: 'relative', zIndex: 6 }}>
        <div className="row align-items-stretch g-4 g-lg-5">
          {/* ================= LEFT COLUMN ================= */}
          <div className="col-xl-5 col-lg-5 col-md-12 d-flex flex-column justify-content-between">
            <div style={{ paddingRight: '10px' }}>
              {/* Eyebrow */}
              <div style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    color: '#CA8A38',
                    fontSize: '13.5px',
                    fontWeight: '800',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    display: 'inline-block'
                  }}
                >
                  ELLANGALA ACADEMY
                </span>
                <div
                  style={{
                    width: '26px',
                    height: '2px',
                    backgroundColor: '#CA8A38',
                    marginTop: '6px'
                  }}
                />
              </div>

              {/* Main Heading */}
              <h2
                style={{
                  color: '#0A1C30',
                  fontSize: 'clamp(36px, 3.8vw, 48px)',
                  fontWeight: '800',
                  lineHeight: '1.16',
                  letterSpacing: '-0.5px',
                  margin: '18px 0 16px',
                  fontFamily: "'Playfair Display', Georgia, serif"
                }}
              >
                Positive <br />
                Psychology for <br />
                Meaningful <br />
                Life
              </h2>

              {/* Gold Line Under Heading */}
              <div
                style={{
                  width: '38px',
                  height: '2.5px',
                  backgroundColor: '#CA8A38',
                  marginBottom: '16px'
                }}
              />

              {/* Subtitle */}
              <p
                style={{
                  color: '#1F2937',
                  fontSize: '17px',
                  fontWeight: '600',
                  lineHeight: '1.5',
                  margin: 0
                }}
              >
                Empowering minds. <br />
                Enriching lives.
              </p>

              {/* Academy Video in Middle */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '430px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  marginTop: '1cm',
                  marginBottom: '55px'
                }}
              >
                <video
                  src={academyVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '16px',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Our Mission Card (Under Video) */}
              <div
                style={{
                  position: 'relative',
                  marginTop: '20px',
                  paddingLeft: '6px',
                  maxWidth: '430px'
                }}
              >
                {/* Large Green Double Quotes Graphic */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '-2px',
                    lineHeight: 1,
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                >
                  <svg width="64" height="50" viewBox="0 0 68 54" fill="#62BA80">
                    <path d="M28 26c0 14-8 26-24 28l-4-6c10-3 14-9 14-14H0V0h28v26zm40 0c0 14-8 26-24 28l-4-6c10-3 14-9 14-14H40V0h68v26z" />
                  </svg>
                </div>

                {/* Our Mission Title */}
                <h3
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    color: '#1E2238',
                    fontSize: '28px',
                    fontWeight: '800',
                    margin: '0 0 10px',
                    paddingTop: '16px',
                    fontFamily: "'Outfit', 'DM Sans', sans-serif"
                  }}
                >
                  Our Mission
                </h3>

                {/* Mission Paragraph Text */}
                <p
                  style={{
                    color: '#374151',
                    fontSize: '15px',
                    lineHeight: '1.65',
                    margin: '0 0 14px',
                    fontWeight: '450'
                  }}
                >
                  To empower individuals to transform their lives through systematic mind training.
                </p>

                {/* Green Bottom-Left Accent Bar */}
                <div
                  style={{
                    width: '6px',
                    height: '24px',
                    backgroundColor: '#62BA80',
                    borderRadius: '3px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (Card) ================= */}
          <div className="col-xl-7 col-lg-7 col-md-12 d-flex">
            <div
              className="about-exact-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                borderLeft: '4px solid #CA8A38',
                borderTop: '1px solid #EFEAE1',
                borderRight: '1px solid #EFEAE1',
                borderBottom: '1px solid #EFEAE1',
                boxShadow: '0 10px 32px rgba(0, 0, 0, 0.04)',
                padding: '40px 36px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                {points.map((item, index) => (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        padding: index === 0 ? '0 0 22px' : '22px 0',
                        flex: 1
                      }}
                    >
                      {/* Soft Pale Cream Circle Badge with Gold Icon */}
                      <div
                        style={{
                          width: '66px',
                          height: '66px',
                          borderRadius: '50%',
                          backgroundColor: '#FCF8F2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(202, 138, 56, 0.1)'
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* Paragraph Text */}
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '15px',
                            lineHeight: '1.68',
                            color: '#2D3748',
                            margin: 0,
                            fontWeight: '450',
                            letterSpacing: '0.05px',
                            fontFamily: "'Outfit', 'DM Sans', sans-serif"
                          }}
                        >
                          {item.text}
                        </p>
                      </div>
                    </div>

                    {/* Subtle Gold-Beige Dashed Divider between items */}
                    {index < points.length - 1 && (
                      <div
                        style={{
                          height: '1px',
                          borderBottom: '1px dashed #E8E0CE',
                          width: '100%'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
