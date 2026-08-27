import React from 'react';
import { Link } from 'react-router-dom';
import HeaderOne from '../layout/HeaderOne';
import FooterOne from '../layout/FooterOne';
import PageHeader from '../common/PageHeader';
import ServiceSidebar from '../common/ServiceSidebar';
import Preloader from '../layout/Preloader';
import CustomCursor from '../layout/CustomCursor';
import MobileNav from '../layout/MobileNav';
import SearchPopup from '../layout/SearchPopup';
import ScrollToTop from '../layout/ScrollToTop';
import { useUterpyPlugins } from '../../hooks/useUterpyPlugins';
import { useEnrollModal } from '../../context/EnrollModalContext';

export default function ProgramDetailPage({ data }) {
  useUterpyPlugins();
  const { openEnrollModal } = useEnrollModal();

  if (!data) return null;

  const isWorkshop = data.type === 'workshop';

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        {/* 01. HERO / INTRODUCTION */}
        <PageHeader title={data.title} pageName={data.title} />

        {/* Main Content & Sidebar Section */}
        <section className="services-details" style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="row">
              {/* Sidebar Component */}
              <ServiceSidebar currentProgram={data.title} category={data.type || data.category} />

              {/* Detail Content Area */}
              <div className="col-xl-8">
                <div className="services-details__content">
                  
                  {/* Category Badge & Title Positioning */}
                  <div style={{ marginBottom: '30px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '5px 14px',
                        borderRadius: '20px',
                        backgroundColor: '#FAF5EC',
                        color: '#CA8A38',
                        fontSize: '12px',
                        fontWeight: '700',
                        letterSpacing: '1.2px',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        border: '1px solid #EFE4D2',
                      }}
                    >
                      {data.category}
                    </span>
                    <h1
                      style={{
                        fontSize: '34px',
                        fontWeight: '800',
                        color: '#0F231B',
                        lineHeight: '1.25',
                        marginBottom: '12px',
                        fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)',
                      }}
                    >
                      {data.title}
                    </h1>
                    <p
                      style={{
                        fontSize: '17px',
                        color: '#CA8A38',
                        fontWeight: '500',
                        lineHeight: '1.5',
                        marginBottom: '24px',
                      }}
                    >
                      {data.shortPositioning}
                    </p>

                    {/* Hero Image */}
                    {data.heroImage && (
                      <div className="img-box" style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '36px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
                        <img
                          src={data.heroImage}
                          alt={data.title}
                          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* 02. WHAT IS THIS? */}
                  <div className="services-details__content-text1" style={{ marginBottom: '36px' }}>
                    <h2
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#0F231B',
                        marginBottom: '14px',
                        fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)',
                      }}
                    >
                      {data.whatIs.title}
                    </h2>
                    <p style={{ fontSize: '15.5px', color: '#4B5563', lineHeight: '1.7' }}>
                      {data.whatIs.content}
                    </p>
                  </div>

                  {/* 03. WHY IT MATTERS */}
                  <div className="services-details__content-text2" style={{ marginBottom: '40px', padding: '28px 30px', backgroundColor: '#FAF8F5', borderRadius: '12px', borderLeft: '4px solid #CA8A38' }}>
                    <h2
                      style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#0F231B',
                        marginBottom: '12px',
                        fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)',
                      }}
                    >
                      {data.whyItMatters.title}
                    </h2>
                    <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: '1.65', margin: 0 }}>
                      {data.whyItMatters.content}
                    </p>
                  </div>

                  {/* 04. WHO IS IT FOR? */}
                  <div style={{ marginBottom: '40px' }}>
                    <h2
                      style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#0F231B',
                        marginBottom: '18px',
                        fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)',
                      }}
                    >
                      Who Is It For?
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {data.audiences.map((aud, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '10px 18px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            color: '#1F2937',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                          }}
                        >
                          <i className="fas fa-check-circle" style={{ color: '#CA8A38', fontSize: '14px' }}></i>
                          <span>{aud}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 05. WHAT YOU WILL EXPLORE / WORK ON */}
                  <div className="services-details__content-text4" style={{ marginBottom: '44px' }}>
                    <h2
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#0F231B',
                        marginBottom: '20px',
                        fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)',
                      }}
                    >
                      {data.focusSection.title}
                    </h2>
                    <div className="single-list-box">
                      <ul className="clearfix" style={{ paddingLeft: 0, listStyle: 'none' }}>
                        {data.focusSection.items.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '12px' }}>
                            <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start', gap: '10px', margin: 0 }}>
                              <span className="icon-tag-chevron" style={{ color: '#CA8A38', marginTop: '4px', flexShrink: 0 }}></span>
                              <span>{item}</span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 06. HOW IT WORKS */}
                  <div style={{ marginBottom: '48px', padding: '32px 28px', backgroundColor: '#FAF8F5', borderRadius: '16px', border: '1px solid #EFE6D8' }}>
                    <h2
                      style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#0F231B',
                        marginBottom: '20px',
                        textAlign: 'center',
                        fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)',
                      }}
                    >
                      How It Works
                    </h2>

                    {/* Step Cards Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '12px',
                        marginBottom: '24px',
                      }}
                    >
                      {data.process.steps.map((step, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            padding: '18px 12px',
                            textAlign: 'center',
                            border: '1px solid #E8DFD1',
                            boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              color: '#CA8A38',
                              display: 'block',
                              marginBottom: '4px',
                            }}
                          >
                            STEP 0{idx + 1}
                          </span>
                          <strong
                            style={{
                              fontSize: '14px',
                              color: '#0F231B',
                              display: 'block',
                              marginBottom: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {step.title}
                          </strong>
                          <p style={{ fontSize: '11.5px', color: '#6B7280', margin: 0, lineHeight: '1.35' }}>
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p
                      style={{
                        fontSize: '13.5px',
                        color: '#6B7280',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: '1.6',
                      }}
                    >
                      "{data.process.supportingText}"
                    </p>
                  </div>

                  {/* 07. OUR APPROACH */}
                  <div style={{ marginBottom: '48px' }}>
                    <h2
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#0F231B',
                        marginBottom: '20px',
                        fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)',
                      }}
                    >
                      Our Approach
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      {data.approach.items.map((app, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '24px 20px',
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #E5E7EB',
                            borderTop: '3px solid #CA8A38',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div style={{ fontSize: '13px', fontWeight: '800', color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                            {app.title}
                          </div>
                          <p style={{ fontSize: '13.5px', color: '#4B5563', margin: 0, lineHeight: '1.55' }}>
                            {app.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 08. IMPACT ON THOUGHTS, FEELINGS & BEHAVIOURS */}
                  <div style={{ marginBottom: '48px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#CA8A38', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        SIGNATURE ACADEMY FRAMEWORK
                      </span>
                      <h2
                        style={{
                          fontSize: '26px',
                          fontWeight: '800',
                          color: '#0F231B',
                          marginTop: '6px',
                          fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)',
                        }}
                      >
                        Impact on Thoughts, Feelings &amp; Behaviours
                      </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
                      {/* THOUGHTS Column */}
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '14px',
                          padding: '28px 22px',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            fontSize: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                          }}
                        >
                          <i className="fas fa-brain"></i>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                          THOUGHTS
                        </h3>
                        <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                          {data.impact.thoughts}
                        </p>
                      </div>

                      {/* FEELINGS Column */}
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '14px',
                          padding: '28px 22px',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            backgroundColor: '#FEF3C7',
                            color: '#D97706',
                            fontSize: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                          }}
                        >
                          <i className="fas fa-heart"></i>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                          FEELINGS
                        </h3>
                        <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                          {data.impact.feelings}
                        </p>
                      </div>

                      {/* BEHAVIOURS Column */}
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '14px',
                          padding: '28px 22px',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            backgroundColor: '#ECFDF5',
                            color: '#059669',
                            fontSize: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                          }}
                        >
                          <i className="fas fa-walking"></i>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                          BEHAVIOURS
                        </h3>
                        <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                          {data.impact.behaviours}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 09. TWO SIGNATURE HIGHLIGHT BOXES */}
                  {data.highlights && data.highlights.length >= 2 && (
                    <div style={{ marginBottom: '44px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {data.highlights.map((hl, idx) => (
                          <div
                            key={idx}
                            style={{
                              backgroundColor: '#FAF5EC',
                              border: '1.5px solid #E9D5B5',
                              borderRadius: '12px',
                              padding: '22px 20px',
                              textAlign: 'center',
                              boxShadow: '0 4px 12px rgba(202, 138, 56, 0.08)',
                            }}
                          >
                            <span style={{ fontSize: '18px', fontWeight: '700', color: '#CA8A38', display: 'block' }}>
                              {hl}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 10. FINAL CTA */}
                  <div
                    style={{
                      backgroundColor: '#1E2B37',
                      borderRadius: '16px',
                      padding: '40px 32px',
                      textAlign: 'center',
                      color: '#ffffff',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '12px', fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)' }}>
                      {data.cta.heading}
                    </h2>
                    <p style={{ fontSize: '15px', color: '#D1D5DB', maxWidth: '520px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                      {data.cta.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => openEnrollModal(data.title)}
                      style={{
                        padding: '14px 36px',
                        backgroundColor: '#D4A359',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '700',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(212, 163, 89, 0.4)',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#CA8A38';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#D4A359';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {data.cta.buttonText}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
