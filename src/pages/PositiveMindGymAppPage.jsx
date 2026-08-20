import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { homeContent } from '../contents/home.content';
import TestimonialsSection from '../components/common/TestimonialsSection';

import imgDailyWorkout from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.46 PM (1).jpeg';
import imgHomeMindScore from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.46 PM.jpeg';
import imgAllModules from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.47 PM (1).jpeg';
import imgMorningPractice from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.47 PM.jpeg';
import imgStudentsCornerFull from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.48 PM (1).jpeg';
import imgStudentsCornerTools from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.48 PM (2).jpeg';
import imgBoxBreathing from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.48 PM.jpeg';
import imgMorningPractice2 from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.49 PM (1).jpeg';
import imgBookSession from '../Images/POSITIVE MINDGYM APP/WhatsApp Image 2026-08-18 at 9.58.49 PM.jpeg';
import appVideo from '../use_my_real_images_only.mp4';

// ─── Phone mockup wrapper ────────────────────────────────────────────────────
function PhoneMockup({ src, alt, className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ width: 220, flexShrink: 0 }}>
      {/* Phone shell */}
      <div
        style={{
          borderRadius: 36,
          border: '3px solid #2a3d60',
          background: '#0d1a2e',
          boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)',
          overflow: 'hidden',
          aspectRatio: '9/19.5',
        }}
      >
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 72,
          height: 22,
          background: '#0d1a2e',
          borderRadius: 12,
          zIndex: 10,
        }}
      />
    </div>
  );
}

// ─── Hero (Exact Reference Design with Real App Screenshots & Tactile Auto-Scroll) ──
const heroAppScreens = [
  { id: 0, title: 'All Modules', img: imgAllModules },
  { id: 1, title: 'Morning Practice', img: imgMorningPractice },
  { id: 2, title: 'Mind Score', img: imgHomeMindScore },
  { id: 3, title: 'Daily Workout', img: imgDailyWorkout },
  { id: 4, title: 'Student Corner', img: imgStudentsCornerFull },
  { id: 5, title: 'Box Breathing', img: imgBoxBreathing },
];

