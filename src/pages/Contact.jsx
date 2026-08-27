import React, { useState } from 'react';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { contactContent } from '../contents/contact.content';
import SEO from '../seo/SEO';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '../seo/schemas/schemaGenerators';

export default function Contact() {
  useUterpyPlugins();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Could not send your message.');
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Could not send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Contact Us | Ellangala’s Academy"
          description="Get in touch with Ellangala’s Academy in Bengaluru. Contact us for positive psychology workshops, mentoring, MindGym visits, or speaking sessions."
          canonical="/contact"
          structuredData={[
            generateOrganizationSchema(),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Contact Us', path: '/contact' }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title={contactContent.header.title} />

        {/* Start Contact Page */}
        <section className="contact-page">
          <div className="container">
            <div className="contact-page__top">
              <div className="title text-center">
                <h2>
                  Feel free to ask questions or share your <br /> message with us.
                </h2>
                <p>{contactContent.top.subtitle}</p>
              </div>

              <ul
                className="contact-page__top-list contact-page__top-grid"
                style={{
                  backgroundColor: '#fff8f8',
                  padding: 'clamp(24px, 4vw, 45px)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <li
                  className="contact-page__top-single"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 0,
                    margin: 0,
                    gap: '24px',
                    flex: '1 1 300px'
                  }}
                >
                  <div
                    className="icon"
                    style={{
                      position: 'relative',
                      top: 0,
                      left: 0,
                      width: '82px',
                      height: '82px',
                      minWidth: '82px',
                      backgroundColor: '#262222',
                      borderRadius: '50%',
                      border: '2px solid var(--uterpy-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '28px',
                      flexShrink: 0
                    }}
                  >
                    <a href={contactContent.top.cards[0].link || "https://maps.app.goo.gl/b8PFp8EMmNyrvR6k7"} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                      <span className="icon-location"></span>
                    </a>
                  </div>
                  <div className="content">
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#1b1b1b' }}>
                      <a href={contactContent.top.cards[0].link || "https://maps.app.goo.gl/b8PFp8EMmNyrvR6k7"} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                        {contactContent.top.cards[0].title}
                      </a>
                    </h2>
                    <p style={{ margin: 0, fontSize: '15px', lineHeight: '24px', color: '#444' }}>
                      <a href={contactContent.top.cards[0].link || "https://maps.app.goo.gl/b8PFp8EMmNyrvR6k7"} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {contactContent.top.cards[0].lines.map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < contactContent.top.cards[0].lines.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </a>
                    </p>
                  </div>
                </li>

                <li
                  className="contact-page__top-single"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 0,
                    margin: 0,
                    gap: '24px',
                    flex: '1 1 240px'
                  }}
                >
                  <div
                    className="icon"
                    style={{
                      position: 'relative',
                      top: 0,
                      left: 0,
                      width: '82px',
                      height: '82px',
                      minWidth: '82px',
                      backgroundColor: '#262222',
                      borderRadius: '50%',
                      border: '2px solid var(--uterpy-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '28px',
                      flexShrink: 0
                    }}
                  >
                    <span className="icon-phone"></span>
                  </div>
                  <div className="content">
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#1b1b1b' }}>
                      {contactContent.top.cards[1].title}
                    </h2>
                    <p style={{ margin: 0, fontSize: '15px', lineHeight: '24px', color: '#444', whiteSpace: 'nowrap' }}>
                      {contactContent.top.cards[1].phones.map((p, idx) => (
                        <a key={idx} href={p.link} style={{ whiteSpace: 'nowrap', display: 'inline-block', color: 'inherit' }}>
                          {p.text}
                        </a>
                      ))}
                    </p>
                  </div>
                </li>

                <li
                  className="contact-page__top-single"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 0,
                    margin: 0,
                    gap: '24px',
                    flex: '1 1 240px'
                  }}
                >
                  <div
                    className="icon"
                    style={{
                      position: 'relative',
                      top: 0,
                      left: 0,
                      width: '82px',
                      height: '82px',
                      minWidth: '82px',
                      backgroundColor: '#262222',
                      borderRadius: '50%',
                      border: '2px solid var(--uterpy-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '28px',
                      flexShrink: 0
                    }}
                  >
                    <span className="icon-email"></span>
                  </div>
                  <div className="content">
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#1b1b1b' }}>
                      {contactContent.top.cards[2].title}
                    </h2>
                    <p style={{ margin: 0, fontSize: '15px', lineHeight: '24px', color: '#444' }}>
                      {contactContent.top.cards[2].emails.map((e, idx) => (
                        <a key={idx} href={e.link} style={{ color: 'inherit' }}>{e.text}</a>
                      ))}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="contact-page__bottom">
              <div
                className="contact-page__bottom-pattern"
                style={{ backgroundImage: 'url(/assets/images/pattern/contact-pattern.jpg)' }}
              ></div>
              <div className="contact-page__bottom-inner">
                {submitted ? (
                  <div className="alert alert-success text-center">
                    {contactContent.form.successMessage}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-page__form contact-form-validated">
                    <div className="row">
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="contact-page__input-box">
                          <input type="text" placeholder={contactContent.form.namePlaceholder} name="name" required />
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="contact-page__input-box">
                          <input type="email" placeholder={contactContent.form.emailPlaceholder} name="email" required />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="contact-page__input-box">
                          <input type="text" placeholder={contactContent.form.phonePlaceholder} name="phone" />
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="contact-page__input-box">
                          <input type="text" placeholder={contactContent.form.subjectPlaceholder} name="subject" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="contact-page__input-box">
                          <textarea name="message" placeholder={contactContent.form.messagePlaceholder} required></textarea>
                        </div>
                        {submitError && (
                          <p style={{ color: '#DC2626', fontSize: '14px', margin: '0 0 12px' }}>{submitError}</p>
                        )}
                        <div className="contact-page__btn">
                          <button type="submit" disabled={isSubmitting}>
                            <span className="thm-btn">{isSubmitting ? 'Sending...' : contactContent.form.submitBtnText}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* End Contact Page */}

        <FooterOne hideSubscribe={true} />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
