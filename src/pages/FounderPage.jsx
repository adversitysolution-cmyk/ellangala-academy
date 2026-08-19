import React from 'react';
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
import '../assets/css/founder-profile.css';

import founderHeroBg from '../Images/Founder PAge Hero.png';
import founderBooksShowcaseImg from '../Images/ChatGPT Image Aug 18, 2026, 09_18_52 PM.png';

// Image assets
const founderBooksImg = '/assets/images/resources/therapy-v1-img1.png';
const mindGymImg = '/assets/images/services/mind-gym.png';
const studentProgramsImg = '/assets/images/services/positive-psychology.png';
const specializedAreasImg = '/assets/images/services/indian-culture.png';
const portraitImg = '/assets/images/team/naveen-ellangala.jpg';

export default function FounderPage() {
  useUterpyPlugins();

  const booksListCol1 = [
    { num: 1, title: 'Manada hitaalli bevu bella' },
    { num: 2, title: 'Hani-Dwani' },
    { num: 3, title: 'Mind Your Mind' },
    { num: 4, title: 'Bhagavadgitha for Daily Life' },
    { num: 5, title: 'Be positive' },
    { num: 6, title: 'Self care' },
    { num: 7, title: 'Mind Reprogramming' },
    { num: 8, title: 'Goal Setting & Study Skills' }
  ];

  const booksListCol2 = [
    { num: 9, title: 'Nane Nanna Shilpi' },
    { num: 10, title: 'Positive Parenting' },
    { num: 11, title: 'Dhanatmaka Poshakatva' },
    { num: 12, title: 'The Student Success Mindset', forthcoming: true },
    { num: 13, title: 'Vidhyarthi Sadhanege ondu kaipidi', forthcoming: true },
    { num: 14, title: 'Purandaradasara Keerthanegalu mattu vyaktitva vikasana', forthcoming: true },
    { num: 15, title: 'Manassigondu Budhi mathu', forthcoming: true }
  ];

  const qualList = [
    {
      title: 'Ph.D. (Positive Psychology)',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 20.3a1 1 0 0 0 1.35 1.35l2.69-.62A8.96 8.96 0 0 0 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0V8zm-3 4a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm7 0a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2z" />
        </svg>
      )
    },
    {
      title: 'M.Sc. (Psychology)',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CA8A38" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M5 4v6a7 7 0 0 0 14 0V4" />
          <path d="M9 22h6" />
        </svg>
      )
    },
    {
      title: 'M.B.A (HR)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      )
    },
    {
      title: 'N.L.P (Neuro Linguistic Programming)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      )
    },
    {
      title: 'C.B.T (Cognitive Behaviour Therapy)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M12 3a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zm-1 18h2v1h-2zm-2-1h6v1H9z" />
        </svg>
      )
    },
    {
      title: 'Psychotherapy',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#CA8A38">
          <circle cx="12" cy="5" r="3" />
          <path d="M12 9c-2.76 0-5 2.24-5 5v7h3v-5h4v5h3v-7c0-2.76-2.24-5-5-5z" />
        </svg>
      )
    },
    {
      title: 'D.R.T (Diploma in Reflexology Therapy)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M18 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6-4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6-4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )
    },
    {
      title: 'D.B.F (Diploma in Batchflower Therapy)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#CA8A38">
          <circle cx="12" cy="4" r="2.5" />
          <path d="M18.5 7.5c-.83-.83-2.17-.83-3 0L12 11 8.5 7.5c-.83-.83-2.17-.83-3 0-.83.83-.83 2.17 0 3L9 14v7h6v-7l3.5-3.5c.83-.83.83-2.17 0-3z" />
        </svg>
      )
    },
    {
      title: 'Clinical Hypnotherapy',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#CA8A38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3.5" fill="#CA8A38" />
          <circle cx="12" cy="12" r="1.2" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      title: 'Y.I.C (Yoga Instructor Course)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#CA8A38">
          <circle cx="12" cy="4" r="2.5" />
          <path d="M19 19c-1.5-1.5-3.5-2.5-6-2.8V13l3.5-2.5-1.5-2L12 10.5 9 8.5 7.5 10.5 11 13v3.2c-2.5.3-4.5 1.3-6 2.8 1.5 1.5 4 2.5 7 2.5s5.5-1 7-2.5z" />
        </svg>
      )
    }
  ];

  const awardsList = [
    {
      title: 'Samskrithi Puraskritharu Prashasthi',
      org: 'Megamarati Kannada Matu Sahithya Vedike, Bangalore',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#CA8A38">
          <circle cx="12" cy="9" r="6" />
          <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14l-4.8 2.6.9-5.3-3.8-3.7 5.3-.8L12 2z" fill="#FAF6F0" />
          <path d="m8.5 15.5-2.5 6.5 6-3 6 3-2.5-6.5" fill="#CA8A38" />
          <path d="M12 7l1.1 2.3 2.5.4-1.8 1.8.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.8 2.5-.4L12 7z" fill="#CA8A38" />
        </svg>
      )
    },
    {
      title: 'Kuvempu Rajya Prashasthi',
      org: 'Balaku Trust, Bangalore',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="m9 2-3 7h3l3-7z" fill="#CA8A38" />
          <path d="m15 2 3 7h-3l-3-7z" fill="#CA8A38" />
          <circle cx="12" cy="15" r="6" fill="#CA8A38" />
          <path d="M12 12.2l.8 1.7 1.9.3-1.4 1.3.3 1.9-1.6-.9-1.6.9.3-1.9-1.4-1.3 1.9-.3.7-1.7z" fill="#FAF6F0" />
        </svg>
      )
    },
    {
      title: 'Samaja Seva Prashasthi',
      org: 'Vishwa Kannada Sahithya Mattu Samskrithika Samsthe, Bangalore',
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M19.5 9.5 18 8l-3.5 3.5L12 9 8.5 12.5 5 9 1 13l4 4 3.5-3.5L12 16l4.5-4.5L20 15l3-3-3.5-2.5zM12 13.5l-2-2 2-2 2 2-2 2z" />
        </svg>
      )
    },
    {
      title: 'Praja Vibhushana Rastra Prashasthi',
      org: 'Karunadu Seva Trust(R), Mysore',
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
      )
    },
    {
      title: 'Navaparva Satya Sachi Prashasthi',
      org: 'Nava Parva Foundation(R), Bangalore',
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )
    },
    {
      title: 'Best Educationalist',
      org: 'Jidayu Staffing Force Private Limited',
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
          <rect x="4" y="19" width="16" height="2.5" rx="1.25" />
        </svg>
      )
    },
    {
      title: 'Rajyotsava Prashasthi',
      org: 'Kasturi Shrigannada Vedike, Mandya',
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#CA8A38">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H8v2h8v-2h-3v-3.1c1.8-.47 3.16-1.89 3.61-3.96C19.08 11.63 21 9.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />

        <main className="founder-page-wrapper">
          {/* =========================================================================
               1. FOUNDER HERO
               ========================================================================= */}
          <section
            className="founder-hero-full"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(16, 14, 14, 0.95) 0%, rgba(16, 14, 14, 0.75) 45%, rgba(16, 14, 14, 0.15) 100%), url('${founderHeroBg}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="container position-relative" style={{ zIndex: 2, paddingTop: '50px', paddingBottom: '50px' }}>
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-10">
                  <div className="founder-hero__content">
                    {/* Eyebrow */}
                    <div className="founder-hero__eyebrow">
                      <span></span>
                      POSITIVE PSYCHOLOGY &amp; HOLISTIC WELLNESS
                    </div>

                    {/* Main Heading */}
                    <h1 className="founder-hero__title" style={{ color: '#FFFFFF' }}>
                      <span style={{ color: '#FFFFFF' }}>DR. NAVEEN</span>
                      <span style={{ color: '#FFFFFF' }}>ELLANGALA</span>
                    </h1>

                    {/* Professional Credentials */}
                    <p className="founder-hero__credentials">
                      Positive Psychologist, Holistic Life Coach,<br />
                      Psychotherapist, International Certified NLP Counsellor,<br />
                      CBT Practitioner, Motivational Speaker, Writer, Poet,<br />
                      Hypnotherapist, Yoga Teacher, Carnatic Violinist,<br />
                      Reflexologist
                    </p>

                    {/* Statement with Underline */}
                    <div className="founder-hero__statement">
                      <span>Inspiring Minds, Transforming Lives</span>
                      <svg width="240" height="12" viewBox="0 0 240 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', marginTop: '2px' }}>
                        <path d="M2 8 C 60 2, 180 12, 238 4" stroke="#D8A54B" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
               2. FOUNDER INTRODUCTION SECTION (TWO-COLUMN EDITORIAL LAYOUT)
               ========================================================================= */}
          <section className="about-one founder-intro-section" id="founder-intro">
            <div className="container">
              <div className="row align-items-center">
                {/* LEFT: Premium Founder Portrait Card */}
                <div className="col-lg-5 col-md-11 mb-4 mb-lg-0 d-flex justify-content-center align-items-start">
                  <div className="founder-portrait-wrap" style={{ maxWidth: '465px', width: '100%', margin: '0 auto' }}>
                    {/* Decorative Dot Grid */}
                    <svg width="50" height="50" viewBox="0 0 60 60" fill="none" style={{ position: 'absolute', right: '-14px', top: '-14px', zIndex: 1, opacity: 0.7 }}>
                      <pattern id="dot-grid" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                        <circle cx="3" cy="3" r="2.5" fill="#D8A54B" />
                      </pattern>
                      <rect width="60" height="60" fill="url(#dot-grid)" />
                    </svg>

                    {/* Outer Frame Card */}
                    <div className="founder-portrait-frame" style={{ background: '#FAF7F2', padding: '12px', borderRadius: '20px', border: '1px solid #F2EAE1', boxShadow: '0 14px 40px rgba(0,0,0,0.07)', position: 'relative', zIndex: 2 }}>
                      <div className="founder-portrait-frame__inner" style={{ borderRadius: '16px', border: '4px solid #FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative', background: '#EAE6DF' }}>
                        <img src={portraitImg} alt="Dr. Naveen Ellangala" style={{ width: '100%', height: '535px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                        <div className="founder-portrait-corner" style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', background: 'var(--fp-terracotta, #D8A54B)', borderTopLeftRadius: '14px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Editorial Content & Biography in Card Layout */}
                <div className="col-lg-7 col-md-12" style={{ paddingLeft: '25px' }}>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #EDE7DE',
                    borderLeft: '4px solid var(--fp-gold, #D8A54B)',
                    boxShadow: '0 12px 36px rgba(17, 30, 56, 0.04)',
                    padding: 'clamp(28px, 4vw, 42px)',
                    position: 'relative'
                  }}>
                    {/* Header */}
                    <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #F0ECE4' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--fp-gold, #D8A54B)', borderRadius: '2px' }}></span>
                        <span style={{ color: 'var(--fp-gold, #D8A54B)', fontWeight: 700, fontSize: '13px', letterSpacing: '1.4px', textTransform: 'uppercase' }}>
                          ABOUT DR. NAVEEN ELLANGALA
                        </span>
                      </div>

                      <h2 style={{
                        fontFamily: 'var(--fp-font-serif, "Playfair Display", serif)',
                        fontSize: 'clamp(28px, 3.2vw, 36px)',
                        fontWeight: 800,
                        color: 'var(--fp-navy, #021B41)',
                        lineHeight: 1.25,
                        margin: 0
                      }}>
                        Empowering Lives Through <br />
                        <span style={{ color: 'var(--fp-gold, #D8A54B)' }}>Positive Psychology</span>
                      </h2>
                    </div>

                    {/* Block 1 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '22px',
                      paddingBottom: '22px',
                      marginBottom: '22px',
                      borderBottom: '1px solid #F0ECE4'
                    }}>
                      <div style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(216, 165, 75, 0.12)',
                        color: 'var(--fp-gold, #D8A54B)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '24px',
                        border: '1.5px solid rgba(216, 165, 75, 0.25)'
                      }}>
                        <i className="fa fa-lightbulb"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#3A4B63', margin: 0, fontWeight: '400' }}>
                          Dr. Naveen Ellangala is a renowned Positive Psychologist and Holistic Life Coach with over 16 years of experience in mind training and personal transformation. He has positively impacted 20,000+ individuals across 300+ institutions, primarily working with Government schools and colleges in Kerala and Karnataka to promote mental well-being and essential life skills.
                        </p>
                      </div>
                    </div>

                    {/* Block 2 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '22px',
                      paddingBottom: '22px',
                      marginBottom: '22px',
                      borderBottom: '1px solid #F0ECE4'
                    }}>
                      <div style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(216, 165, 75, 0.12)',
                        color: 'var(--fp-gold, #D8A54B)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '24px',
                        border: '1.5px solid rgba(216, 165, 75, 0.25)'
                      }}>
                        <i className="fa fa-book-open"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#3A4B63', margin: 0, fontWeight: '400' }}>
                          He is the author of 15 books, including practical workbooks on Mental hygiene, Happiness, and Purposeful living, and a regular columnist for “O Manase” in Yasha Karnataka weekly magazine. His programs and ideas have been featured on TV and radio, and he has received several awards for his valuable contributions to mental well-being.
                        </p>
                      </div>
                    </div>

                    {/* Block 3 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '22px',
                      paddingBottom: '22px',
                      marginBottom: '22px',
                      borderBottom: '1px solid #F0ECE4'
                    }}>
                      <div style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(216, 165, 75, 0.12)',
                        color: 'var(--fp-gold, #D8A54B)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '24px',
                        border: '1.5px solid rgba(216, 165, 75, 0.25)'
                      }}>
                        <i className="fa fa-brain"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#3A4B63', margin: 0, fontWeight: '400' }}>
                          As the creator of the signature concepts Mind Gym and Positive Mind Toolkit, Dr. Naveen has designed structured, activity-based mental fitness models that focus on mental hygiene, Emotional Intelligence (EQ), and Spiritual Intelligence (SQ) to support a meaningful and balanced life.
                        </p>
                      </div>
                    </div>

                    {/* Block 4 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '22px',
                      paddingBottom: 0,
                      marginBottom: 0
                    }}>
                      <div style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(216, 165, 75, 0.12)',
                        color: 'var(--fp-gold, #D8A54B)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '24px',
                        border: '1.5px solid rgba(216, 165, 75, 0.25)'
                      }}>
                        <i className="fa fa-graduation-cap"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#3A4B63', margin: 0, fontWeight: '400' }}>
                          He completed his PhD titled “A Study and Formulation of a PERMA Model of Positive Psychology Based on the Literary Works of Saint Purandaradasa,” a unique framework that helps individuals build a purposeful and meaningful life. Dr. Naveen integrates Positive Psychology and Spiritual Psychology to empower individuals to live consciously, meaningfully, and grow holistically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>



          {/* =========================================================================
               3. COUNTER ONE (GOLD STATS COUNTER)
               ========================================================================= */}
          <section className="counter-one">
            <div className="container">
              <div className="counter-one__inner">
                <div
                  className="counter-one__inner-bg"
                  style={{ backgroundImage: 'url(/assets/images/backgrounds/counter-v1-bg.jpg)' }}
                ></div>
                <div className="row">
                  {homeContent.counter.map((cnt, idx) => (
                    <div key={idx} className="col-xl-3 col-lg-6 col-md-6">
                      <div className="counter-one__single text-center">
                        <div className="counter-one__single-top">
                          <div className={`icon-box ${cnt.iconStyle || ''}`}>
                            <span className={cnt.icon}></span>
                          </div>
                          <div className="text-box">
                            <h2>
                              <span className="odometer" data-count={cnt.count}>
                                00
                              </span>
                              {cnt.hasPlus && (
                                <>
                                  {' '}
                                  <span className="icon-plus plus"></span>
                                </>
                              )}
                            </h2>
                          </div>
                        </div>
                        <div className="counter-one__single-bottom">
                          <p>{cnt.label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
               3.5 THERAPY ONE (FOUNDER & VISION EDITORIAL)
               ========================================================================= */}
          <section className="therapy-one">
            <div className="container">
              <div className="therapy-one__inner">
                <div
                  className="therapy-one__pattern"
                  style={{ backgroundImage: 'url(/assets/images/pattern/therapy-v1-pattern.png)' }}
                ></div>
                <div
                  className="therapy-one__bg"
                  style={{ backgroundImage: 'url(/assets/images/backgrounds/therapy-v1-bg.jpg)' }}
                ></div>
                <div className="therapy-one__img1 wow slideInRight" data-wow-delay="100ms" data-wow-duration="2500ms">
                  <img src="/assets/images/resources/therapy-v1-img1.png" alt="Founder" />
                </div>
                <div className="shape1"></div>
                <div className="shape2"></div>
                <div className="shape3"></div>
                <div className="row">
                  <div className="col-xl-5">
                    <div className="therapy-one__left">
                      <div className="sec-title">
                        <div className="sec-title__tagline">
                          <h6>{homeContent.therapy.tagline}</h6>
                        </div>
                        <h2 className="sec-title__title">
                          {homeContent.therapy.title.split('\n').map((line, lIdx, arr) => (
                            <React.Fragment key={lIdx}>
                              {line}
                              {lIdx < arr.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </h2>
                        {homeContent.therapy.founderInfo && (
                          <div className="therapy-one__founder-badge" style={{ marginTop: '14px' }}>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--uterpy-black)', margin: '0 0 2px' }}>
                              {homeContent.therapy.founderInfo.name}
                            </h4>
                            <p style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--uterpy-base)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {homeContent.therapy.founderInfo.role}
                            </p>
                          </div>
                        )}
                      </div>

                      <ul className="therapy-one__left-list">
                        {homeContent.therapy.leftItems.map((item, idx) => (
                          <li key={idx} className="wow fadeInLeft" data-wow-delay={item.delay} data-wow-duration="1500ms">
                            <div className="icon-box">
                              <span className={item.icon}></span>
                            </div>
                            <div className="content-box">
                              <h2>{item.title}</h2>
                              <p>{item.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="col-xl-7">
                    <div className="therapy-one__right clearfix">
                      <div className="therapy-one__right-content">
                        <div
                          className="therapy-one__right-content-bg"
                          style={{ backgroundImage: 'url(/assets/images/backgrounds/therapy-v1-bg2.jpg)' }}
                        ></div>
                        <div className="inner">
                          <div className="icon-box">
                            <span className={homeContent.therapy.rightBox.icon}></span>
                          </div>
                          <div className="content-box">
                            <h2>
                              {homeContent.therapy.rightBox.title.split('\n').map((line, lIdx, arr) => (
                                <React.Fragment key={lIdx}>
                                  {line}
                                  {lIdx < arr.length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </h2>
                            <p>{homeContent.therapy.rightBox.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
               4. ORGANISATION SECTION (EXACT DESIGN MATCH)
               ========================================================================= */}
          <section className="org-section">
            {/* Background Globe Line Graphic (Left) */}
            <svg className="org-section__bg-globe" viewBox="0 0 200 200" fill="none" stroke="#CA8A38" strokeWidth="1.2">
              <circle cx="100" cy="100" r="90" />
              <ellipse cx="100" cy="100" rx="90" ry="38" />
              <line x1="10" y1="100" x2="190" y2="100" />
              <line x1="100" y1="10" x2="100" y2="190" />
              <path d="M40 40 A90 90 0 0 0 160 160" strokeDasharray="3 3" />
              <circle cx="65" cy="135" r="16" />
              <circle cx="110" cy="130" r="14" />
              <circle cx="145" cy="140" r="12" />
            </svg>

            {/* Background Dot Matrix (Right) */}
            <svg className="org-section__bg-dots" viewBox="0 0 100 100" fill="none">
              <pattern id="org-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="2.2" fill="#CA8A38" />
              </pattern>
              <rect width="100" height="100" fill="url(#org-dots)" />
            </svg>

            {/* Left Botanical Watercolor Leaf Graphic */}
            <svg className="org-section__leaf-left" viewBox="0 0 120 220" fill="none">
              <path d="M10 210 C30 180 50 130 30 70 C20 40 45 10 70 20 C90 30 75 70 55 90 C35 110 50 150 20 210" fill="none" stroke="#87A96B" strokeWidth="2.5" opacity="0.6" />
              <ellipse cx="38" cy="85" rx="14" ry="7" fill="#87A96B" opacity="0.45" transform="rotate(-30 38 85)" />
              <ellipse cx="62" cy="55" rx="16" ry="8" fill="#5F8548" opacity="0.5" transform="rotate(25 62 55)" />
              <ellipse cx="45" cy="130" rx="15" ry="7" fill="#87A96B" opacity="0.45" transform="rotate(-40 45 130)" />
              <ellipse cx="32" cy="175" rx="14" ry="7" fill="#5F8548" opacity="0.4" transform="rotate(35 32 175)" />
            </svg>

            {/* Right Botanical Watercolor Leaf Graphic */}
            <svg className="org-section__leaf-right" viewBox="0 0 120 220" fill="none">
              <path d="M110 10 C90 40 70 90 90 150 C100 180 75 210 50 200 C30 190 45 150 65 130 C85 110 70 70 100 10" fill="none" stroke="#87A96B" strokeWidth="2.5" opacity="0.6" />
              <ellipse cx="82" cy="135" rx="14" ry="7" fill="#87A96B" opacity="0.45" transform="rotate(30 82 135)" />
              <ellipse cx="58" cy="165" rx="16" ry="8" fill="#5F8548" opacity="0.5" transform="rotate(-25 58 165)" />
              <ellipse cx="75" cy="90" rx="15" ry="7" fill="#87A96B" opacity="0.45" transform="rotate(40 75 90)" />
              <ellipse cx="88" cy="45" rx="14" ry="7" fill="#5F8548" opacity="0.4" transform="rotate(-35 88 45)" />
            </svg>

            <div className="org-section__container">
              {/* Header */}
              <div className="org-header">
                <div className="org-header__ornament">
                  <span className="org-header__ornament-line"></span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#CA8A38">
                    <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                  </svg>
                  <span className="org-header__ornament-line"></span>
                </div>

                <div className="org-header__eyebrow">ORGANISATION</div>
                <h2 className="org-header__title">Our Foundation. Our Commitment.</h2>
                <div className="org-header__divider"></div>
                <p className="org-header__subtitle">
                  Rooted in purpose and driven by a vision for a healthier mind and a better society, our work is guided by strong values and meaningful partnerships.
                </p>
              </div>

              {/* 3 Organization Cards */}
              <div className="row g-4 justify-content-center">
                {/* CARD 1: Ellangala's Academy */}
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="org-card-item">
                    <div className="org-card-item__body">
                      {/* Top-Right Decorative Waves Watermark */}
                      <svg className="org-card-item__watermark" width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="#CA8A38" strokeWidth="1.2">
                        <path d="M20 0 C40 30 70 40 100 20" />
                        <path d="M40 0 C60 30 80 40 100 35" />
                        <path d="M60 0 C75 25 85 35 100 50" />
                        <path d="M80 0 C90 15 95 25 100 65" />
                      </svg>

                      {/* Icon Circle Badge */}
                      <div className="org-card-item__icon-circle">
                        <svg width="46" height="46" viewBox="0 0 24 24" fill="#CA8A38">
                          <path d="M20 2H8C6.9 2 6 2.9 6 4v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3h2c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4 18H4V9h12v11zm4-5h-2V9c0-1.1-.9-2-2-2H8V4h12v11z" />
                          <circle cx="10" cy="13" r="2" />
                          <path d="M7 18c0-1.66 1.34-3 3-3s3 1.34 3 3H7z" />
                        </svg>
                      </div>

                      {/* Smile Arc with Center Navy Dot */}
                      <div className="org-card-item__smile-arc">
                        <svg width="136" height="22" viewBox="0 0 136 22" fill="none">
                          <path d="M12 3C38 19 98 19 124 3" stroke="#D8A54B" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <div className="org-card-item__dot"></div>
                      </div>

                      {/* Designation */}
                      <div className="org-card-item__role">FOUNDER &amp; DIRECTOR</div>

                      {/* Name */}
                      <h3 className="org-card-item__name">Ellangala’s Academy</h3>

                      {/* Gold Line */}
                      <div className="org-card-item__divider"></div>
                    </div>

                    {/* Card Footer Bar */}
                    <div className="org-card-item__footer">
                      <div className="org-card-item__globe">
                        <i className="fa fa-globe"></i>
                      </div>
                      <a href="https://www.ellangala.com" target="_blank" rel="noopener noreferrer">
                        www.ellangala.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Jnanakoota Foundation */}
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="org-card-item">
                    <div className="org-card-item__body">
                      {/* Top-Right Decorative Dot Matrix Watermark */}
                      <svg className="org-card-item__watermark" width="70" height="70" viewBox="0 0 70 70" fill="none">
                        <pattern id="card2-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                          <circle cx="3" cy="3" r="2" fill="#CA8A38" />
                        </pattern>
                        <rect width="70" height="70" fill="url(#card2-dots)" />
                      </svg>

                      {/* Icon Circle Badge */}
                      <div className="org-card-item__icon-circle">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="#CA8A38">
                          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2V11zm0 4h-2v2h2v-2z" />
                        </svg>
                      </div>

                      {/* Smile Arc with Center Navy Dot */}
                      <div className="org-card-item__smile-arc">
                        <svg width="136" height="22" viewBox="0 0 136 22" fill="none">
                          <path d="M12 3C38 19 98 19 124 3" stroke="#D8A54B" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <div className="org-card-item__dot"></div>
                      </div>

                      {/* Designation */}
                      <div className="org-card-item__role">FOUNDER PRESIDENT</div>

                      {/* Name */}
                      <h3 className="org-card-item__name">Jnanakoota Foundation</h3>

                      {/* Gold Line */}
                      <div className="org-card-item__divider"></div>
                    </div>

                    {/* Card Footer Bar */}
                    <div className="org-card-item__footer">
                      <div className="org-card-item__globe">
                        <i className="fa fa-globe"></i>
                      </div>
                      <a href="https://www.jnanakoota.com" target="_blank" rel="noopener noreferrer">
                        www.jnanakoota.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* CARD 3: International Mental Health Forum */}
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="org-card-item">
                    <div className="org-card-item__body">
                      {/* Top-Right Decorative Waves Watermark */}
                      <svg className="org-card-item__watermark" width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="#CA8A38" strokeWidth="1.2">
                        <path d="M20 0 C40 30 70 40 100 20" />
                        <path d="M40 0 C60 30 80 40 100 35" />
                        <path d="M60 0 C75 25 85 35 100 50" />
                        <path d="M80 0 C90 15 95 25 100 65" />
                      </svg>

                      {/* Icon Circle Badge */}
                      <div className="org-card-item__icon-circle">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="#CA8A38">
                          <path d="m12 2-10 5 10 5 10-5-10-5zm-10 9 10 5 10-5-2-1-8 4-8-4-2 1zm0 4 10 5 10-5-2-1-8 4-8-4-2 1z" />
                        </svg>
                      </div>

                      {/* Smile Arc with Center Navy Dot */}
                      <div className="org-card-item__smile-arc">
                        <svg width="136" height="22" viewBox="0 0 136 22" fill="none">
                          <path d="M12 3C38 19 98 19 124 3" stroke="#D8A54B" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <div className="org-card-item__dot"></div>
                      </div>

                      {/* Designation */}
                      <div className="org-card-item__role">MEMBER</div>

                      {/* Name */}
                      <h3 className="org-card-item__name">
                        International Mental <br />
                        Health Forum
                      </h3>

                      {/* Gold Line */}
                      <div className="org-card-item__divider"></div>
                    </div>

                    {/* Card Footer Bar */}
                    <div className="org-card-item__footer">
                      <div className="org-card-item__globe">
                        <i className="fa fa-globe"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
               5. BOOKS SECTION (15 BOOKS + 3D SHOWCASE)
               ========================================================================= */}
          {/* =========================================================================
               5. BOOKS SECTION (EXACT DESIGN MATCH)
               ========================================================================= */}
          <section className="books-section">
            {/* Background Open Book Watermark Graphic */}
            <svg className="books-section__bg-book" viewBox="0 0 200 160" fill="none" stroke="#CA8A38" strokeWidth="1.2">
              <path d="M100 140 C60 120 20 125 10 140 V30 C20 15 60 10 100 30 C140 10 180 15 190 30 V140 C180 125 140 120 100 140 Z" />
              <line x1="100" y1="30" x2="100" y2="140" />
              <path d="M100 45 C65 28 30 33 20 45" />
              <path d="M100 60 C65 43 30 48 20 60" />
              <path d="M100 45 C135 28 170 33 180 45" />
              <path d="M100 60 C135 43 170 48 180 60" />
            </svg>

            {/* Background Branch Foliage Graphic */}
            <svg className="books-section__bg-branch" viewBox="0 0 100 160" fill="none">
              <path d="M50 150 C30 110 60 70 40 10" stroke="#87A96B" strokeWidth="1.8" opacity="0.4" />
              <ellipse cx="48" cy="45" rx="12" ry="6" fill="#87A96B" opacity="0.35" transform="rotate(-25 48 45)" />
              <ellipse cx="62" cy="75" rx="14" ry="7" fill="#5F8548" opacity="0.4" transform="rotate(30 62 75)" />
              <ellipse cx="38" cy="105" rx="13" ry="6" fill="#87A96B" opacity="0.35" transform="rotate(-35 38 105)" />
            </svg>

            <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
              <div className="row align-items-center gx-lg-5">
                {/* Left Column: Heading, Subtitle, 2-Column Numbered Book List & Button */}
                <div className="col-lg-6 col-md-12 mb-5 mb-lg-0">
                  <div style={{ marginBottom: '24px' }}>
                    {/* Icon + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="#CA8A38">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                        <path d="M6.5 2H20v4H6.5A2.5 2.5 0 0 1 4 3.5V4a2.5 2.5 0 0 1 2.5-2z" opacity="0.3" />
                        <line x1="8" y1="7" x2="16" y2="7" stroke="#FFFFFF" strokeWidth="1.5" />
                        <line x1="8" y1="11" x2="16" y2="11" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>
                      <h2 style={{ fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)', fontSize: '38px', fontWeight: 800, color: '#021B41', margin: 0, letterSpacing: '0.5px' }}>
                        BOOKS
                      </h2>
                    </div>

                    {/* Gold Divider */}
                    <div style={{ width: '48px', height: '2.5px', backgroundColor: '#D8A54B', borderRadius: '2px', margin: '10px 0 16px' }}></div>

                    {/* Subtitle */}
                    <p style={{ fontSize: '15.5px', color: '#555555', lineHeight: '1.6', margin: 0, maxWidth: '520px', fontFamily: 'var(--fp-font-sans)' }}>
                      Insights, inspiration, and practical tools to help you grow, heal, and transform your life.
                    </p>
                  </div>

                  {/* 2-Column 15 Books List */}
                  <div className="row g-3" style={{ marginTop: '10px' }}>
                    {/* Left Column: 1 to 8 */}
                    <div className="col-sm-6 col-12">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {booksListCol1.map((b) => (
                          <div key={b.num} className="books-item-row">
                            <div className="books-number-badge">{b.num}</div>
                            <div className="books-item-title">{b.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: 9 to 15 */}
                    <div className="col-sm-6 col-12">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {booksListCol2.map((b) => (
                          <div key={b.num} className="books-item-row">
                            <div className="books-number-badge">{b.num}</div>
                            <div className="books-item-title">
                              {b.title}
                              {b.forthcoming && <span className="books-item-forthcoming">(forthcoming)</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div>
                    <Link to="/shop" className="books-cta-btn">
                      Explore Books
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Showcase Image */}
                <div className="col-lg-6 col-md-12 text-center text-lg-end">
                  <div style={{ width: '100%', maxWidth: '600px', display: 'inline-block', position: 'relative' }}>
                    <img
                      src={founderBooksShowcaseImg}
                      alt="Dr. Naveen Ellangala Books Collection Showcase"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
               6. QUALIFICATIONS SECTION (EXACT DESIGN MATCH)
               ========================================================================= */}
          <section className="qual-section">
            {/* Top-Left Leaf Watermark */}
            <svg className="qual-section__bg-leaf-tl" viewBox="0 0 170 170" fill="none">
              <path d="M10 160 C40 130 60 80 40 20 C20 -10 80 10 90 40 C100 70 70 110 40 130" stroke="#87A96B" strokeWidth="2" opacity="0.45" />
              <ellipse cx="48" cy="50" rx="18" ry="8" fill="#87A96B" opacity="0.4" transform="rotate(-35 48 50)" />
              <ellipse cx="85" cy="40" rx="20" ry="9" fill="#5F8548" opacity="0.45" transform="rotate(25 85 40)" />
              <ellipse cx="60" cy="95" rx="18" ry="8" fill="#87A96B" opacity="0.4" transform="rotate(-40 60 95)" />
              <ellipse cx="40" cy="130" rx="16" ry="8" fill="#5F8548" opacity="0.4" transform="rotate(30 40 130)" />
            </svg>

            {/* Top-Right Dot Matrix */}
            <svg className="qual-section__bg-dots-tr" viewBox="0 0 100 100" fill="none">
              <pattern id="qual-dots-tr" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="2.2" fill="#CA8A38" />
              </pattern>
              <rect width="100" height="100" fill="url(#qual-dots-tr)" />
            </svg>

            {/* Bottom-Left Dot Matrix */}
            <svg className="qual-section__bg-dots-bl" viewBox="0 0 100 100" fill="none">
              <pattern id="qual-dots-bl" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="2.2" fill="#CA8A38" />
              </pattern>
              <rect width="100" height="100" fill="url(#qual-dots-bl)" />
            </svg>

            {/* Bottom-Right Leaf Watermark */}
            <svg className="qual-section__bg-leaf-br" viewBox="0 0 220 220" fill="none">
              <path d="M210 210 C170 170 130 110 160 40 C170 10 100 30 90 70 C80 110 120 160 160 180" stroke="#87A96B" strokeWidth="2.2" opacity="0.45" />
              <ellipse cx="145" cy="80" rx="22" ry="10" fill="#87A96B" opacity="0.4" transform="rotate(35 145 80)" />
              <ellipse cx="105" cy="65" rx="22" ry="10" fill="#5F8548" opacity="0.45" transform="rotate(-25 105 65)" />
              <ellipse cx="130" cy="130" rx="20" ry="9" fill="#87A96B" opacity="0.4" transform="rotate(40 130 130)" />
              <ellipse cx="165" cy="165" rx="18" ry="9" fill="#5F8548" opacity="0.4" transform="rotate(-30 165 165)" />
            </svg>

            <div className="qual-section__container">
              {/* Header */}
              <div className="qual-header">
                <div className="qual-header__eyebrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#CA8A38">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                  </svg>
                  QUALIFICATION
                </div>
                <h2 className="qual-header__title">Academic &amp; Professional Qualifications</h2>
                <div className="qual-header__ornament">
                  <span className="qual-header__ornament-line"></span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#CA8A38">
                    <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z" />
                  </svg>
                  <span className="qual-header__ornament-line"></span>
                </div>
              </div>

              {/* Row 1: First 4 Cards */}
              <div className="row g-4 mb-4">
                {qualList.slice(0, 4).map((q, idx) => (
                  <div className="col-lg-3 col-md-6 col-12" key={idx}>
                    <div className="qual-card-item">
                      <div className="qual-card-item__icon">{q.icon}</div>
                      <div className="qual-card-item__sep"></div>
                      <div className="qual-card-item__content">
                        <h3 className="qual-card-item__title">{q.title}</h3>
                        <div className="qual-card-item__dash"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: Next 4 Cards */}
              <div className="row g-4 mb-4">
                {qualList.slice(4, 8).map((q, idx) => (
                  <div className="col-lg-3 col-md-6 col-12" key={idx}>
                    <div className="qual-card-item">
                      <div className="qual-card-item__icon">{q.icon}</div>
                      <div className="qual-card-item__sep"></div>
                      <div className="qual-card-item__content">
                        <h3 className="qual-card-item__title">{q.title}</h3>
                        <div className="qual-card-item__dash"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 3: Last 2 Cards Centered */}
              <div className="row g-4 justify-content-center">
                {qualList.slice(8, 10).map((q, idx) => (
                  <div className="col-lg-3 col-md-6 col-12" key={idx}>
                    <div className="qual-card-item">
                      <div className="qual-card-item__icon">{q.icon}</div>
                      <div className="qual-card-item__sep"></div>
                      <div className="qual-card-item__content">
                        <h3 className="qual-card-item__title">{q.title}</h3>
                        <div className="qual-card-item__dash"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================================
               7. AWARDS & HONORS (EXACT DESIGN MATCH)
               ========================================================================= */}
          <section className="awards-section">
            {/* Top-Left Interlocking Rings Watermark */}
            <svg className="awards-section__bg-rings" viewBox="0 0 110 110" fill="none">
              <circle cx="45" cy="45" r="36" stroke="#CA8A38" strokeWidth="1.8" />
              <circle cx="28" cy="22" r="10" fill="#CA8A38" opacity="0.6" />
              <circle cx="68" cy="68" r="22" stroke="#CA8A38" strokeWidth="1.2" strokeDasharray="3 3" />
            </svg>

            {/* Top-Right Dot Matrix */}
            <svg className="awards-section__bg-dots" viewBox="0 0 100 100" fill="none">
              <pattern id="awards-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="2.2" fill="#CA8A38" />
              </pattern>
              <rect width="100" height="100" fill="url(#awards-dots)" />
            </svg>

            {/* Left Leaf Watermark */}
            <svg className="awards-section__bg-leaf-left" viewBox="0 0 120 220" fill="none">
              <path d="M10 210 C30 180 50 130 30 70 C20 40 45 10 70 20" stroke="#87A96B" strokeWidth="2.2" opacity="0.45"/>
              <ellipse cx="38" cy="85" rx="16" ry="7" fill="#87A96B" opacity="0.4" transform="rotate(-30 38 85)"/>
              <ellipse cx="62" cy="55" rx="18" ry="8" fill="#5F8548" opacity="0.45" transform="rotate(25 62 55)"/>
              <ellipse cx="45" cy="130" rx="16" ry="7" fill="#87A96B" opacity="0.4" transform="rotate(-40 45 130)"/>
              <ellipse cx="32" cy="175" rx="15" ry="7" fill="#5F8548" opacity="0.4" transform="rotate(35 32 175)"/>
            </svg>

            {/* Right Leaf Watermark */}
            <svg className="awards-section__bg-leaf-right" viewBox="0 0 120 220" fill="none">
              <path d="M110 10 C90 40 70 90 90 150 C100 180 75 210 50 200" stroke="#87A96B" strokeWidth="2.2" opacity="0.45"/>
              <ellipse cx="82" cy="135" rx="16" ry="7" fill="#87A96B" opacity="0.4" transform="rotate(30 82 135)"/>
              <ellipse cx="58" cy="165" rx="18" ry="8" fill="#5F8548" opacity="0.45" transform="rotate(-25 58 165)"/>
              <ellipse cx="75" cy="90" rx="16" ry="7" fill="#87A96B" opacity="0.4" transform="rotate(40 75 90)"/>
              <ellipse cx="88" cy="45" rx="15" ry="7" fill="#5F8548" opacity="0.4" transform="rotate(-35 88 45)"/>
            </svg>

            <div className="awards-section__container">
              {/* Header */}
              <div className="awards-header">
                <div className="awards-header__eyebrow">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#CA8A38" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z" opacity="0.75"/>
                    <path d="M8 8 C6 10 4 12 4 15 a4 4 0 0 0 8 0" opacity="0.55"/>
                  </svg>
                  AWARDS &amp; HONORS
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#CA8A38">
                    <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z" opacity="0.75"/>
                    <path d="M8 8 C6 10 4 12 4 15 a4 4 0 0 0 8 0" opacity="0.55"/>
                  </svg>
                </div>
                <h2 className="awards-header__title">Honors &amp; Recognition</h2>
                <div className="awards-header__ornament">
                  <span style={{ width: '40px', height: '1.5px', backgroundColor: '#D8A54B', opacity: 0.8 }}></span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#CA8A38">
                    <path d="M12 3c-1.5 3-4 6.5-7 9 3 1.5 6 1.5 7-2 1 3.5 4 3.5 7 2-3-2.5-5.5-6-7-9z"/>
                  </svg>
                  <span style={{ width: '40px', height: '1.5px', backgroundColor: '#D8A54B', opacity: 0.8 }}></span>
                </div>
                <p className="awards-header__subtitle">
                  Recognized for meaningful contributions to education, student success, yoga, spiritual psychology, and positive psychology.
                </p>
              </div>

              {/* 7-Columns Layout */}
              <div className="awards-row-7">
                {awardsList.map((award, idx) => (
                  <div className="award-item-col" key={idx}>
                    <div className="award-item-col__icon">{award.icon}</div>
                    <h3 className="award-item-col__title">{award.title}</h3>
                    <div className="award-item-col__divider"></div>
                    <p className="award-item-col__org">{award.org}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
