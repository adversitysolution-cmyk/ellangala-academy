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
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, Video } from 'lucide-react';
import SEO from '../../../seo/SEO';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '../../../seo/schemas/schemaGenerators';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function EventsPage() {
  useUterpyPlugins();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    setUpcomingEvents(eventService.getUpcomingEvents());
    setPastEvents(eventService.getPastEvents());
  }, []);

  const featuredEvent = upcomingEvents.find(e => e.featured) || upcomingEvents[0];
  const remainingUpcoming = featuredEvent
    ? upcomingEvents.filter(e => e.id !== featuredEvent.id)
    : upcomingEvents;

  const currentDisplayList = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Upcoming Events & Masterclasses | Ellangala’s Academy"
          description="Join live positive psychology workshops, MindGym open masterclasses, and online webinars by Dr. Naveen Ellangala."
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
                Explore upcoming workshops, MindGym sessions, talks and learning experiences from Ellangala’s Academy.
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

            {/* Featured Event Section (Only shown on Upcoming tab if a featured event exists) */}
            {activeTab === 'upcoming' && featuredEvent && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #ECE7DE',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  marginBottom: '50px'
                }}
              >
                <div className="row g-0 align-items-center">
                  <div className="col-lg-6">
                    <div style={{ height: '100%', minHeight: '340px', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={featuredEvent.image}
                        alt={featuredEvent.title}
                        onError={(e) => { e.currentTarget.src = '/assets/images/blog/blog-positive-psychology.png'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '340px' }}
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
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '800',
                          color: '#CA8A38',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          display: 'block',
                          marginBottom: '8px'
                        }}
                      >
                        {featuredEvent.category}
                      </span>
                      <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F231B', marginBottom: '14px', lineHeight: '1.3' }}>
                        <Link to={`/events/${featuredEvent.slug}`} style={{ color: '#0F231B', textDecoration: 'none' }}>
                          {featuredEvent.title}
                        </Link>
                      </h2>
                      <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.65', marginBottom: '22px' }}>
                        {featuredEvent.shortDescription}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', fontSize: '14px', color: '#334155' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Calendar size={16} style={{ color: '#CA8A38' }} />
                          <span><strong>{formatDate(featuredEvent.date)}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Clock size={16} style={{ color: '#CA8A38' }} />
                          <span>{featuredEvent.startTime} – {featuredEvent.endTime}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <MapPin size={16} style={{ color: '#CA8A38' }} />
                          <span>{featuredEvent.mode === 'Online' ? 'Online Live Event' : `${featuredEvent.venue}, ${featuredEvent.city}`}</span>
                        </div>
                      </div>

                      <Link
                        to={`/events/${featuredEvent.slug}`}
                        className="thm-btn"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 28px',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <span>VIEW EVENT</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {currentDisplayList.length === 0 && (
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

            {/* Event Cards Grid */}
            {currentDisplayList.length > 0 && (
              <div className="row gy-4">
                {(activeTab === 'upcoming' ? remainingUpcoming : pastEvents).map((event) => (
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
                            onError={(e) => { e.currentTarget.src = '/assets/images/blog/blog-positive-psychology.png'; }}
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

                          {event.status === 'cancelled' && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '14px',
                                right: '14px',
                                backgroundColor: '#EF4444',
                                color: '#FFFFFF',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '800'
                              }}
                            >
                              CANCELLED
                            </div>
                          )}

                          {event.status === 'completed' && (
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
                          )}
                        </div>

                        {/* Event Info */}
                        <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#CA8A38', fontWeight: '700', marginBottom: '10px' }}>
                            <Calendar size={15} />
                            <span>{formatDate(event.date)}</span>
                          </div>

                          <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0F231B', lineHeight: '1.35', marginBottom: '10px' }}>
                            <Link to={`/events/${event.slug}`} style={{ color: '#0F231B', textDecoration: 'none' }}>
                              {event.title}
                            </Link>
                          </h3>

                          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', marginBottom: '16px' }}>
                            {event.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                          <MapPin size={14} style={{ color: '#CA8A38' }} />
                          <span>{event.mode === 'Online' ? 'Online' : event.city}</span>
                        </div>

                        <Link
                          to={`/events/${event.slug}`}
                          style={{
                            fontSize: '13.5px',
                            fontWeight: '700',
                            color: '#CA8A38',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>VIEW DETAILS</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
