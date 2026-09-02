import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderOne from '../../../components/layout/HeaderOne';
import FooterOne from '../../../components/layout/FooterOne';
import PageHeader from '../../../components/common/PageHeader';
import Preloader from '../../../components/layout/Preloader';
import CustomCursor from '../../../components/layout/CustomCursor';
import MobileNav from '../../../components/layout/MobileNav';
import SearchPopup from '../../../components/layout/SearchPopup';
import ScrollToTop from '../../../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../../../hooks/useUterpyPlugins';
import { eventService } from '../services/eventService';
import { initialEvents } from '../data/eventSeedData';
import { useEnrollModal } from '../../../context/EnrollModalContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Tag,
  CreditCard,
  ExternalLink,
  Video,
  Globe,
  Award,
  BookOpen,
  Sparkles,
  HelpCircle,
  Quote
} from 'lucide-react';
import SEO from '../../../seo/SEO';
import { generateEventSchema, generateBreadcrumbSchema } from '../../../seo/schemas/schemaGenerators';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function EventDetailsPage() {
  useUterpyPlugins();
  const { slug } = useParams();
  const { openEnrollModal } = useEnrollModal();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    eventService
      .getEventBySlug(slug)
      .then((evt) => {
        if (evt) {
          setEvent(evt);
        } else {
          const localMatch = initialEvents.find(
            (e) => e.slug === slug || e.id === slug || String(e.id) === String(slug)
          );
          setEvent(localMatch || null);
        }
        setLoading(false);
      })
      .catch(() => {
        const localMatch = initialEvents.find(
          (e) => e.slug === slug || e.id === slug || String(e.id) === String(slug)
        );
        setEvent(localMatch || null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <>
        <CustomCursor />
        <Preloader />
      </>
    );
  }

  if (!event || event.status === 'draft') {
    return (
      <>
        <CustomCursor />
        <Preloader />
        <div className="page-wrapper">
          <HeaderOne />
          <PageHeader title="Event Not Found" breadcrumb="Event" />
          <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h2>Event Not Found</h2>
            <p style={{ color: '#64748B', margin: '16px 0 24px' }}>The event you are looking for could not be found or has been removed.</p>
            <Link to="/events" className="thm-btn">Back to All Events</Link>
          </div>
          <FooterOne />
        </div>
      </>
    );
  }

  const handleRegisterClick = () => {
    openEnrollModal(event.title, {
      sourceType: 'Event',
      eventId: event.id,
      eventTitle: event.title
    });
  };

  const isCancelled = event.status === 'cancelled';
  const isCompleted = event.status === 'completed';

  const seoTitle = event.seo?.title || `${event.title} | Ellangala’s Academy`;
  const seoDesc = event.seo?.description || event.shortDescription || event.description || `Join ${event.title} conducted by ${event.speaker || 'Dr. Naveen Ellangala'}.`;
  const seoImg = event.seo?.image || event.image;
  const isNoindex = Boolean(event.seo?.noindex);

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title={seoTitle}
          description={seoDesc}
          canonical={`/events/${event.slug}`}
          image={seoImg}
          type="event"
          noindex={isNoindex}
          structuredData={[
            generateEventSchema(event),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Events', path: '/events' },
              { name: event.title, path: `/events/${event.slug}` }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title={event.title} breadcrumb={`Events / ${event.title}`} />

        {/* Start Event Detail Page */}
        <section style={{ paddingTop: '60px', paddingBottom: '90px', backgroundColor: '#FAF8F5' }}>
          <div className="container">
            {/* Back Button */}
            <div style={{ marginBottom: '24px' }}>
              <Link
                to="/events"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#CA8A38',
                  fontWeight: '700',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={16} />
                <span>Back to All Events</span>
              </Link>
            </div>

            <div className="row gy-4">
              {/* Left Column: Event Content */}
              <div className="col-xl-8 col-lg-7">
                {/* Hero Card */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        backgroundColor: '#FAF5EC',
                        color: '#CA8A38',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px'
                      }}
                    >
                      {event.subtitle || event.series || event.category}
                    </span>

                    {event.language && (
                      <span
                        style={{
                          backgroundColor: '#EFF6FF',
                          color: '#2563EB',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '800',
                          textTransform: 'uppercase'
                        }}
                      >
                        {event.language}
                      </span>
                    )}

                    {isCancelled && (
                      <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                        EVENT CANCELLED
                      </span>
                    )}

                    {isCompleted && (
                      <span style={{ backgroundColor: '#E2E8F0', color: '#475569', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                        PAST EVENT
                      </span>
                    )}
                  </div>

                  <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0F231B', marginBottom: '10px', lineHeight: '1.25' }}>
                    {event.title}
                  </h1>

                  {event.heroTagline && (
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#CA8A38', marginBottom: '16px' }}>
                      {event.heroTagline}
                    </div>
                  )}

                  <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>
                    {event.description || event.shortDescription}
                  </p>

                  <div style={{ marginBottom: '28px' }}>
                    <button
                      type="button"
                      onClick={handleRegisterClick}
                      className="thm-btn"
                      style={{
                        padding: '12px 30px',
                        borderRadius: '8px',
                        fontSize: '14.5px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>Register Now</span>
                      <Sparkles size={16} />
                    </button>
                  </div>

                  {/* Cover Image */}
                  <div style={{ width: '100%', height: '420px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#0F172A', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      onError={(e) => { e.currentTarget.src = '/assets/images/events/bhagavadgita-meaningful-life-series-5.jpg'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* About the Program */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '16px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                    About the Program
                  </h3>
                  <div style={{ fontSize: '16px', color: '#334155', lineHeight: '1.8' }}>
                    {event.aboutProgram || event.description}
                  </div>
                </div>

                {/* What You Will Learn */}
                {Array.isArray(event.whatYouWillLearn) && event.whatYouWillLearn.length > 0 && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '18px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                      What You Will Learn
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                      {event.whatYouWillLearn.map((point, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '14px 16px',
                            backgroundColor: '#FAF8F5',
                            borderRadius: '12px',
                            border: '1px solid #ECE7DE'
                          }}
                        >
                          <CheckCircle2 size={18} style={{ color: '#CA8A38', flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '14.5px', color: '#1E293B', fontWeight: '600', lineHeight: '1.5' }}>
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Program Highlights */}
                {Array.isArray(event.highlights) && event.highlights.length > 0 && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '18px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                      Program Highlights
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {event.highlights.map((point, idx) => {
                        const parts = point.split(':');
                        const title = parts.length > 1 ? parts[0] : null;
                        const desc = parts.length > 1 ? parts.slice(1).join(':') : point;

                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '14px',
                              padding: '16px 20px',
                              backgroundColor: '#FCFAF7',
                              borderRadius: '12px',
                              border: '1px solid #EFEAE1'
                            }}
                          >
                            <Award size={20} style={{ color: '#CA8A38', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              {title ? (
                                <>
                                  <strong style={{ fontSize: '15.5px', color: '#0F231B', display: 'block', marginBottom: '2px' }}>
                                    {title}
                                  </strong>
                                  <span style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>{desc}</span>
                                </>
                              ) : (
                                <span style={{ fontSize: '15px', color: '#334155', fontWeight: '600' }}>{desc}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Event Information Table */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '18px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                    Event Information
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14.5px' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F231B', width: '35%', backgroundColor: '#FAF8F5' }}>Start Date</td>
                          <td style={{ padding: '12px 16px', color: '#334155' }}>{event.date === '2026-09-09' ? '9 September 2026' : formatDate(event.date)}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F231B', backgroundColor: '#FAF8F5' }}>Duration</td>
                          <td style={{ padding: '12px 16px', color: '#334155' }}>{event.duration || '12 Days'}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F231B', backgroundColor: '#FAF8F5' }}>Time</td>
                          <td style={{ padding: '12px 16px', color: '#334155' }}>{event.timeDisplay || `${event.startTime} – ${event.endTime}`}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F231B', backgroundColor: '#FAF8F5' }}>Language</td>
                          <td style={{ padding: '12px 16px', color: '#334155' }}>{event.language || 'Kannada'}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F231B', backgroundColor: '#FAF8F5' }}>Mode</td>
                          <td style={{ padding: '12px 16px', color: '#334155' }}>{event.mode || 'Online'}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F231B', backgroundColor: '#FAF8F5' }}>Series</td>
                          <td style={{ padding: '12px 16px', color: '#334155' }}>{event.series || event.subtitle || '5th Transformational Learning Series'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Who Should Attend? */}
                {Array.isArray(event.whoIsItFor) && event.whoIsItFor.length > 0 && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '16px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                      Who Should Attend?
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {event.whoIsItFor.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#FAF5EC',
                            border: '1px solid #E8C77D',
                            color: '#0F231B',
                            padding: '9px 18px',
                            borderRadius: '20px',
                            fontSize: '14.5px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <Tag size={15} style={{ color: '#CA8A38' }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected Outcomes */}
                {Array.isArray(event.expectedOutcomes) && event.expectedOutcomes.length > 0 && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '18px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                      Expected Outcomes
                    </h3>
                    <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '16px' }}>
                      After completing the program, participants will:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                      {event.expectedOutcomes.map((point, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            fontSize: '14.5px',
                            fontWeight: '600',
                            color: '#1E293B'
                          }}
                        >
                          <Sparkles size={16} style={{ color: '#CA8A38', flexShrink: 0 }} />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inspirational Quote Section */}
                {event.quote && (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1B2A38 0%, #0F172A 100%)',
                      borderRadius: '20px',
                      padding: '36px 40px',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 30px rgba(15, 23, 42, 0.15)',
                      marginBottom: '32px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Quote size={48} style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1, color: '#D4A359' }} />
                    <div style={{ fontSize: '18.5px', fontStyle: 'italic', lineHeight: '1.7', color: '#F1F5F9', marginBottom: '16px' }}>
                      “{event.quote}”
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#D4A359', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      — Dr. Naveen Ellangala
                    </div>
                  </div>
                )}

                {/* FAQ Section */}
                {Array.isArray(event.faqs) && event.faqs.length > 0 && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '18px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                      Frequently Asked Questions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {event.faqs.map((faq, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '18px 20px',
                            backgroundColor: '#FAF8F5',
                            borderRadius: '12px',
                            border: '1px solid #ECE7DE'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15.5px', fontWeight: '700', color: '#0F231B', marginBottom: '6px' }}>
                            <HelpCircle size={17} style={{ color: '#CA8A38', flexShrink: 0 }} />
                            <span>{faq.question}</span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.65', margin: 0, paddingLeft: '25px' }}>
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final CTA Section */}
                <div
                  style={{
                    backgroundColor: '#FAF5EC',
                    border: '1.5px solid #E8C77D',
                    borderRadius: '20px',
                    padding: '40px',
                    textAlign: 'center',
                    boxShadow: '0 6px 20px rgba(202, 138, 56, 0.08)'
                  }}
                >
                  <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#0F231B', marginBottom: '8px' }}>
                    Begin Your Transformational Journey
                  </h3>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#CA8A38', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '24px' }}>
                    Learn. Reflect. Apply. Transform.
                  </div>
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="thm-btn"
                    style={{
                      padding: '14px 36px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '700'
                    }}
                  >
                    <span>Register Now</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Information & Registration Sidebar */}
              <div className="col-xl-4 col-lg-5">
                <div style={{ position: 'sticky', top: '100px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '30px', border: '1.5px solid #ECE7DE', boxShadow: '0 6px 25px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F231B', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                      Event Key Details
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Calendar size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Start Date</div>
                          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>
                            {event.date === '2026-09-09' ? '9 Sept 2026' : formatDate(event.date)}
                          </div>
                        </div>
                      </div>

                      {event.duration && (
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Clock size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Duration</div>
                            <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>{event.duration}</div>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Clock size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Time</div>
                          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>
                            {event.timeDisplay || `${event.startTime} – ${event.endTime}`}
                          </div>
                        </div>
                      </div>

                      {event.language && (
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Globe size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Language</div>
                            <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>{event.language}</div>
                          </div>
                        </div>
                      )}

                      {event.perspective && (
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Sparkles size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Perspective</div>
                            <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>{event.perspective}</div>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MapPin size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Venue &amp; Mode</div>
                          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>
                            {event.venue || (event.mode === 'Online' ? 'Online Live Event' : `${event.venue}, ${event.city}`)}
                          </div>
                        </div>
                      </div>

                      {event.speaker && (
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <User size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Facilitator</div>
                            <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>{event.speaker}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Registration CTA Button */}
                    <div style={{ backgroundColor: '#FAF8F5', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #ECE7DE' }}>
                      <button
                        type="button"
                        onClick={handleRegisterClick}
                        className="thm-btn"
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          fontSize: '15px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>Register Now</span>
                        <Sparkles size={16} />
                      </button>

                      {event.registrationNote && (
                        <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '12px', margin: '12px 0 0' }}>
                          * {event.registrationNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Event Detail Page */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
