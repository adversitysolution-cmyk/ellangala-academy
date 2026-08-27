import React from 'react';
import { Link } from 'react-router-dom';
import { commonContent } from '../../contents/common.content';
import SubscribeOne from '../common/SubscribeOne';
import footerBgImg from '../../ChatGPT Image Aug 19, 2026, 06_31_05 PM.png';

export default function FooterOne({ hideSubscribe = false }) {
  const { footer } = commonContent;

  return (
    <>
      {!hideSubscribe && <SubscribeOne />}
      <footer className="site-footer">
        <div
          className="site-footer-bg"
          style={{
            backgroundImage: `url(${footerBgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="site-footer__top">
          <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1480px' }}>
            <div className="row gy-4">
              {/* Start Footer Widget Column */}
              <div className="col-xl-3 col-lg-4 col-md-6 wow animated fadeInUp" data-wow-delay="0.1s">
                <div className="footer-widget__column footer-widget__about">
                  <div className="footer-widget__logo">
                    <Link to="/">
                      <img src="/assets/images/resources/footer-logo.png" alt="Ellangala's Academy Logo" style={{ maxHeight: '95px', width: 'auto' }} />
                    </Link>
                  </div>
                  <div className="footer-widget__about-text-box">
                    <p className="footer-widget__about-text">
                      {footer.aboutText}
                    </p>
                  </div>

                  <ul className="footer-widget__about-social-link">
                    <li>
                      <a href={commonContent.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <span className="fab fa-facebook-f"></span>
                      </a>
                    </li>
                    <li>
                      <a href={commonContent.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <span className="fab fa-instagram"></span>
                      </a>
                    </li>
                    <li>
                      <a href={commonContent.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <span className="fab fa-linkedin-in"></span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* End Footer Widget Column */}

              {/* Start Footer Widget Column */}
              <div className="col-xl-3 col-lg-4 col-md-6 wow animated fadeInUp" data-wow-delay="0.3s">
                <div className="footer-widget__column footer-widget__contact clearfix">
                  <div className="footer-widget__title-box">
                    <h3 className="footer-widget__title">{footer.contactTitle}</h3>
                  </div>
                  <ul className="footer-widget__contact-list list-unstyled clearfix">
                    <li>
                      <div className="icon">
                        <span className="icon-location"></span>
                      </div>
                      <div className="text">
                        <p>
                          Dr. Naveen Ellangala <br />
                          410, C Block, Radiant Karel, <br />
                          Nayandahalli, Bengaluru, Karnataka – 560039.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="icon">
                        <span className="icon-email"></span>
                      </div>
                      <div className="text">
                        <p>
                          <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="icon">
                        <span className="icon-phone"></span>
                      </div>
                      <div className="text">
                        <p>
                          <a href={`tel:${footer.contactPhoneCall}`}>{footer.contactPhone}</a>
                        </p>
                      </div>
                    </li>
                  </ul>

                  <div className="footer-widget__contact-text">
                    <div className="text-box">
                      <p>
                        <a href="#">{footer.letsTalkText}</a>
                      </p>
                    </div>

                    <div className="icon-box">
                      <span className="icon-marketing"></span>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Footer Widget Column */}

              {/* Start Footer Widget Column */}
              <div className="col-xl-3 col-lg-3 col-md-6 wow animated fadeInUp" data-wow-delay="0.5s">
                <div className="footer-widget__column footer-widget__service clearfix">
                  <div className="footer-widget__title-box">
                    <h3 className="footer-widget__title">{footer.essentialsTitle}</h3>
                  </div>
                  <ul className="footer-widget__service-list list-unstyled clearfix">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link to="/founder">Founder Profile</Link>
                    </li>
                    <li>
                      <Link to="/resources">Resources</Link>
                    </li>
                    <li>
                      <Link to="/blog">Blog</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact</Link>
                    </li>
                    <li>
                      <Link to="/track-order">Track Order</Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* End Footer Widget Column */}

              {/* Start Footer Widget Column */}
              <div className="col-xl-3 col-lg-3 col-md-6 wow animated fadeInUp" data-wow-delay="0.7s">
                <div className="footer-widget__column footer-widget__programs clearfix">
                  <div className="footer-widget__title-box">
                    <h3 className="footer-widget__title">Our Programs</h3>
                  </div>

                  <ul className="footer-widget__service-list list-unstyled clearfix">
                    <li>
                      <Link to="/positive-workshops">Positive Workshops</Link>
                    </li>
                    <li>
                      <Link to="/positive-mentoring">Positive Mentoring</Link>
                    </li>
                    <li>
                      <Link to="/mindgym">MindGym</Link>
                    </li>
                  </ul>

                  {/* Download Positive MindGym App Section */}
                  <div style={{ marginTop: '28px' }}>
                    <div className="footer-widget__title-box" style={{ marginBottom: '14px' }}>
                      <h3 className="footer-widget__title" style={{ fontSize: '17px', marginBottom: 0 }}>
                        Download Positive MindGym App
                      </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '210px' }}>
                      {/* Apple App Store */}
                      <Link
                        to="/mindgym/app"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(202, 138, 56, 0.5)',
                          borderRadius: '8px',
                          padding: '7px 12px',
                          color: '#ffffff',
                          textDecoration: 'none',
                          transition: 'all 0.25s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--uterpy-base, #CA8A38)';
                          e.currentTarget.style.borderColor = 'var(--uterpy-base, #CA8A38)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(202, 138, 56, 0.5)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" style={{ flexShrink: 0 }}>
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                          <span style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.85 }}>Download on the</span>
                          <strong style={{ fontSize: '13px', fontWeight: '700' }}>App Store</strong>
                        </div>
                      </Link>

                      {/* Google Play Store */}
                      <Link
                        to="/mindgym/app"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(202, 138, 56, 0.5)',
                          borderRadius: '8px',
                          padding: '7px 12px',
                          color: '#ffffff',
                          textDecoration: 'none',
                          transition: 'all 0.25s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--uterpy-base, #CA8A38)';
                          e.currentTarget.style.borderColor = 'var(--uterpy-base, #CA8A38)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(202, 138, 56, 0.5)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                          <path fill="#4285F4" d="M3.18 23.76c.31.17.65.24 1 .22l12.57-12.57L13.18 7.84 3.18 23.76z" />
                          <path fill="#FBBC05" d="M20.88 12.83c.37-.65.37-1.71 0-2.36L18.5 8.7l-3.32 3.32 3.32 3.32 2.38-2.51z" />
                          <path fill="#34A853" d="M3 1.02A1.38 1.38 0 0 0 2.18 2.2v19.6a1.38 1.38 0 0 0 .82 1.18L16.12 9.85 3 1.02z" />
                          <path fill="#EA4335" d="M14.35 9.85L3.18.24C2.83.22 2.49.29 2.18.46l13 12.91 3.17-3.52z" />
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                          <span style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.85 }}>GET IT ON</span>
                          <strong style={{ fontSize: '13px', fontWeight: '700' }}>Google Play</strong>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Footer Widget Column */}
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="container-fluid px-4 px-lg-5" style={{ maxWidth: '1480px' }}>
            <div className="row">
              <div className="col-xl-12">
                <div className="site-footer__bottom-inner">
                  <p className="site-footer__bottom-text">
                    {footer.copyright}{' '}
                    <a href={footer.brandUrl} target="_blank" rel="noopener noreferrer">
                      {footer.brandName}
                    </a>{' '}
                    {footer.copyrightSuffix}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
