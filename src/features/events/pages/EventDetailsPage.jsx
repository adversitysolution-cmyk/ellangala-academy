import React from 'react';
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
import { useEnrollModal } from '../../../context/EnrollModalContext';
import { Calendar, Clock, MapPin, User, CheckCircle2, AlertCircle, ArrowLeft, Tag, CreditCard, ExternalLink, Video } from 'lucide-react';
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

  const event = eventService.getEventBySlug(slug);

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
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
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
                      {event.category}
                    </span>

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

                  <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0F231B', marginBottom: '16px', lineHeight: '1.3' }}>
                    {event.title}
                  </h1>

                  <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.65', marginBottom: '24px' }}>
                    {event.shortDescription}
                  </p>

                  {/* Cover Image */}
                  <div style={{ width: '100%', height: '380px', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#0F172A' }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      onError={(e) => { e.currentTarget.src = '/assets/images/blog/blog-positive-psychology.png'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* About This Event */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '16px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                    About This Event
                  </h3>
                  <div style={{ fontSize: '15.5px', color: '#334155', lineHeight: '1.75', whitespace: 'pre-line' }}>
                    {event.description}
                  </div>
                </div>

                {/* Who Is This For? */}
                {Array.isArray(event.whoIsItFor) && event.whoIsItFor.length > 0 && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '16px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                      Who Is This For?
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {event.whoIsItFor.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#FAF5EC',
                            border: '1px solid #E8C77D',
                            color: '#0F231B',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Tag size={14} style={{ color: '#CA8A38' }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What You Can Expect (Highlights) */}
                {Array.isArray(event.highlights) && event.highlights.length > 0 && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F231B', marginBottom: '16px', borderBottom: '2px solid #FAF5EC', paddingBottom: '12px' }}>
                      What You Can Expect
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                      {event.highlights.map((point, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '15px', color: '#334155' }}>
                          <CheckCircle2 size={18} style={{ color: '#CA8A38', flexShrink: 0, marginTop: '2px' }} />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Information & Registration Sidebar */}
              <div className="col-xl-4 col-lg-5">
                <div style={{ position: 'sticky', top: '100px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '30px', border: '1.5px solid #ECE7DE', boxShadow: '0 6px 25px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F231B', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                      Event Details
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Calendar size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Date</div>
                          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>{formatDate(event.date)}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Clock size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Time</div>
                          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>{event.startTime} – {event.endTime}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MapPin size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Venue &amp; Mode</div>
                          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#0F231B', marginTop: '2px' }}>
                            {event.mode === 'Online' ? 'Online Live Event' : `${event.venue}, ${event.city}`}
                          </div>
                          {event.address && <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{event.address}</div>}
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

                      {(event.googleMeetLink || event.meetingLink) && (
                        <div style={{ display: 'flex', gap: '14px', backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Video size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#0369A1', textTransform: 'uppercase' }}>Google Meet Live Session</div>
                            <a
                              href={event.googleMeetLink || event.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '13px', fontWeight: '700', color: '#0284C7', textDecoration: 'underline', marginTop: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <span>Join Google Meet Link</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Registration CTA */}
                    <div style={{ backgroundColor: '#FAF8F5', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #ECE7DE' }}>
                      <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginBottom: '4px' }}>Registration Fee</div>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F231B', marginBottom: '16px' }}>
                        {event.priceType === 'Free' ? 'Free' : (event.price ? `₹${event.price}` : 'Enquiry Only')}
                      </div>

                      {isCancelled ? (
                        <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', fontWeight: '800', fontSize: '14px' }}>
                          EVENT CANCELLED
                        </div>
                      ) : isCompleted ? (
                        <div style={{ padding: '12px', backgroundColor: '#E2E8F0', color: '#475569', borderRadius: '8px', fontWeight: '800', fontSize: '14px' }}>
                          EVENT COMPLETED
                        </div>
                      ) : event.registrationOpen ? (
                        <>
                          {(event.razorpayLink || event.paymentLink) ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <a
                                href={event.razorpayLink || event.paymentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="thm-btn"
                                style={{
                                  width: '100%',
                                  padding: '14px 20px',
                                  fontSize: '14.5px',
                                  borderRadius: '8px',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px'
                                }}
                              >
                                <CreditCard size={18} />
                                <span>REGISTER &amp; PAY NOW</span>
                                <ExternalLink size={14} />
                              </a>
                              <Link
                                to={`/events/${event.slug}/register`}
                                style={{
                                  width: '100%',
                                  padding: '10px 14px',
                                  backgroundColor: 'transparent',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  color: '#475569',
                                  textAlign: 'center',
                                  textDecoration: 'none',
                                  display: 'block'
                                }}
                              >
                                Or Register via Form
                              </Link>
                            </div>
                          ) : (
                            <Link
                              to={`/events/${event.slug}/register`}
                              className="thm-btn"
                              style={{ width: '100%', padding: '14px 20px', fontSize: '15px', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {event.priceType === 'Enquiry Only' ? 'ENQUIRE NOW' : 'REGISTER NOW'}
                            </Link>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled
                          style={{
                            width: '100%',
                            padding: '14px 20px',
                            backgroundColor: '#CBD5E1',
                            color: '#64748B',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '800',
                            fontSize: '14px',
                            cursor: 'not-allowed'
                          }}
                        >
                          REGISTRATION CLOSED
                        </button>
                      )}

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
