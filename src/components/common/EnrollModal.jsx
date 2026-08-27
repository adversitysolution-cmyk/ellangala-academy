import React, { useState, useEffect } from 'react';
import { useEnrollModal } from '../../context/EnrollModalContext';
import { enrollmentService } from '../../admin/services/enrollmentService';

const PROGRAM_OPTIONS = [
  "Positive Psychology for a Meaningful Life",
  "Spiritual Psychology for Daily Life",
  "Positive Parenting",
  "Positive Teaching",
  "Student Success Mindset",
  "The Art of Mind Training",
  "Positive Psychology at the Workplace",
  "Bhagavad Gita for a Meaningful Life",
  "Mind & Emotional Wellness",
  "Student Mentoring",
  "Parent Mentoring",
  "Teacher Mentoring",
  "Personal Mentoring",
  "Life Mentoring",
  "Career Mentoring",
  "Purpose Mentoring",
  "Mindset Mentoring",
  "Spiritual Mentoring",
  "Positive MindGym App",
  "Positive MindGym Centre",
  "Positive Mind Toolkit",
  "Personal Counselling",
  "Couple Counselling",
  "Children Counselling",
  "Family Psychology",
  "Depression Treatment",
  "Group Therapy",
  "General Inquiry / Consultation"
];

export default function EnrollModal() {
  const { isOpen, selectedProgram, eventMeta, closeEnrollModal } = useEnrollModal();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [areaCity, setAreaCity] = useState('');
  const [program, setProgram] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Auto-fill program field whenever modal opens or selectedProgram changes
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      const strTitle = typeof selectedProgram === 'string' ? selectedProgram.trim() : '';
      if (strTitle) {
        const lower = strTitle.toLowerCase();
        const matched = PROGRAM_OPTIONS.find(
          (opt) => opt.toLowerCase() === lower ||
                   lower.includes(opt.toLowerCase()) ||
                   opt.toLowerCase().includes(lower)
        );
        setProgram(matched || strTitle);
      } else {
        setProgram(PROGRAM_OPTIONS[0]);
      }
    }
  }, [isOpen, selectedProgram]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await enrollmentService.addEnrollment({
        fullName,
        phone,
        email,
        city: areaCity,
        program,
        message,
        sourceType: eventMeta?.sourceType || 'Program',
        eventId: eventMeta?.eventId || null,
        eventTitle: eventMeta?.eventTitle || null
      });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setAreaCity('');
    setMessage('');
    setIsSubmitted(false);
    closeEnrollModal();
  };

  return (
    <div
      className="enroll-modal__backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEnrollModal();
      }}
    >
      <div
        className="enroll-modal__container"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'enrollModalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Sleek Close Button */}
        <button
          type="button"
          onClick={closeEnrollModal}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#F3F4F6',
            border: 'none',
            color: '#4B5563',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#CA8A38';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F3F4F6';
            e.currentTarget.style.color = '#4B5563';
          }}
        >
          <i className="fas fa-times"></i>
        </button>

        {isSubmitted ? (
          /* Confirmation Success State */
          <div style={{ padding: '64px 40px', textAlign: 'center' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                margin: '0 auto 20px',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)',
              }}
            >
              <i className="fas fa-check"></i>
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
              Enrollment Request Received!
            </h3>
            <p style={{ fontSize: '15px', color: '#4B5563', maxWidth: '480px', margin: '0 auto 26px', lineHeight: '1.6' }}>
              Thank you, <strong>{fullName}</strong>. We have received your inquiry for <strong>{program}</strong>. Our academy advisors will contact you shortly at <strong>{phone}</strong>.
            </p>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '13px 36px',
                backgroundColor: '#CA8A38',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14.5px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(202, 138, 56, 0.35)',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          /* 2-Column Light Redesigned Layout */
          <div className="enroll-modal__grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', minHeight: '520px' }}>
            {/* Left Column: Light Warm Cream Image Overlay */}
            <div
              className="enroll-modal__left"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(253, 248, 240, 0.92) 0%, rgba(247, 237, 222, 0.94) 100%), url("/assets/images/slider/sidebanner bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '40px 32px 36px',
                borderRight: '1px solid #EFE4D2',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                {/* Brand Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#D4A359',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(212, 163, 89, 0.35)',
                    }}
                  >
                    <i className="fas fa-graduation-cap" style={{ fontSize: '22px', color: '#ffffff' }}></i>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#CA8A38', letterSpacing: '1.4px', textTransform: 'uppercase', display: 'block' }}>
                      Ellangala's Academy
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#1F2937' }}>
                      Begin Your Journey
                    </span>
                  </div>
                </div>

                {/* Subtitle */}
                <h4 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '14px', lineHeight: '1.3' }}>
                  Empowering Minds, <br />
                  Transforming Lives
                </h4>
                <p style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: '1.65', marginBottom: '24px' }}>
                  Take a purposeful step toward mental clarity, emotional strength, and authentic personal growth.
                </p>
              </div>

              {/* 3 Light Trust Badges */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  paddingTop: '20px',
                  borderTop: '1px solid #EAE0D0',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '10px 4px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #EFE6D8',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <i className="fas fa-certificate" style={{ fontSize: '16px', color: '#CA8A38', marginBottom: '4px', display: 'block' }}></i>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#374151', display: 'block', lineHeight: '1.2' }}>
                    Expert Guidance
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '10px 4px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #EFE6D8',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <i className="fas fa-shield-alt" style={{ fontSize: '16px', color: '#CA8A38', marginBottom: '4px', display: 'block' }}></i>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#374151', display: 'block', lineHeight: '1.2' }}>
                    Safe &amp; Private
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '10px 4px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #EFE6D8',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <i className="fas fa-headset" style={{ fontSize: '16px', color: '#CA8A38', marginBottom: '4px', display: 'block' }}></i>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#374151', display: 'block', lineHeight: '1.2' }}>
                    Dedicated Support
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Form Panel */}
            <div
              className="enroll-modal__right"
              style={{
                padding: '40px 40px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1F2937', marginBottom: '18px' }}>
                Enrollment Form
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFDF9',
                      fontSize: '13.5px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#CA8A38')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>

                {/* Phone Number & Email (Side by Side on desktop) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Phone Number <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#FFFDF9',
                        fontSize: '13.5px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#CA8A38')}
                      onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Email Address <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#FFFDF9',
                        fontSize: '13.5px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#CA8A38')}
                      onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                    />
                  </div>
                </div>

                {/* Area / City */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Area / City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your area or city"
                    value={areaCity}
                    onChange={(e) => setAreaCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFDF9',
                      fontSize: '13.5px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#CA8A38')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>

                {/* Program Selection (Auto-filled!) */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Interested Program / Service <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    required
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CA8A38',
                      backgroundColor: '#FFFDF9',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      color: '#1F2937',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {!PROGRAM_OPTIONS.includes(program) && program && (
                      <option value={program}>{program}</option>
                    )}
                    {PROGRAM_OPTIONS.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Message / Notes <span style={{ color: '#9CA3AF', fontWeight: '400' }}>(Optional)</span>
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Any specific questions or preferred time..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFDF9',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#CA8A38')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>

                {submitError && (
                  <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{submitError}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '8px',
                    padding: '13px',
                    backgroundColor: '#CA8A38',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14.5px',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 14px rgba(202, 138, 56, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#b0752d';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(202, 138, 56, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#CA8A38';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(202, 138, 56, 0.35)';
                    }
                  }}
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Enrollment Request'}</span>
                  <i className="fas fa-paper-plane" style={{ fontSize: '12px' }}></i>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .enroll-modal__grid {
            grid-template-columns: 1fr !important;
            max-height: 85vh;
            overflow-y: auto;
          }
          .enroll-modal__left {
            padding: 28px 20px !important;
            border-right: none !important;
          }
          .enroll-modal__right {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
