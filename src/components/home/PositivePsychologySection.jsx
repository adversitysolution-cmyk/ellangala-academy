import React, { useState, useEffect } from 'react';

// Real screenshots from POSITIVE MINDGYM APP folder
import imgDailyWorkout from '../../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.46 PM (1).jpeg';
import imgHomeMindScore from '../../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.46 PM.jpeg';
import imgAllModules from '../../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.47 PM (1).jpeg';
import imgMorningPractice from '../../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.47 PM.jpeg';
import imgStudentsCornerFull from '../../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.48 PM (1).jpeg';
import imgBoxBreathing from '../../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.48 PM.jpeg';

export default function PositivePsychologySection() {
  const [activeDot, setActiveDot] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // App screens ordered for smooth scrolling
  const appScreens = [
    { id: 0, title: 'All Modules', img: imgAllModules },
    { id: 1, title: 'Morning Practice', img: imgMorningPractice },
    { id: 2, title: 'Mind Score', img: imgHomeMindScore },
    { id: 3, title: 'Daily Workout', img: imgDailyWorkout },
    { id: 4, title: 'Student Corner', img: imgStudentsCornerFull },
    { id: 5, title: 'Box Breathing', img: imgBoxBreathing },
  ];

  // Auto-scroll slideshow with interval
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % appScreens.length);
    }, 3400);
    return () => clearInterval(interval);
  }, [isHovered, appScreens.length]);

  return (
    <section
      className="positive-mindgym-promo-section"
      style={{
        backgroundColor: '#FAF8F3',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '75px',
        paddingBottom: '180px',
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
      }}
    >
      {/* ─── Embedded Keyframe & Micro-movement Styles ─── */}
      <style>{`
        @keyframes gentleFloatFront {
          0%, 100% { transform: perspective(1000px) rotateY(-2deg) translateY(0px); }
          50% { transform: perspective(1000px) rotateY(-3deg) translateY(-10px); }
        }
        @keyframes gentleFloatMid {
          0%, 100% { transform: perspective(1000px) rotateY(-5deg) scale(0.95) translateY(0px); }
          50% { transform: perspective(1000px) rotateY(-6deg) scale(0.95) translateY(-7px); }
        }
        @keyframes gentleFloatBack {
          0%, 100% { transform: perspective(1000px) rotateY(-8deg) scale(0.88) translateY(0px); }
          50% { transform: perspective(1000px) rotateY(-9deg) scale(0.88) translateY(-4px); }
        }
        .phone-track-transition {
          transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .phone-card-hover {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
        }
      `}</style>

      {/* ─── Background Subtle Elements ─── */}
      {/* Floating Gold Ring 1 */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '42px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '2px solid rgba(217, 164, 65, 0.4)',
          pointerEvents: 'none',
        }}
      />
      {/* Floating Gold Ring 2 */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '52%',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: '1.5px solid rgba(217, 164, 65, 0.35)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Dot Grid */}
      <div
        style={{
          position: 'absolute',
          top: '25px',
          left: '46%',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 4px)',
          gap: '14px',
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#D9A441',
            }}
          />
        ))}
      </div>

      {/* Concentric Thin Rings Behind Phones */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-100px',
          width: '760px',
          height: '760px',
          borderRadius: '50%',
          border: '1px solid rgba(217, 164, 65, 0.08)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-40px',
          width: '640px',
          height: '640px',
          borderRadius: '50%',
          border: '1px solid rgba(217, 164, 65, 0.06)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div className="row align-items-center" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* ======================================================== */}
          {/* LEFT COLUMN: MARKETING & DOWNLOAD CONTENT                */}
          {/* ======================================================== */}
          <div
            className="col-xl-6 col-lg-6 col-md-12"
            style={{ paddingRight: '28px', marginBottom: '40px' }}
          >
            {/* 1. Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '9px',
                border: '1.5px solid #D9A441',
                borderRadius: '50px',
                padding: '7px 18px',
                backgroundColor: 'rgba(250, 248, 243, 0.8)',
                marginBottom: '26px',
                boxShadow: '0 2px 8px rgba(217, 164, 65, 0.08)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D9A441"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
                <path d="M12 17v4" />
              </svg>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  color: '#D9A441',
                  textTransform: 'uppercase',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                16+ YEARS OF MIND TRAINING
              </span>
            </div>

            {/* 2. Main Heading */}
            <h1
              style={{
                fontFamily: "'Playfair Display', 'Fraunces', Georgia, serif",
                fontSize: 'clamp(42px, 4.4vw, 68px)',
                lineHeight: '1.1',
                fontWeight: '700',
                color: '#06244E',
                margin: '0 0 20px 0',
                letterSpacing: '-1px',
              }}
            >
              Train Your Mind.
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: '700',
                  color: '#D9A441',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  marginRight: '10px',
                }}
              >
                Transform
              </em>
              <span style={{ color: '#06244E' }}>Your Life.</span>
            </h1>

            {/* 3. Decorative Gold Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '18px 0 24px 0',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '2px',
                  backgroundColor: '#D9A441',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  color: '#D9A441',
                  fontSize: '17px',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D9A441"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                  <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
                  <path d="M12 17v4" />
                </svg>
              </span>
              <div
                style={{
                  width: '46px',
                  height: '2px',
                  backgroundColor: '#D9A441',
                  borderRadius: '2px',
                }}
              />
            </div>

            {/* 4. Description */}
            <p
              style={{
                fontFamily: "'DM Sans', 'Outfit', sans-serif",
                fontSize: '16.5px',
                lineHeight: '1.75',
                color: '#3A4E68',
                maxWidth: '560px',
                marginBottom: '36px',
              }}
            >
              Positive Mind Gym gives you daily practices, guided breathwork,
              sacred shlokas, and 1-on-1 coaching to build a calmer, sharper,
              and more resilient mind — grounded in science and spirituality.
            </p>

            {/* 5. App Download Buttons (Website thm-btn Style with Icons) */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              {/* App Store Button - Website thm-btn */}
              <a
                href="#app-store"
                className="thm-btn"
                style={{
                  borderRadius: '12px',
                  height: '56px',
                  padding: '0 28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px rgba(6, 29, 61, 0.2)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>App Store</span>
                <span className="icon-right-arrow" style={{ fontSize: '14px', marginLeft: '4px' }}></span>
              </a>

              {/* Google Play Button - Website thm-btn */}
              <a
                href="#google-play"
                className="thm-btn"
                style={{
                  borderRadius: '12px',
                  height: '56px',
                  padding: '0 28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#061D3D',
                  border: '2px solid #D9A441',
                  boxShadow: '0 8px 20px rgba(217, 164, 65, 0.16)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M3.18 23.76c.31.17.65.24 1 .22l12.57-12.57L13.18 7.84 3.18 23.76z" />
                  <path fill="#FBBC05" d="M20.88 12.83c.37-.65.37-1.71 0-2.36L18.5 8.7l-3.32 3.32 3.32 3.32 2.38-2.51z" />
                  <path fill="#34A853" d="M3 1.02A1.38 1.38 0 0 0 2.18 2.2v19.6a1.38 1.38 0 0 0 .82 1.18L16.12 9.85 3 1.02z" />
                  <path fill="#EA4335" d="M14.35 9.85L3.18.24C2.83.22 2.49.29 2.18.46l13 12.91 3.17-3.52z" />
                </svg>
                <span>Google Play</span>
                <span className="icon-right-arrow" style={{ fontSize: '14px', marginLeft: '4px' }}></span>
              </a>
            </div>

            {/* 6. Impact Statistics Card with Premium SVG Icons */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #ECE7DE',
                padding: '16px 24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 8px 30px rgba(6, 36, 78, 0.04)',
                maxWidth: '560px',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              {/* Stat 1: Lives Impacted */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(217, 164, 65, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D9A441"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '23px',
                      fontWeight: '700',
                      color: '#06244E',
                      lineHeight: 1.1,
                    }}
                  >
                    20K+
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
                    Lives Impacted
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '38px', backgroundColor: '#ECE7DE' }} />

              {/* Stat 2: Workshops */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(217, 164, 65, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D9A441"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '23px',
                      fontWeight: '700',
                      color: '#06244E',
                      lineHeight: 1.1,
                    }}
                  >
                    300+
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
                    Workshops
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '38px', backgroundColor: '#ECE7DE' }} />

              {/* Stat 3: App Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(217, 164, 65, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#D9A441">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '23px',
                      fontWeight: '700',
                      color: '#06244E',
                      lineHeight: 1.1,
                    }}
                  >
                    4.9★
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
                    App Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: 3 LAYERED PHONES WITH TACTILE MOBILE SCROLL*/}
          {/* ======================================================== */}
          <div
            className="col-xl-6 col-lg-6 col-md-12"
            style={{
              position: 'relative',
              minHeight: '580px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Phone Group Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '620px',
                height: '560px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* ──────────────────────────────────────────────────────────── */}
              {/* THIRD PHONE (Back Right - Sliding Screen Track)              */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div
                className="phone-card-hover"
                style={{
                  position: 'absolute',
                  right: '0px',
                  top: '36px',
                  width: '235px',
                  height: '475px',
                  borderRadius: '34px',
                  backgroundColor: '#061325',
                  padding: '7px',
                  boxShadow: '0 20px 50px rgba(6, 24, 50, 0.22)',
                  zIndex: 1,
                  opacity: 0.92,
                  border: '2px solid #2B384E',
                  overflow: 'hidden',
                  animation: 'gentleFloatBack 5s ease-in-out infinite',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#000',
                    width: '100%',
                    height: '100%',
                    borderRadius: '27px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Dynamic Island Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '46px',
                      height: '12px',
                      backgroundColor: '#000000',
                      borderRadius: '10px',
                      zIndex: 10,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    }}
                  />
                  {/* Vertical Scroll Track */}
                  <div
                    className="phone-track-transition"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transform: `translateY(-${((activeDot + 2) % appScreens.length) * 100}%)`,
                    }}
                  >
                    {appScreens.map((item) => (
                      <div
                        key={`back-${item.id}`}
                        style={{
                          flex: '0 0 100%',
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            display: 'block',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────── */}
              {/* SECOND PHONE (Middle - Sliding Screen Track)                */}
              {/* ──────────────────────────────────────────────────────────── */}
              <div
                className="phone-card-hover"
                style={{
                  position: 'absolute',
                  right: '85px',
                  top: '18px',
                  width: '250px',
                  height: '505px',
                  borderRadius: '36px',
                  backgroundColor: '#061325',
                  padding: '8px',
                  boxShadow: '0 25px 60px rgba(6, 24, 50, 0.26)',
                  zIndex: 2,
                  border: '2px solid #334155',
                  overflow: 'hidden',
                  animation: 'gentleFloatMid 4.5s ease-in-out infinite 0.3s',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#000',
                    width: '100%',
                    height: '100%',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Dynamic Island Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '52px',
                      height: '13px',
                      backgroundColor: '#000000',
                      borderRadius: '10px',
                      zIndex: 10,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    }}
                  />
                  {/* Vertical Scroll Track */}
                  <div
                    className="phone-track-transition"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transform: `translateY(-${((activeDot + 1) % appScreens.length) * 100}%)`,
                    }}
                  >
                    {appScreens.map((item) => (
                      <div
                        key={`mid-${item.id}`}
                        style={{
                          flex: '0 0 100%',
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            display: 'block',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────── */}
              {/* FRONT PHONE (Foreground Dominant - Smooth Mobile Scroll Track)*/}
              {/* ──────────────────────────────────────────────────────────── */}
              <div
                className="phone-card-hover"
                style={{
                  position: 'relative',
                  width: '270px',
                  height: '540px',
                  borderRadius: '40px',
                  backgroundColor: '#061325',
                  padding: '9px',
                  boxShadow:
                    '0 32px 80px rgba(6, 36, 78, 0.35), 0 8px 24px rgba(0,0,0,0.18)',
                  zIndex: 3,
                  border: '2.5px solid #334155',
                  overflow: 'hidden',
                  animation: 'gentleFloatFront 4s ease-in-out infinite 0.6s',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#000',
                    width: '100%',
                    height: '100%',
                    borderRadius: '31px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Dynamic Island Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '7px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '58px',
                      height: '14px',
                      backgroundColor: '#000000',
                      borderRadius: '12px',
                      zIndex: 10,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    }}
                  />
                  {/* Vertical Scroll Track */}
                  <div
                    className="phone-track-transition"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transform: `translateY(-${activeDot * 100}%)`,
                    }}
                  >
                    {appScreens.map((item) => (
                      <div
                        key={`front-${item.id}`}
                        style={{
                          flex: '0 0 100%',
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            display: 'block',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Indicators & Controls with Smooth Transitions */}
            <div
              style={{
                position: 'absolute',
                bottom: '-28px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {/* Previous Arrow */}
              <button
                onClick={() =>
                  setActiveDot((prev) => (prev === 0 ? appScreens.length - 1 : prev - 1))
                }
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #ECE7DE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#06244E',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
                aria-label="Previous Screen"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Dots */}
              {appScreens.map((_, dot) => (
                <button
                  key={dot}
                  onClick={() => setActiveDot(dot)}
                  style={{
                    width: dot === activeDot ? '26px' : '8px',
                    height: '8px',
                    borderRadius: '6px',
                    backgroundColor:
                      dot === activeDot ? '#D9A441' : 'rgba(156, 163, 175, 0.45)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow:
                      dot === activeDot ? '0 2px 8px rgba(217, 164, 65, 0.45)' : 'none',
                  }}
                  aria-label={`Slide ${dot + 1}`}
                />
              ))}

              {/* Next Arrow */}
              <button
                onClick={() => setActiveDot((prev) => (prev + 1) % appScreens.length)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #ECE7DE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#06244E',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
                aria-label="Next Screen"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM DECORATIVE WAVE WITH GOLD ACCENT & LOTUS ART       */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0,
          pointerEvents: 'none',
          zIndex: 4,
        }}
      >
        <svg
          viewBox="0 0 1440 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            minHeight: '170px',
          }}
        >
          {/* Thin Gold Border Line along wave curve */}
          <path
            d="M0,115 C260,195 520,80 820,130 C1080,180 1280,75 1440,105"
            stroke="#D9A441"
            strokeWidth="3.8"
            fill="none"
          />
          {/* Deep Navy Solid Wave Fill */}
          <path
            d="M0,115 C260,195 520,80 820,130 C1080,180 1280,75 1440,105 L1440,230 L0,230 Z"
            fill="#061D3D"
          />
        </svg>

        {/* Lotus Flower Line-Art on Bottom Right inside Navy Wave */}
        <div
          style={{
            position: 'absolute',
            bottom: '22px',
            right: '8%',
            width: '150px',
            height: '95px',
            opacity: 0.95,
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 120 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M60,10 C56,22 45,35 30,42 C40,40 52,32 60,10 Z"
              stroke="#D9A441"
              strokeWidth="1.7"
              fill="none"
            />
            <path
              d="M60,10 C64,22 75,35 90,42 C80,40 68,32 60,10 Z"
              stroke="#D9A441"
              strokeWidth="1.7"
              fill="none"
            />
            <path
              d="M60,5 C55,20 35,38 10,48 C28,46 48,35 60,5 Z"
              stroke="#D9A441"
              strokeWidth="1.7"
              fill="none"
            />
            <path
              d="M60,5 C65,20 85,38 110,48 C92,46 72,35 60,5 Z"
              stroke="#D9A441"
              strokeWidth="1.7"
              fill="none"
            />
            <path
              d="M60,2 C58,25 48,46 25,60 C42,56 56,42 60,2 Z"
              stroke="#D9A441"
              strokeWidth="1.7"
              fill="none"
            />
            <path
              d="M60,2 C62,25 72,46 95,60 C78,56 64,42 60,2 Z"
              stroke="#D9A441"
              strokeWidth="1.7"
              fill="none"
            />
            <circle cx="60" cy="62" r="3" fill="#D9A441" />
          </svg>
        </div>
      </div>
    </section>
  );
}
