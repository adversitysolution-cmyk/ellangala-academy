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
import { enrollmentService } from '../../../admin/services/enrollmentService';
import { Calendar, Clock, MapPin, User, CheckCircle2, ArrowLeft, Users, Send } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function EventRegisterPage() {
  useUterpyPlugins();
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [message, setMessage] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setLoading(true);
    eventService.getEventBySlug(slug).then((evt) => {
      setEvent(evt);
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

  if (!event) {
    return (
      <>
        <CustomCursor />
        <Preloader />
        <div className="page-wrapper">
          <HeaderOne />
          <PageHeader title="Event Not Found" breadcrumb="Event Registration" />
          <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h2>Event Not Found</h2>
            <p style={{ color: '#64748B', margin: '16px 0 24px' }}>The event you are trying to register for could not be found.</p>
            <Link to="/events" className="thm-btn">Back to All Events</Link>
          </div>
          <FooterOne />
        </div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await enrollmentService.addEnrollment({
        fullName,
        phone,
        email,
        city,
        program: event.title,
        sourceType: 'Event',
        eventId: event.id,
        eventTitle: event.title,
        attendeesCount: Number(attendeesCount),
        message: `[Attendees: ${attendeesCount}] ${message}`,
        status: 'Confirmed'
      });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={`Register: ${event.title}`} breadcrumb={`Events / ${event.title} / Register`} />

        {/* Start Dedicated Event Registration Section */}
        <section style={{ paddingTop: '60px', paddingBottom: '90px', backgroundColor: '#FAF8F5' }}>
          <div className="container" style={{ maxWidth: '1080px' }}>
            {/* Back to Event Details Link */}
            <div style={{ marginBottom: '24px' }}>
              <Link
                to={`/events/${event.slug}`}
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
                <span>Back to Event Details</span>
              </Link>
            </div>

            {isSubmitted ? (
              /* Registration Success Confirmation Card */
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '50px 36px',
                  border: '1.5px solid #D1FAE5',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  textAlign: 'center',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: '#D1FAE5',
                    color: '#047857',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  <CheckCircle2 size={40} />
                </div>

                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F231B', marginBottom: '12px' }}>
                  Registration Confirmed!
                </h2>

                <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.65', marginBottom: '28px' }}>
                  Thank you <strong>{fullName}</strong>. Your registration for <strong>{event.title}</strong> has been successfully recorded. Our team will get in touch with event access details.
                </p>

                {/* Summary Box */}
                <div
                  style={{
                    backgroundColor: '#FAF8F5',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'left',
                    border: '1px solid #ECE7DE',
                    marginBottom: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={18} style={{ color: '#CA8A38' }} />
                    <span>Date: <strong>{formatDate(event.date)}</strong></span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={18} style={{ color: '#CA8A38' }} />
                    <span>Time: <strong>{event.startTime} – {event.endTime}</strong></span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={18} style={{ color: '#CA8A38' }} />
                    <span>Location: <strong>{event.mode === 'Online' ? 'Online Live Stream' : `${event.venue}, ${event.city}`}</strong></span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={18} style={{ color: '#CA8A38' }} />
                    <span>Registered Attendees: <strong>{attendeesCount} Person(s)</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to={`/events/${event.slug}`} className="thm-btn" style={{ padding: '12px 28px', fontSize: '14px' }}>
                    VIEW EVENT PAGE
                  </Link>
                  <Link to="/events" style={{ padding: '12px 28px', borderRadius: '8px', border: '1px solid #CBD5E1', color: '#334155', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                    EXPLORE OTHER EVENTS
                  </Link>
                </div>
              </div>
            ) : (
              /* Registration Form Grid */
              <div className="row gy-4">
                {/* Left Column: Event Summary Card */}
                <div className="col-lg-5">
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%' }}>
                    <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#0F172A' }}>
                      <img
                        src={event.image}
                        alt={event.title}
                        onError={(e) => { e.currentTarget.src = '/assets/images/blog/blog-positive-psychology.png'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      {event.category}
                    </span>

                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F231B', margin: '6px 0 14px', lineHeight: '1.3' }}>
                      {event.title}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={16} style={{ color: '#CA8A38' }} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={16} style={{ color: '#CA8A38' }} />
                        <span>{event.startTime} – {event.endTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapPin size={16} style={{ color: '#CA8A38' }} />
                        <span>{event.mode === 'Online' ? 'Online Live Session' : `${event.venue}, ${event.city}`}</span>
                      </div>
                      {event.speaker && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <User size={16} style={{ color: '#CA8A38' }} />
                          <span>Facilitator: <strong>{event.speaker}</strong></span>
                        </div>
                      )}
                    </div>

                    <div style={{ backgroundColor: '#FAF5EC', borderRadius: '10px', padding: '14px', border: '1px solid #E8C77D', fontSize: '13px', color: '#0F231B', fontWeight: '600' }}>
                      Registration Fee: <strong>{event.priceType === 'Free' ? 'Free' : (event.price ? `₹${event.price}` : 'Enquiry Only')}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Column: Registration Form */}
                <div className="col-lg-7">
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 6px 25px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F231B', marginBottom: '8px' }}>
                      Attendee Registration Form
                    </h2>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>
                      Please fill in your contact details below to reserve your seat.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Full Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14.5px', outline: 'none' }}
                        />
                      </div>

                      {/* Phone & Email */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14.5px', outline: 'none' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14.5px', outline: 'none' }}
                          />
                        </div>
                      </div>

                      {/* City & Attendees */}
                      <div className="row g-3">
                        <div className="col-md-7">
                          <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                            City / Location *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Bengaluru"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14.5px', outline: 'none' }}
                          />
                        </div>
                        <div className="col-md-5">
                          <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                            Number of Seats
                          </label>
                          <select
                            value={attendeesCount}
                            onChange={(e) => setAttendeesCount(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14.5px', backgroundColor: '#FFFFFF' }}
                          >
                            <option value={1}>1 Person</option>
                            <option value={2}>2 Persons</option>
                            <option value={3}>3 Persons</option>
                            <option value={4}>4 Persons</option>
                            <option value={5}>5 Persons</option>
                          </select>
                        </div>
                      </div>

                      {/* Message / Questions */}
                      <div>
                        <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                          Special Notes or Questions (Optional)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Any specific questions for the facilitator..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                        />
                      </div>

                      {submitError && (
                        <p style={{ color: '#DC2626', fontSize: '14px', margin: 0 }}>{submitError}</p>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="thm-btn"
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          fontSize: '15px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: '10px'
                        }}
                      >
                        <Send size={18} />
                        <span>{isSubmitting ? 'SUBMITTING...' : 'CONFIRM EVENT REGISTRATION'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* End Dedicated Event Registration Section */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