function Hero() {
  const [activeDot, setActiveDot] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll slideshow with interval
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % heroAppScreens.length);
    }, 3400);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section
      id="hero"
      style={{
        backgroundColor: '#FAF8F3',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '45px',
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

      {/* ─── Background Subtle Geometric Accents ─── */}
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

            {/* 4. Exact Description */}
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
                      transform: `translateY(-${((activeDot + 2) % heroAppScreens.length) * 100}%)`,
                    }}
                  >
                    {heroAppScreens.map((item) => (
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
                      transform: `translateY(-${((activeDot + 1) % heroAppScreens.length) * 100}%)`,
                    }}
                  >
                    {heroAppScreens.map((item) => (
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
                    {heroAppScreens.map((item) => (
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
                  setActiveDot((prev) => (prev === 0 ? heroAppScreens.length - 1 : prev - 1))
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
              {heroAppScreens.map((_, dot) => (
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
                onClick={() => setActiveDot((prev) => (prev + 1) % heroAppScreens.length)}
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

// ─── How It Works (Exact Reference Design) ──────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Sign Up & Check In',
      desc: 'Start your day with a quick mood check-in on the home screen.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="14" fill="url(#sunGradBg)" />
          {/* Sun */}
          <circle cx="24" cy="22" r="10" fill="url(#sunBall)" />
          {/* Horizon waves */}
          <path
            d="M6 34c5-2 10 2 18 0s13-2 18 0v8H6v-8z"
            fill="#3B82F6"
            fillOpacity="0.85"
          />
          <path
            d="M6 37c6-1 11 1 18-1s12-1 18 1v5H6v-5z"
            fill="#60A5FA"
          />
          <defs>
            <linearGradient id="sunGradBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF1E6" />
              <stop offset="1" stopColor="#FED7AA" />
            </linearGradient>
            <linearGradient id="sunBall" x1="14" y1="12" x2="34" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="1" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      n: '02',
      title: 'Pick a Module',
      desc: 'Choose from Daily Mind Workout, Chakra Healing, Music Therapy, and more.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="14" fill="url(#yogiGradBg)" />
          {/* Meditating Yogi Silhouette in Gold/Orange */}
          {/* Head */}
          <circle cx="24" cy="15" r="4.2" fill="#D97706" />
          {/* Body & Arms */}
          <path
            d="M24 20.5c-3.5 0-6 2.2-6 5.5v2.8c0 1 1 1.7 2 1.7h8c1 0 2-.7 2-1.7V26c0-3.3-2.5-5.5-6-5.5z"
            fill="#D97706"
          />
          {/* Crossed Legs (Lotus Pose) */}
          <path
            d="M14 31c1.5-2.5 4.5-3.5 10-3.5s8.5 1 10 3.5c1 1.6-.2 3.5-2 3.5H16c-1.8 0-3-1.9-2-3.5z"
            fill="#B45309"
          />
          <defs>
            <linearGradient id="yogiGradBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF3C7" />
              <stop offset="1" stopColor="#FDE68A" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      n: '03',
      title: 'Practice Daily',
      desc: 'Guided breathing, sacred shlokas, affirmations, and brain training games.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="14" fill="url(#breathGradBg)" />
          {/* Head profile */}
          <path
            d="M19 14c-4.5 0-8 3.5-8 8v6c0 3 2.2 5.5 5 6v2h7v-3c4 0 7-3 7-7v-3.5l-3-1.5 3-2.5V22c0-4.5-3.5-8-8-8z"
            fill="#0284C7"
          />
          {/* Breath Air Flow Swirls */}
          <path
            d="M29 24c2.5-1 4.5-1 6.5 0M30 28c2.5-1 5-1 7.5 0M28 32c2-1 4-1 6 0"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="breathGradBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0F2FE" />
              <stop offset="1" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      n: '04',
      title: 'Track & Grow',
      desc: 'Build your Mind Score, streaks, and book 1-on-1 coaching with Dr. Naveen.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="14" fill="url(#chartGradBg)" />
          {/* Grid lines */}
          <line x1="12" y1="16" x2="36" y2="16" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="12" y1="24" x2="36" y2="24" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="12" y1="32" x2="36" y2="32" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="12" y1="14" x2="12" y2="34" stroke="#CBD5E1" strokeWidth="1.2" />
          {/* Chart area fill */}
          <path
            d="M14 30 L22 23 L28 27 L35 17 L35 32 L14 32 Z"
            fill="#818CF8"
            fillOpacity="0.35"
          />
          {/* Rising Chart Line */}
          <path
            d="M14 30 L22 23 L28 27 L35 17"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Growth Data Point */}
          <circle cx="35" cy="17" r="2.5" fill="#4F46E5" />
          <defs>
            <linearGradient id="chartGradBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EEF2FF" />
              <stop offset="1" stopColor="#E0E7FF" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        backgroundColor: '#FAF8F3',
        padding: '100px 24px 110px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
      }}
    >
      {/* ─── Background Subtle Elements ─── */}
      {/* Top Left Dot Grid */}
      <div
        style={{
          position: 'absolute',
          top: '35px',
          left: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 4px)',
          gap: '12px',
          opacity: 0.22,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`tl-dot-${i}`}
            style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441' }}
          />
        ))}
      </div>

      {/* Bottom Right Dot Grid */}
      <div
        style={{
          position: 'absolute',
          bottom: '35px',
          right: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 4px)',
          gap: '12px',
          opacity: 0.22,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`br-dot-${i}`}
            style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441' }}
          />
        ))}
      </div>

      {/* Background Concentric Arcs behind Center Phone */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -46%)',
          width: '640px',
          height: '640px',
          borderRadius: '50%',
          border: '1px solid rgba(217, 164, 65, 0.14)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -46%)',
          width: '780px',
          height: '780px',
          borderRadius: '50%',
          border: '1px dashed rgba(217, 164, 65, 0.1)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom Left Botanical Leaf Flourish SVG */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '0px',
          width: '160px',
          height: '180px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-20 180 C20 140 40 90 60 20"
            stroke="#D9A441"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 145 C25 130 45 132 40 115 C25 125 15 135 10 145 Z"
            fill="#D9A441"
          />
          <path
            d="M28 115 C45 100 65 105 60 88 C45 98 35 108 28 115 Z"
            fill="#D9A441"
          />
          <path
            d="M45 80 C60 65 80 70 75 55 C60 65 52 75 45 80 Z"
            fill="#D9A441"
          />
          <path
            d="M60 20 C68 30 72 45 60 50 C52 40 50 30 60 20 Z"
            fill="#D9A441"
          />
        </svg>
      </div>

      {/* Bottom Right Botanical Leaf Flourish SVG */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '0px',
          width: '160px',
          height: '180px',
          opacity: 0.25,
          pointerEvents: 'none',
          transform: 'scaleX(-1)',
        }}
      >
        <svg viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-20 180 C20 140 40 90 60 20"
            stroke="#D9A441"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 145 C25 130 45 132 40 115 C25 125 15 135 10 145 Z"
            fill="#D9A441"
          />
          <path
            d="M28 115 C45 100 65 105 60 88 C45 98 35 108 28 115 Z"
            fill="#D9A441"
          />
          <path
            d="M45 80 C60 65 80 70 75 55 C60 65 52 75 45 80 Z"
            fill="#D9A441"
          />
          <path
            d="M60 20 C68 30 72 45 60 50 C52 40 50 30 60 20 Z"
            fill="#D9A441"
          />
        </svg>
      </div>

      {/* ─── Main Content Container ─── */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* ─── Section Header ─── */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          {/* Top Lotus Line Icon with 3 Accent Dots */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <span style={{ display: 'flex', gap: '3px' }}>
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
            </span>
            <svg
              width="24"
              height="20"
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
            <span style={{ display: 'flex', gap: '3px' }}>
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '700',
              letterSpacing: '0.18em',
              color: '#D9A441',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            SIMPLE. SACRED. EFFECTIVE.
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(32px, 3.8vw, 48px)',
              fontWeight: '700',
              color: '#06244E',
              margin: '0 0 12px 0',
              letterSpacing: '-0.5px',
            }}
          >
            How Positive Mind Gym Works
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '16px',
              color: '#5A6B82',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: '1.65',
            }}
          >
            A simple 4-step journey to build a calmer, stronger, and more focused you — every single day.
          </p>
        </div>

        {/* ─── 3-Column Layout: Left Steps | Center Phone | Right Steps ─── */}
        <div
          className="how-it-works-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 310px 1fr',
            gap: '30px',
            alignItems: 'center',
            marginBottom: '65px',
            position: 'relative',
          }}
        >
          {/* ─── Left Steps (01 & 02) ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '70px' }}>
            {steps.slice(0, 2).map((s) => (
              <div
                key={s.n}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  position: 'relative',
                }}
              >
                {/* Icon Container */}
                <div
                  style={{
                    width: '62px',
                    height: '62px',
                    flexShrink: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1.5px solid rgba(217, 164, 65, 0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(6, 36, 78, 0.06)',
                  }}
                >
                  {s.icon}
                </div>

                {/* Text Details */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      color: '#D9A441',
                      letterSpacing: '0.08em',
                      marginBottom: '4px',
                    }}
                  >
                    {s.n}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '21px',
                      fontWeight: '700',
                      color: '#06244E',
                      marginBottom: '8px',
                      lineHeight: '1.25',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14.5px',
                      color: '#5A6B82',
                      lineHeight: '1.6',
                      margin: 0,
                      maxWidth: '290px',
                    }}
                  >
                    {s.desc}
                  </p>
                </div>

                {/* Dotted Connector Line pointing right towards center phone */}
                <div
                  className="step-connector-left"
                  style={{
                    position: 'absolute',
                    right: '-24px',
                    top: '28px',
                    width: '36px',
                    height: '2px',
                    borderBottom: '2px dashed rgba(217, 164, 65, 0.45)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            ))}
          </div>

          {/* ─── Center Phone Mockup (Practice Tools Screen) ─── */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div
              style={{
                width: '290px',
                height: '575px',
                borderRadius: '40px',
                backgroundColor: '#061325',
                padding: '8px',
                boxShadow:
                  '0 30px 80px rgba(6, 36, 78, 0.28), 0 10px 25px rgba(0, 0, 0, 0.15)',
                border: '2.5px solid #334155',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Screen Container */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  position: 'relative',
                }}
              >
                {/* Dynamic Island */}
                <div
                  style={{
                    position: 'absolute',
                    top: '7px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '14px',
                    backgroundColor: '#000000',
                    borderRadius: '12px',
                    zIndex: 10,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                />
                {/* Real App Video */}
                <video
                  src={appVideo || '/assets/videos/use_my_real_images_only.mp4'}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ─── Right Steps (03 & 04) ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '70px' }}>
            {steps.slice(2).map((s) => (
              <div
                key={s.n}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  position: 'relative',
                }}
              >
                {/* Dotted Connector Line extending left from phone */}
                <div
                  className="step-connector-right"
                  style={{
                    position: 'absolute',
                    left: '-24px',
                    top: '28px',
                    width: '36px',
                    height: '2px',
                    borderBottom: '2px dashed rgba(217, 164, 65, 0.45)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Icon Container */}
                <div
                  style={{
                    width: '62px',
                    height: '62px',
                    flexShrink: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1.5px solid rgba(217, 164, 65, 0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(6, 36, 78, 0.06)',
                  }}
                >
                  {s.icon}
                </div>

                {/* Text Details */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      color: '#D9A441',
                      letterSpacing: '0.08em',
                      marginBottom: '4px',
                    }}
                  >
                    {s.n}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '21px',
                      fontWeight: '700',
                      color: '#06244E',
                      marginBottom: '8px',
                      lineHeight: '1.25',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14.5px',
                      color: '#5A6B82',
                      lineHeight: '1.6',
                      margin: 0,
                      maxWidth: '290px',
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom Feature Strip (Pill Card) ─── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '50px',
            border: '1.5px solid #E8DFD0',
            padding: '16px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: '0 8px 30px rgba(6, 36, 78, 0.04)',
            maxWidth: '1080px',
            margin: '0 auto',
            flexWrap: 'wrap',
          }}
        >
          {/* Feature 1: Science-backed Practices */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(217, 164, 65, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#06244E' }}>
              Science-backed Practices
            </span>
          </div>

          {/* Feature 2: Rooted in Spirituality */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(217, 164, 65, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
                <path d="M12 17v4" />
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#06244E' }}>
              Rooted in Spirituality
            </span>
          </div>

          {/* Feature 3: Daily Habits for Lasting Change */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(217, 164, 65, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" fill="#D9A441" />
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#06244E' }}>
              Daily Habits for Lasting Change
            </span>
          </div>

          {/* Feature 4: Guided by Experts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(217, 164, 65, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#06244E' }}>
              Guided by Experts
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .step-connector-left, .step-connector-right {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Features A (Exact Reference Design) ─────────────────────────────────────
function FeaturesA() {
  const featureList = [
    {
      title: 'Guided breathing & meditation',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Meditating Yogi Silhouette with Aura */}
          <circle cx="12" cy="7" r="2.8" fill="#D9A441" />
          <path
            d="M12 11c-2.5 0-4.2 1.5-4.2 3.8v2.2c0 .8.8 1.5 1.6 1.5h5.2c.8 0 1.6-.7 1.6-1.5v-2.2c0-2.3-1.7-3.8-4.2-3.8z"
            fill="#D9A441"
          />
          <path
            d="M6 19.5c1-1.8 3-2.5 6-2.5s5 .7 6 2.5c.7 1.2-.2 2.5-1.5 2.5H7.5c-1.3 0-2.2-1.3-1.5-2.5z"
            fill="#B45309"
          />
          {/* Aura sparks */}
          <circle cx="7" cy="6" r="1" fill="#D9A441" />
          <circle cx="17" cy="6" r="1" fill="#D9A441" />
          <circle cx="12" cy="2" r="1" fill="#D9A441" />
        </svg>
      ),
    },
    {
      title: 'Daily affirmations & mood check-ins',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Affirmation Speech / Note Card with Heart / Check */}
          <rect x="3" y="4" width="18" height="15" rx="5" fill="#FEF3C7" stroke="#D9A441" strokeWidth="1.6" />
          <path
            d="M12 8.5c-.8-1-2.2-1-3 0s-.2 2.2.8 3l2.2 2.2 2.2-2.2c1-.8 1.6-2 .8-3s-2.2-1-3 0z"
            fill="#D9A441"
          />
          <path d="M7 19l2-2" stroke="#D9A441" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Brain training — Schulte Table, Stroop Effect',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Brain / Neural Cog */}
          <path d="M9.5 2A4.5 4.5 0 0 0 5 6.5C5 7.4 5.3 8.3 5.8 9A4.5 4.5 0 0 0 3 13c0 2 1.3 3.7 3.1 4.3A4.5 4.5 0 0 0 10 21.5c.7 0 1.4-.2 2-.5" />
          <path d="M14.5 2A4.5 4.5 0 0 1 19 6.5c0 .9-.3 1.8-.8 2.5A4.5 4.5 0 0 1 21 13c0 2-1.3 3.7-3.1 4.3A4.5 4.5 0 0 1 14 21.5c-.7 0-1.4-.2-2-.5" />
          <path d="M12 4v16" strokeDasharray="2 2" />
        </svg>
      ),
    },
    {
      title: 'Real coach, real 1-on-1 sessions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Coach User Profile */}
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
          <path d="M12 1v2M8 2l1 1.5M16 2l-1 1.5" stroke="#D9A441" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="features"
      style={{
        backgroundColor: '#FAF8F3',
        padding: '110px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
      }}
    >
      {/* ─── Left Background Decorative Mandala / Sunburst Art ─── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '-120px',
          transform: 'translateY(-50%)',
          width: '580px',
          height: '580px',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Ring */}
          <circle cx="200" cy="200" r="190" stroke="#D9A441" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="200" cy="200" r="170" stroke="#D9A441" strokeWidth="1.2" />
          <circle cx="200" cy="200" r="140" stroke="#D9A441" strokeWidth="0.8" />
          {/* Petals */}
          {Array.from({ length: 16 }).map((_, i) => {
            const rot = i * 22.5;
            return (
              <g key={`petal-${i}`} transform={`rotate(${rot} 200 200)`}>
                <path
                  d="M200 30 C212 90 220 130 200 170 C180 130 188 90 200 30 Z"
                  stroke="#D9A441"
                  strokeWidth="1"
                  fill="rgba(217, 164, 65, 0.03)"
                />
                <circle cx="200" cy="45" r="2.5" fill="#D9A441" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Sparkle Stars & Circles */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '70px',
          color: '#D9A441',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '90px',
          left: '80px',
          display: 'flex',
          gap: '14px',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1.5px solid #D9A441' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid #D9A441' }} />
      </div>

      {/* Concentric Arc & Anchors Behind Phone */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '26%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          border: '1.5px dashed rgba(217, 164, 65, 0.22)',
          pointerEvents: 'none',
        }}
      >
        {/* Accent Anchor Dots on Ring */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-6px',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#FAF8F3',
            border: '2px solid #D9A441',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
        </div>
      </div>

      {/* ─── Main Content Container ─── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div
          className="feat-a-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '460px 1fr',
            gap: '80px',
            alignItems: 'center',
          }}
        >
          {/* ─── Left Column: Phone Mockup (Book a Session Screen) ─── */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div
              style={{
                width: '320px',
                height: '635px',
                borderRadius: '44px',
                backgroundColor: '#061325',
                padding: '9px',
                boxShadow:
                  '0 35px 90px rgba(6, 36, 78, 0.22), 0 12px 30px rgba(0, 0, 0, 0.12)',
                border: '2.5px solid #334155',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Screen Shell */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '35px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  position: 'relative',
                }}
              >
                {/* Dynamic Island */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '64px',
                    height: '15px',
                    backgroundColor: '#000000',
                    borderRadius: '12px',
                    zIndex: 10,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                />
                {/* Real Book a Session Screen */}
                <img
                  src={imgBookSession}
                  alt="Book a Session"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ─── Right Column: Content ─── */}
          <div>
            {/* Top Badge: ── 🪷 SACRED MODULES ✦ ── */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '16px',
              }}
            >
              <span style={{ width: '42px', height: '1px', backgroundColor: '#D9A441', opacity: 0.6 }} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  letterSpacing: '0.18em',
                  color: '#D9A441',
                  textTransform: 'uppercase',
                }}
              >
                <svg width="18" height="15" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
                  <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                  <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
                  <path d="M12 17v4" />
                </svg>
                <span>SACRED MODULES</span>
                <span style={{ fontSize: '10px' }}>✦</span>
              </div>
              <span style={{ width: '42px', height: '1px', backgroundColor: '#D9A441', opacity: 0.6 }} />
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(34px, 4.2vw, 52px)',
                fontWeight: '700',
                color: '#06244E',
                margin: '0 0 14px 0',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
              }}
            >
              Everything Your Mind
              <br />
              Needs, In <span style={{ color: '#D9A441' }}>One App</span>
            </h2>

            {/* Small Lotus Icon Separator */}
            <div style={{ marginBottom: '22px' }}>
              <svg width="22" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
                <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
                <path d="M12 17v4" />
              </svg>
            </div>

            {/* Paragraph */}
            <p
              style={{
                fontSize: '15.5px',
                color: '#5A6B82',
                lineHeight: 1.75,
                marginBottom: '32px',
                maxWidth: '560px',
              }}
            >
              From the Daily Mind Workout and Mind First Aid Kit to Chakra Healing, Happy Home, Music Therapy, Student's Corner, Spiritual Intelligence, and 1-on-1 sessions — Positive Mind Gym brings together every tool your mind needs to thrive.
            </p>

            {/* 4 Feature Rows */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '40px',
                maxWidth: '540px',
              }}
            >
              {featureList.map((f, idx) => (
                <div key={f.title}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      paddingBottom: '16px',
                    }}
                  >
                    {/* Icon Circle */}
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid rgba(217, 164, 65, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 14px rgba(217, 164, 65, 0.12)',
                      }}
                    >
                      {f.icon}
                    </div>

                    {/* Text */}
                    <span
                      style={{
                        fontSize: '15.5px',
                        fontWeight: '700',
                        color: '#06244E',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {f.title}
                    </span>
                  </div>

                  {/* Dotted Separator line between rows (except last) */}
                  {idx < featureList.length - 1 && (
                    <div
                      style={{
                        height: '1px',
                        borderBottom: '1px dotted rgba(217, 164, 65, 0.35)',
                        width: '100%',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Button Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <a
                href="#built-for-focus"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('built-for-focus')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, #D9A441 0%, #B88220 100%)',
                  color: '#FFFFFF',
                  padding: '14px 34px',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px rgba(217, 164, 65, 0.4)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 14px 30px rgba(217, 164, 65, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(217, 164, 65, 0.4)';
                }}
              >
                {/* Download Circle Icon */}
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </span>
                <span>Download Free</span>
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '30px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
                <span style={{ fontSize: '11px', color: '#D9A441' }}>✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .feat-a-grid {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Features B (Exact Reference Design) ─────────────────────────────────────
function FeaturesB() {
  const pillRow1 = [
    {
      label: 'Brahmari Breathing',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12c3-4 6-4 9 0s6 4 9 0" />
          <path d="M5 8c2.5-3 5-3 7 0s5 3 7 0" opacity="0.6" />
        </svg>
      ),
    },
    {
      label: 'Affirmations',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      ),
    },
    {
      label: 'Brain Boost',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      label: 'Schulte Table',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
  ];

  const pillRow2 = [
    {
      label: 'Stroop Effect',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      label: 'Box Breathing',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      label: 'Jyothirdhyana',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
          <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
          <path d="M12 17v4" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="built-for-focus"
      style={{
        backgroundColor: '#FAF8F3',
        padding: '110px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
      }}
    >
      {/* ─── Top Left Decorative Lotus Seal & Bracket ─── */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: '1.5px solid rgba(217, 164, 65, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
            <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
            <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
            <path d="M12 17v4" />
          </svg>
        </div>
        <div style={{ width: '18px', height: '18px', borderTop: '1px solid rgba(217, 164, 65, 0.4)', borderRight: '1px solid rgba(217, 164, 65, 0.4)' }} />
      </div>

      {/* ─── Far Left Lotus Petal Line Flourish ─── */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '-60px',
          width: '240px',
          height: '240px',
          opacity: 0.22,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M10 180 C40 100 80 50 140 10 C180 80 150 140 10 180 Z" stroke="#D9A441" strokeWidth="1.2" />
          <path d="M25 180 C60 120 100 70 160 30" stroke="#D9A441" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* ─── Bottom Left Dot Grid ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 4px)',
          gap: '12px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={`dot-${i}`}
            style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441' }}
          />
        ))}
      </div>

      {/* ─── Right Concentric Arc & Anchors Behind Phone ─── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '18%',
          transform: 'translate(50%, -50%)',
          width: '580px',
          height: '580px',
          borderRadius: '50%',
          border: '1.5px dashed rgba(217, 164, 65, 0.22)',
          pointerEvents: 'none',
        }}
      >
        {/* Left Anchor Dot on Ring */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-6px',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#FAF8F3',
            border: '2px solid #D9A441',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
        </div>
      </div>

      {/* Floating Sparkle Star Upper Right */}
      <div
        style={{
          position: 'absolute',
          top: '140px',
          right: '60px',
          color: '#D9A441',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
        </svg>
      </div>

      {/* ─── Main Content Container ─── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div
          className="feat-b-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 420px',
            gap: '60px',
            alignItems: 'center',
          }}
        >
          {/* ─── Left Column: Content ─── */}
          <div>
            {/* Top Tagline Badge: ── ✦ BUILT FOR FOCUS ✦ ── */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <span style={{ width: '36px', height: '1px', backgroundColor: '#D9A441', opacity: 0.6 }} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  letterSpacing: '0.18em',
                  color: '#D9A441',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ fontSize: '10px' }}>✦</span>
                <span>BUILT FOR FOCUS</span>
                <span style={{ fontSize: '10px' }}>✦</span>
              </div>
              <span style={{ width: '36px', height: '1px', backgroundColor: '#D9A441', opacity: 0.6 }} />
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(34px, 4.2vw, 54px)',
                fontWeight: '700',
                color: '#06244E',
                margin: '0 0 14px 0',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
              }}
            >
              Boost Focus, Calm,
              <br />
              and <span style={{ fontStyle: 'italic', color: '#D9A441' }}>Confidence</span>
            </h2>

            {/* Lotus Divider: ── ✦ 🪷 ✦ ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '22px',
              }}
            >
              <span style={{ width: '40px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
              <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
                <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
                <path d="M12 17v4" />
              </svg>
              <span style={{ width: '40px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
            </div>

            {/* Paragraph */}
            <p
              style={{
                fontSize: '15.5px',
                color: '#5A6B82',
                lineHeight: 1.75,
                marginBottom: '32px',
                maxWidth: '540px',
              }}
            >
              Designed for students and professionals: Brahmari Breathing, daily Affirmations, Brain Boost frequencies, Schulte Table, Stroop Effect, and Box Breathing — every tool calibrated to sharpen attention and dissolve anxiety.
            </p>

            {/* ─── 2 Rows of Feature Pills ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
              {/* Row 1 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {pillRow1.map((p) => (
                  <div
                    key={p.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E8DFD0',
                      borderRadius: '50px',
                      padding: '8px 18px',
                      boxShadow: '0 4px 16px rgba(6, 36, 78, 0.04)',
                    }}
                  >
                    {p.icon}
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#06244E' }}>{p.label}</span>
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {pillRow2.map((p) => (
                  <div
                    key={p.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E8DFD0',
                      borderRadius: '50px',
                      padding: '8px 18px',
                      boxShadow: '0 4px 16px rgba(6, 36, 78, 0.04)',
                    }}
                  >
                    {p.icon}
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#06244E' }}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. App Download Buttons (Website thm-btn Style with Icons) */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'center',
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
          </div>

          {/* ─── Right Column: Phone Mockup (Namaste Home Screen) ─── */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div
              style={{
                width: '320px',
                height: '635px',
                borderRadius: '44px',
                backgroundColor: '#061325',
                padding: '9px',
                boxShadow:
                  '0 35px 90px rgba(6, 36, 78, 0.22), 0 12px 30px rgba(0, 0, 0, 0.12)',
                border: '2.5px solid #334155',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Screen Shell */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '35px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  position: 'relative',
                }}
              >
                {/* Dynamic Island */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '64px',
                    height: '15px',
                    backgroundColor: '#000000',
                    borderRadius: '12px',
                    zIndex: 10,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                />
                {/* Real Home Screen */}
                <img
                  src={imgHomeMindScore}
                  alt="Positive Mind Gym Home Screen"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .feat-b-grid {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Why Choose Us (Exact Reference Design) ──────────────────────────────────
function WhyChooseUs() {
  const cards = [
    {
      title: 'Guided by Experts',
      desc: 'Led by Dr. Naveen, Psychologist, Life Coach, and mindfulness expert with 16+ years of experience.',
      pillText: '16+ Years Experience',
      pillIcon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" fill="rgba(217, 164, 65, 0.2)" />
        </svg>
      ),
      topIcon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      title: 'Science + Spirituality',
      desc: 'Blends science-backed breathwork, chakra healing, cognitive exercises, and Indian spiritual wisdom.',
      pillText: 'Science Backed Practices',
      pillIcon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      topIcon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0" />
          <circle cx="11" cy="15" r="1" fill="#D9A441" />
          <circle cx="14" cy="17" r="1" fill="#D9A441" />
          <circle cx="10" cy="18" r="1" fill="#D9A441" />
        </svg>
      ),
    },
    {
      title: 'Track Real Progress',
      desc: 'Mind Score, daily streaks, habit builder — see your mental fitness grow, one practice at a time.',
      pillText: 'Visible. Measurable. Meaningful.',
      pillIcon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="#D9A441" />
        </svg>
      ),
      topIcon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="20" x2="6" y2="16" />
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="6" />
          <path d="M6 12l6-6 6 2" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="our-difference"
      style={{
        backgroundColor: '#FAF8F3',
        padding: '110px 24px 120px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
      }}
    >
      {/* ─── Background Subtle Elements ─── */}
      {/* Top Left Floating Circles */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          display: 'flex',
          gap: '12px',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #D9A441' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D9A441' }} />
      </div>

      {/* Top Right Dot Grid */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          right: '50px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 4px)',
          gap: '12px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={`tr-dot-${i}`}
            style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441' }}
          />
        ))}
      </div>

      {/* Bottom Left Botanical Laurel / Olive Branch Flourish */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '-20px',
          width: '200px',
          height: '200px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M10 190 C50 140 80 90 120 20" stroke="#D9A441" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M40 150 C55 135 75 138 70 120 C55 130 45 140 40 150 Z" fill="#D9A441" />
          <path d="M65 115 C82 100 102 105 97 88 C82 98 72 108 65 115 Z" fill="#D9A441" />
          <path d="M90 75 C105 60 125 65 120 50 C105 60 97 70 90 75 Z" fill="#D9A441" />
        </svg>
      </div>

      {/* Bottom Right Botanical Laurel / Olive Branch Flourish */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '-20px',
          width: '200px',
          height: '200px',
          opacity: 0.25,
          pointerEvents: 'none',
          transform: 'scaleX(-1)',
        }}
      >
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M10 190 C50 140 80 90 120 20" stroke="#D9A441" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M40 150 C55 135 75 138 70 120 C55 130 45 140 40 150 Z" fill="#D9A441" />
          <path d="M65 115 C82 100 102 105 97 88 C82 98 72 108 65 115 Z" fill="#D9A441" />
          <path d="M90 75 C105 60 125 65 120 50 C105 60 97 70 90 75 Z" fill="#D9A441" />
        </svg>
      </div>

      {/* ─── Main Content Container ─── */}
      <div style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* ─── Section Header ─── */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          {/* Top Lotus Ornament: ── ✦ 🪷 ✦ ── */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <span style={{ width: '45px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
            <span style={{ fontSize: '10px', color: '#D9A441' }}>✦</span>
            <svg width="22" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
              <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
              <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
              <path d="M12 17v4" />
            </svg>
            <span style={{ fontSize: '10px', color: '#D9A441' }}>✦</span>
            <span style={{ width: '45px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '700',
              letterSpacing: '0.2em',
              color: '#D9A441',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            OUR DIFFERENCE
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(34px, 4.2vw, 52px)',
              fontWeight: '700',
              color: '#06244E',
              margin: '0 0 14px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Why Choose <span style={{ color: '#D9A441' }}>Positive Mind Gym</span>
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '16px',
              color: '#5A6B82',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: '1.65',
            }}
          >
            We combine ancient wisdom with modern science to help you build
            <br />
            a calmer, sharper, and more resilient mind.
          </p>
        </div>

        {/* ─── 3 Elegant Cards Grid ─── */}
        <div
          className="why-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px',
            paddingTop: '35px',
          }}
        >
          {cards.map((c) => (
            <div
              key={c.title}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #EFE8DD',
                padding: '52px 30px 28px 30px',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(6, 36, 78, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 18px 40px rgba(6, 36, 78, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 36, 78, 0.04)';
              }}
            >
              {/* Floating Top Oval/Circular Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-36px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(217, 164, 65, 0.4)',
                  boxShadow: '0 6px 18px rgba(217, 164, 65, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#FAF7F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {c.topIcon}
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '21px',
                  fontWeight: '700',
                  color: '#06244E',
                  marginTop: '8px',
                  marginBottom: '10px',
                  letterSpacing: '-0.2px',
                }}
              >
                {c.title}
              </h3>

              {/* Delicate Lotus Separator: ── 🪷 ── */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ width: '28px', height: '1px', backgroundColor: '#D9A441', opacity: 0.4 }} />
                <svg width="14" height="12" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
                  <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                  <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
                  <path d="M12 17v4" />
                </svg>
                <span style={{ width: '28px', height: '1px', backgroundColor: '#D9A441', opacity: 0.4 }} />
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '14.5px',
                  color: '#5A6B82',
                  lineHeight: '1.65',
                  margin: '0 0 28px 0',
                  flex: 1,
                }}
              >
                {c.desc}
              </p>

              {/* Bottom Pill Badge */}
              <div
                style={{
                  backgroundColor: '#FAF5EC',
                  border: '1px solid #ECE2D2',
                  borderRadius: '50px',
                  padding: '11px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginTop: 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {c.pillIcon}
                </div>
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: '#06244E',
                    letterSpacing: '-0.1px',
                  }}
                >
                  {c.pillText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .why-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
            padding-top: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}



// ─── Pricing / Booking ────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="book" style={{ background: '#F4F1EA', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: '#D89B2C', textTransform: 'uppercase' }}>Book a Session</span>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: '#1B2A4A', marginTop: 12, letterSpacing: '-0.5px' }}>Simple, Transparent Plans</h2>
          <p style={{ fontSize: 16, color: '#6B7280', marginTop: 14, maxWidth: 520, margin: '14px auto 0' }}>Start free with the app, or book a personal coaching session with Dr. Naveen Ellangala.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="pricing-grid">
          {[
            {
              name: 'Free Practice', tag: 'Self-Guided', price: '₹0', period: 'forever', cta: 'Download Free', popular: false,
              features: ['All 9 modules (basic)', 'Daily Mind Workout', 'Morning Shloka', 'Mood check-in', 'Mind Score tracking'],
            },
            {
              name: 'Wellness Session', tag: 'Most Popular', price: '₹999', period: 'per session', cta: 'Book Now', popular: true,
              features: ['45-min 1-on-1 with Dr. Naveen', 'Personalized mind assessment', 'Custom practice plan', 'Session recording', 'Follow-up resources'],
            },
            {
              name: 'Monthly Coaching', tag: 'Best Value', price: '₹3,499', period: 'per month', cta: 'Get Started', popular: false,
              features: ['4 coaching sessions / month', 'WhatsApp support', 'Custom affirmation packs', 'Chakra healing guidance', 'Priority booking'],
            },
          ].map(p => (
            <div key={p.name} style={{
              background: p.popular ? '#1B2A4A' : '#fff',
              borderRadius: 24,
              padding: '36px 28px',
              position: 'relative',
              boxShadow: p.popular ? '0 12px 48px rgba(27,42,74,0.25)' : '0 2px 20px rgba(27,42,74,0.06)',
              transform: p.popular ? 'scale(1.04)' : 'none',
            }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#D89B2C', color: '#1B2A4A', fontSize: 12, fontWeight: 700, padding: '5px 18px', borderRadius: 50, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                  ★ MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 12, fontWeight: 700, color: p.popular ? 'rgba(216,155,44,0.8)' : '#D89B2C', letterSpacing: '0.12em', marginBottom: 10, textTransform: 'uppercase' }}>{p.tag}</div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700, color: p.popular ? '#fff' : '#1B2A4A', marginBottom: 4 }}>{p.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '20px 0' }}>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: 38, fontWeight: 700, color: p.popular ? '#D89B2C' : '#1B2A4A' }}>{p.price}</span>
                <span style={{ fontSize: 13, color: p.popular ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}>{p.period}</span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: p.popular ? 'rgba(255,255,255,0.78)' : '#4B5563', alignItems: 'flex-start' }}>
                    <span style={{ color: '#D89B2C', flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href="#" style={{
                display: 'block', textAlign: 'center',
                background: p.popular ? 'linear-gradient(135deg, #D89B2C, #f0b84a)' : 'transparent',
                border: p.popular ? 'none' : '2px solid #1B2A4A',
                color: p.popular ? '#1B2A4A' : '#1B2A4A',
                padding: '13px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}>{p.cta}</a>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Stories / Blog ───────────────────────────────────────────────────────────
function Stories() {
  const posts = [
    {
      title: 'The Science of Box Breathing: Why 4-4-4-4 Resets Your Nervous System',
      excerpt: 'Box breathing activates the parasympathetic nervous system within seconds. Here\'s how the ancient technique maps onto modern neuroscience.',
      date: 'Aug 1, 2026',
      tag: 'Breathwork',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop&auto=format',
    },
    {
      title: 'Understanding Your 7 Chakras: A Practical Guide to Energy Healing',
      excerpt: 'Chakra healing isn\'t mysticism — it\'s a 5,000-year-old map of how emotion, energy, and physiology intersect. Let\'s decode it.',
      date: 'Jul 24, 2026',
      tag: 'Chakra Healing',
      img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=380&fit=crop&auto=format',
    },
    {
      title: 'How a 10-Minute Morning Ritual Rewires Your Brain for the Day',
      excerpt: 'The Morning Shloka practice inside Positive Mind Gym is built on ultradian rhythm research. Here\'s why timing your ritual to sunrise matters.',
      date: 'Jul 15, 2026',
      tag: 'Morning Practice',
      img: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=600&h=380&fit=crop&auto=format',
    },
  ];

  return (
    <section id="stories" style={{ background: '#EDE8DC', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: '#D89B2C', textTransform: 'uppercase' }}>Wellness Journal</span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 700, color: '#1B2A4A', marginTop: 8, letterSpacing: '-0.5px' }}>Read Our Stories</h2>
          </div>
          <a href="#" style={{ fontSize: 14, fontWeight: 600, color: '#D89B2C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>View All Stories →</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }} className="stories-grid">
          {posts.map(p => (
            <article key={p.title} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(27,42,74,0.06)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,42,74,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(27,42,74,0.06)'; }}
            >
              <div style={{ height: 200, overflow: 'hidden', background: '#EDE8DC' }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ background: 'rgba(216,155,44,0.12)', color: '#D89B2C', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50, letterSpacing: '0.08em' }}>{p.tag}</span>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>{p.date}</span>
                </div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 600, color: '#1B2A4A', lineHeight: 1.45, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65 }}>{p.excerpt}</p>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, fontSize: 13, fontWeight: 600, color: '#1B2A4A', textDecoration: 'none' }}>Read Story <span>→</span></a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .stories-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── FAQ (Exact Reference Design) ─────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: 'Is Positive Mind Gym free to use?',
      a: 'Yes — the app is free to download and includes access to daily self-practice tools, guided breathwork, and mood check-ins. Premium coaching and specialized programs are also available.',
    },
    {
      q: 'Who is the coach behind the app?',
      a: 'Dr. Naveen Ellangala is a Positive Psychologist, Certified Life Coach, and mind trainer with 16+ years of experience working with 20,000+ individuals and 300+ institutions across India.',
    },
    {
      q: 'How do I book a 1 on 1 session?',
      a: 'Open the app, tap the "Book Session" tab from the navigation bar, choose your preferred coach, date and time slot, and confirm your booking instantly.',
    },
    {
      q: 'Is my mood check-in data private?',
      a: 'Absolutely. Your daily check-ins, journal entries, and Mind Score data are strictly confidential, securely encrypted, and never shared with third parties.',
    },
    {
      q: 'Can I use this as a student?',
      a: "Yes — Student's Corner is specifically calibrated for students with Brahmari Breathing, Affirmations, Brain Boost frequencies, Schulte Table, and Stroop Effect for peak focus and exam calm.",
    },
    {
      q: 'How is this different from a regular meditation app?',
      a: 'Positive Mind Gym uniquely unites time-tested Indian spiritual wisdom (shlokas, chakra healing) with modern cognitive neuroscience, gamified brain training, and real human 1-on-1 coaching.',
    },
  ];

  return (
    <section
      id="faq"
      style={{
        backgroundColor: '#FAF8F3',
        padding: '110px 24px 120px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
      }}
    >
      {/* ─── Background Subtle Geometric Accents ─── */}
      {/* Top Left Concentric Arcs */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          border: '1.5px solid rgba(217, 164, 65, 0.16)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          border: '1.5px dashed rgba(217, 164, 65, 0.14)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: '60px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: '1.5px solid #D9A441',
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />

      {/* Top Right Dot Grid (4x6) */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          right: '50px',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 4px)',
          gap: '12px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={`tr-faq-dot-${i}`}
            style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441' }}
          />
        ))}
      </div>

      {/* Bottom Right Dot Cluster */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          right: '60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 4px)',
          gap: '12px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={`br-faq-dot-${i}`}
            style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441' }}
          />
        ))}
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* ─── Header ─── */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          {/* Top Question Bubble Icon: ─── (?) ─── • */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <span style={{ width: '45px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#FAF5EC',
                border: '1.5px solid #D9A441',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(217, 164, 65, 0.15)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span style={{ width: '45px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D9A441', opacity: 0.7 }} />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '700',
              letterSpacing: '0.22em',
              color: '#D9A441',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            GOT QUESTIONS?
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(34px, 4.2vw, 52px)',
              fontWeight: '700',
              color: '#06244E',
              margin: '0 0 14px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Frequently <span style={{ fontStyle: 'italic', color: '#D9A441' }}>Asked</span> Questions
          </h2>

          {/* Lotus Separator: ── 🪷 ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '18px',
            }}
          >
            <span style={{ width: '36px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
            <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
              <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
              <path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z" />
              <path d="M12 17v4" />
            </svg>
            <span style={{ width: '36px', height: '1px', backgroundColor: '#D9A441', opacity: 0.5 }} />
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '15.5px',
              color: '#5A6B82',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: '1.65',
            }}
          >
            Everything you need to know about Positive Mind Gym
            <br />
            and your wellness journey.
          </p>
        </div>

        {/* ─── 6 Rounded FAQ Capsule Cards (White & Gold) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: isOpen ? '1.5px solid #D9A441' : '1.5px solid #EFE8DD',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isOpen
                    ? '0 12px 30px rgba(217, 164, 65, 0.12)'
                    : '0 6px 20px rgba(6, 36, 78, 0.04)',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '20px 26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {/* Left Question Speech Bubble Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(217, 164, 65, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: '#FAF5EC',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <path d="M12 8v3M12 14h.01" />
                      </svg>
                    </div>

                    {/* Question Text */}
                    <span
                      style={{
                        fontSize: '16.5px',
                        fontWeight: '700',
                        color: '#06244E',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {f.q}
                    </span>
                  </div>

                  {/* Right Plus / Minus Toggle */}
                  <span
                    style={{
                      fontSize: '26px',
                      fontWeight: '300',
                      color: '#D9A441',
                      lineHeight: 1,
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    +
                  </span>
                </button>

                {/* Expanded Answer Body */}
                {isOpen && (
                  <div
                    style={{
                      padding: '0 26px 22px 80px',
                      fontSize: '15px',
                      color: '#5A6B82',
                      lineHeight: '1.75',
                      borderTop: '1px solid #F0EAE1',
                      paddingTop: '14px',
                    }}
                  >
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────
function CTABand() {
  return (
    <section style={{ background: '#D89B2C', padding: '80px 24px', overflow: 'hidden', position: 'relative' }}>
      {/* Soft decorative circle */}
      <div style={{ position: 'absolute', right: -80, top: '50%', transform: 'translateY(-50%)', width: 440, height: 440, borderRadius: '50%', background: 'rgba(27,42,74,0.12)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center', position: 'relative' }} className="cta-grid">
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, color: '#1B2A4A', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.5px' }}>
            Let's Try Positive Mind Gym,<br /><em>for Free.</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(27,42,74,0.72)', marginBottom: 32 }}>Download the app and start your first practice today. No credit card needed.</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1B2A4A', color: '#fff', padding: '13px 24px', borderRadius: 14, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1B2A4A', color: '#fff', padding: '13px 24px', borderRadius: 14, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.31.17.65.24 1 .22l12.57-12.57L13.18 7.84 3.18 23.76zm17.7-10.93c.37-.65.37-1.71 0-2.36L18.5 8.7l-3.32 3.32 3.32 3.32 2.38-2.51zM3 1.02A1.38 1.38 0 0 0 2.18 2.2v19.6a1.38 1.38 0 0 0 .82 1.18L16.12 9.85 3 1.02zm11.35 8.83L3.18.24C2.83.22 2.49.29 2.18.46l13 12.91 3.17-3.52z"/></svg>
              Google Play
            </a>
          </div>
        </div>

        <div style={{ flexShrink: 0 }} className="cta-phone">
          <PhoneMockup src={imgHomeMindScore} alt="Home Mind Score" />
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .cta-grid { grid-template-columns: 1fr !important; }
          .cta-phone { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section style={{ background: '#F4F1EA', padding: '60px 24px', borderTop: '1px solid rgba(27,42,74,0.08)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 700, color: '#1B2A4A', marginBottom: 10 }}>Subscribe to Our Newsletter</h3>
        <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 28 }}>Weekly tips for a calmer, stronger mind. No spam — ever.</p>
        {submitted ? (
          <div style={{ background: '#fff', border: '1px solid rgba(216,155,44,0.3)', borderRadius: 14, padding: '20px 32px', color: '#1B2A4A', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2"><path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z"/><path d="M12 10c-2.5 3.5-5.5 6-8.5 7 3.5 2 7 1.5 8.5-1 1.5 2.5 5 3 8.5 1-3-1-6-3.5-8.5-7z"/><path d="M12 17v4"/></svg>
            Thank you! You'll hear from us soon.
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', gap: 10 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{ flex: 1, padding: '14px 18px', borderRadius: 12, border: '1.5px solid rgba(27,42,74,0.15)', background: '#fff', fontSize: 15, color: '#1B2A4A', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#1B2A4A', color: '#fff', padding: '14px 24px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PositiveMindGymAppPage() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <HeaderOne />
        <Hero />
        <HowItWorks />
        <FeaturesA />
        <FeaturesB />
        <WhyChooseUs />
        <TestimonialsSection />
        <FAQ />
        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
