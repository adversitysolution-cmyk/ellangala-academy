import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, Video, Globe, Brain } from 'lucide-react';
import SEO from '../../../seo/SEO';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '../../../seo/schemas/schemaGenerators';

function formatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr === '2026-09-09') return '9 Sept 2026';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function EventsPage() {
  useUterpyPlugins();
  const { openEnrollModal } = useEnrollModal();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const localUpcoming = initialEvents.filter(
      (e) => (e.date >= today || !e.date) && e.status !== 'completed'
    );
    const localPast = initialEvents.filter(
      (e) => (e.date < today && Boolean(e.date)) || e.status === 'completed'
    );

    eventService
      .getUpcomingEvents()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) setUpcomingEvents(res);
        else setUpcomingEvents(localUpcoming);
      })
      .catch(() => setUpcomingEvents(localUpcoming));

    eventService
      .getPastEvents()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) setPastEvents(res);
        else setPastEvents(localPast);
      })
      .catch(() => setPastEvents(localPast));
  }, []);

  const featuredEvent = upcomingEvents.find((e) => e.featured) || upcomingEvents[0];
  const remainingUpcoming = featuredEvent
    ? upcomingEvents.filter((e) => e.id !== featuredEvent.id)
    : upcomingEvents;

  const handleRegisterClick = (eventTitle, eventId) => {
    openEnrollModal(eventTitle, {
      sourceType: 'Event',
      eventId: eventId,
      eventTitle: eventTitle
    });
  };

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Upcoming Events & Masterclasses | Ellangala’s Academy"
          description="Join live positive psychology workshops, MindGym open masterclasses, and transformational learning series by Dr. Naveen Ellangala."
          canonical="/events"
          structuredData={[
            generateOrganizationSchema(),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Events', path: '/events' }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title="Events & Experiences" breadcrumb="Events" />

        {/* Start Public Events Page */}
        <section style={{ paddingTop: '60px', paddingBottom: '90px', backgroundColor: '#FAF8F5' }}>
          <div className="container">
            {/* Hero Banner Intro */}
            <div className="text-center" style={{ maxWidth: '720px', margin: '0 auto 40px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 18px',
                  backgroundColor: '#FAF5EC',
                  borderRadius: '30px',
                  color: '#CA8A38',
                  fontWeight: '700',
                  fontSize: '12.5px',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  marginBottom: '14px'
                }}
              >
                <Sparkles size={15} />
                <span>EVENTS &amp; EXPERIENCES</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0F231B', marginBottom: '14px', lineHeight: '1.25' }}>
                Learn. Connect. Grow Together.
              </h1>
              <p style={{ fontSize: '15.5px', color: '#64748B', lineHeight: '1.65' }}>
                Explore upcoming workshops, MindGym sessions, talks and transformational learning series from Ellangala’s Academy.
              </p>
            </div>

            {/* Filter Tabs (Upcoming / Past) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '45px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                style={{
                  padding: '10px 28px',
                  borderRadius: '30px',
                  border: '1.5px solid',
                  borderColor: activeTab === 'upcoming' ? '#CA8A38' : '#CBD5E1',
                  backgroundColor: activeTab === 'upcoming' ? '#CA8A38' : '#FFFFFF',
                  color: activeTab === 'upcoming' ? '#FFFFFF' : '#334155',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: activeTab === 'upcoming' ? '0 4px 14px rgba(202, 138, 56, 0.3)' : 'none'
                }}
              >
                Upcoming Events ({upcomingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('past')}
                style={{
                  padding: '10px 28px',
                  borderRadius: '30px',
                  border: '1.5px solid',
                  borderColor: activeTab === 'past' ? '#CA8A38' : '#CBD5E1',
                  backgroundColor: activeTab === 'past' ? '#CA8A38' : '#FFFFFF',
                  color: activeTab === 'past' ? '#FFFFFF' : '#334155',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: activeTab === 'past' ? '0 4px 14px rgba(202, 138, 56, 0.3)' : 'none'
                }}
              >
                Past Events ({pastEvents.length})
              </button>
            </div>

            {/* Featured Main Event Card (Displayed prominently at the top) */}
            {activeTab === 'upcoming' && featuredEvent && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #ECE7DE',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  marginBottom: remainingUpcoming.length > 0 ? '50px' : '0'
                }}
              >
                <div className="row g-0 align-items-center">
                  <div className="col-lg-6">
                    <div style={{ height: '100%', minHeight: '380px', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={featuredEvent.image}
                        alt={featuredEvent.title}
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/events/bhagavadgita-meaningful-life-series-5.jpg';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '380px' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '20px',
                          left: '20px',
                          backgroundColor: '#CA8A38',
                          color: '#FFFFFF',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '800',
                          letterSpacing: '0.8px',
                          textTransform: 'uppercase'
                        }}
                      >
                        FEATURED EVENT
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div style={{ padding: '36px 40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '800',
                            color: '#CA8A38',
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                            backgroundColor: '#FAF5EC',
                            padding: '3px 10px',
                            borderRadius: '4px'
                          }}
                        >
                          {featuredEvent.subtitle || featuredEvent.series || featuredEvent.category}
                        </span>
                        {featuredEvent.language && (
                          <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 10px', borderRadius: '4px' }}>
                            {featuredEvent.language}
                          </span>
                        )}
                      </div>

                      <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F231B', marginBottom: '12px', lineHeight: '1.3' }}>
                        <Link to={`/events/${featuredEvent.slug}`} style={{ color: '#0F231B', textDecoration: 'none' }}>
                          {featuredEvent.title}
                        </Link>
                      </h2>
                      <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.65', marginBottom: '20px' }}>
                        {featuredEvent.shortDescription}
                      </p>

                      {/* Key Details Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                          gap: '10px',
                          marginBottom: '26px',
                          backgroundColor: '#FAF8F5',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid #ECE7DE'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                          <Calendar size={15} style={{ color: '#CA8A38', flexShrink: 0 }} />
                          <span><strong>Start Date:</strong> {formatDate(featuredEvent.date)}</span>
                        </div>
                        {featuredEvent.duration && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                            <Clock size={15} style={{ color: '#CA8A38', flexShrink: 0 }} />
                            <span><strong>Duration:</strong> {featuredEvent.duration}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                          <Clock size={15} style={{ color: '#CA8A38', flexShrink: 0 }} />
                          <span><strong>Time:</strong> {featuredEvent.timeDisplay || `${featuredEvent.startTime} – ${featuredEvent.endTime}`}</span>
                        </div>
                        {featuredEvent.perspective && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                            <Brain size={15} style={{ color: '#CA8A38', flexShrink: 0 }} />
                            <span><strong>Perspective:</strong> {featuredEvent.perspective}</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <Link
                          to={`/events/${featuredEvent.slug}`}
                          className="thm-btn"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        >
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRegisterClick(featuredEvent.title, featuredEvent.id)}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            backgroundColor: '#1B2A38',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#CA8A38'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1B2A38'; }}
                        >
                          <span>Register Now</span>
                          <Sparkles size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Upcoming Events (Small Cards towards bottom as Admin adds new events) */}
            {activeTab === 'upcoming' && remainingUpcoming.length > 0 && (
              <div style={{ marginTop: '50px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0F231B' }}>
                    More Upcoming Events
                  </h3>
                </div>
                <div className="row gy-4">
                  {remainingUpcoming.map((event) => (
                    <div key={event.id} className="col-xl-4 col-lg-6 col-md-6">
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: '1px solid #ECE7DE',
                          boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                      >
                        <div>
                          {/* Event Image */}
                          <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#0F172A' }}>
                            <img
                              src={event.image}
                              alt={event.title}
                              onError={(e) => {
                                e.currentTarget.src = '/assets/images/events/bhagavadgita-meaningful-life-series-5.jpg';
                              }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: '14px',
                                left: '14px',
                                backgroundColor: '#CA8A38',
                                color: '#FFFFFF',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.6px'
                              }}
                            >
                              {event.category}
                            </div>
                          </div>

                          {/* Event Info */}
                          <div style={{ padding: '24px' }}>
                            {event.subtitle && (
                              <div style={{ fontSize: '12px', fontWeight: '800', color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                                {event.subtitle}
                              </div>
                            )}

                            <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0F231B', lineHeight: '1.35', marginBottom: '10px' }}>
                              <Link to={`/events/${event.slug}`} style={{ color: '#0F231B', textDecoration: 'none' }}>
                                {event.title}
                              </Link>
                            </h3>

                            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', marginBottom: '16px' }}>
                              {event.shortDescription}
                            </p>

                            {/* Details Box */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#334155', backgroundColor: '#FAF8F5', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ECE7DE' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={14} style={{ color: '#CA8A38' }} />
                                <span><strong>Start:</strong> {formatDate(event.date)}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={14} style={{ color: '#CA8A38' }} />
                                <span>{event.timeDisplay || `${event.startTime} – ${event.endTime}`}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom CTA Bar */}
                        <div
                          style={{
                            padding: '16px 24px 20px',
                            borderTop: '1px solid #F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <Link
                            to={`/events/${event.slug}`}
                            style={{
                              flex: 1,
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1px solid #CA8A38',
                              color: '#CA8A38',
                              fontSize: '13px',
                              fontWeight: '700',
                              textDecoration: 'none',
                              textAlign: 'center',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#CA8A38';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#CA8A38';
                            }}
                          >
                            <span>View Details</span>
                            <ArrowRight size={13} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleRegisterClick(event.title, event.id)}
                            style={{
                              flex: 1,
                              padding: '9px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#1B2A38',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              textAlign: 'center',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#D4A359';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#1B2A38';
                            }}
                          >
                            <span>Register Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Grid */}
            {activeTab === 'past' && pastEvents.length > 0 && (
              <div className="row gy-4">
                {pastEvents.map((event) => (
                  <div key={event.id} className="col-xl-4 col-lg-6 col-md-6">
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #ECE7DE',
                        boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                      }}
                    >
                      <div>
                        {/* Event Image */}
                        <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#0F172A' }}>
                          <img
                            src={event.image}
                            alt={event.title}
                            onError={(e) => {
                              e.currentTarget.src = '/assets/images/events/bhagavadgita-meaningful-life-series-5.jpg';
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '14px',
                              left: '14px',
                              backgroundColor: '#CA8A38',
                              color: '#FFFFFF',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.6px'
                            }}
                          >
                            {event.category}
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              top: '14px',
                              right: '14px',
                              backgroundColor: '#64748B',
                              color: '#FFFFFF',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '800'
                            }}
                          >
                            COMPLETED
                          </div>
                        </div>

                        {/* Event Info */}
                        <div style={{ padding: '24px' }}>
                          <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0F231B', lineHeight: '1.35', marginBottom: '10px' }}>
                            <Link to={`/events/${event.slug}`} style={{ color: '#0F231B', textDecoration: 'none' }}>
                              {event.title}
                            </Link>
                          </h3>

                          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', marginBottom: '16px' }}>
                            {event.shortDescription}
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#334155', backgroundColor: '#FAF8F5', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ECE7DE' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={14} style={{ color: '#CA8A38' }} />
                              <span><strong>Start:</strong> {formatDate(event.date)}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} style={{ color: '#CA8A38' }} />
                              <span>{event.timeDisplay || `${event.startTime} – ${event.endTime}`}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '16px 24px 20px',
                          borderTop: '1px solid #F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <Link
                          to={`/events/${event.slug}`}
                          style={{
                            flex: 1,
                            padding: '9px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CA8A38',
                            color: '#CA8A38',
                            fontSize: '13px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            textAlign: 'center',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>View Details</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State when no events exist in the active tab */}
            {((activeTab === 'upcoming' && !featuredEvent && upcomingEvents.length === 0) ||
              (activeTab === 'past' && pastEvents.length === 0)) && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '60px 30px',
                  textAlign: 'center',
                  border: '1px solid #ECE7DE',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF5EC',
                    color: '#CA8A38',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  <Calendar size={32} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '10px' }}>
                  New experiences are coming soon.
                </h3>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                  There are no {activeTab} events published at the moment. Check back for future workshops, MindGym sessions and Academy experiences.
                </p>
              </div>
            )}
          </div>
        </section>
        {/* End Public Events Page */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
