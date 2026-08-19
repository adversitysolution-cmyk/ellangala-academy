import React from 'react';
import { Link } from 'react-router-dom';
import { commonContent } from '../../contents/common.content';
import SubscribeOne from '../common/SubscribeOne';

export default function FooterOne({ hideSubscribe = false }) {
  const { footer } = commonContent;

  return (
    <>
      {!hideSubscribe && <SubscribeOne />}
      <footer className="site-footer">
        <div
          className="site-footer-bg"
          style={{ backgroundImage: 'url(/assets/images/backgrounds/footer-v1-bg.jpg)' }}
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
              <div className="col-xl-2 col-lg-4 col-md-6 wow animated fadeInUp" data-wow-delay="0.5s">
                <div className="footer-widget__column footer-widget__service clearfix">
                  <div className="footer-widget__title-box">
                    <h3 className="footer-widget__title">{footer.essentialsTitle}</h3>
                  </div>
                  <ul className="footer-widget__service-list list-unstyled clearfix">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/services">Services</Link>
                    </li>
                    <li>
                      <Link to="/about">About</Link>
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
                  </ul>
                </div>
              </div>
              {/* End Footer Widget Column */}

              {/* Start Footer Widget Column */}
              <div className="col-xl-4 col-lg-12 col-md-12 wow animated fadeInUp" data-wow-delay="0.7s">
                <div className="footer-widget__column footer-widget__programs clearfix">
                  <div className="footer-widget__title-box" style={{ marginBottom: '24px' }}>
                    <h3 className="footer-widget__title">Our Programs</h3>
                  </div>

                  <ul
                    className="footer-widget__service-list list-unstyled clearfix"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      columnGap: '24px',
                      rowGap: '12px',
                      alignItems: 'start',
                      margin: 0,
                      padding: 0
                    }}
                  >
                    {/* Column 1 - Positive Workshops */}
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/programs/positive-psychology-meaningful-life" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Positive Psychology</Link>
                    </li>
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/mentoring/student-mentoring" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Student Mentoring</Link>
                    </li>

                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/programs/spiritual-psychology-purposeful-life" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Spiritual Psychology</Link>
                    </li>
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/mentoring/parent-mentoring" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Parent Mentoring</Link>
                    </li>

                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/programs/positive-parenting" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Positive Parenting</Link>
                    </li>
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/mentoring/teacher-mentoring" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Teacher Mentoring</Link>
                    </li>

                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/programs/positive-teaching" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Positive Teaching</Link>
                    </li>
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/mentoring/personal-mentoring" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Personal Mentoring</Link>
                    </li>

                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/programs/student-success-mindset" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Student Success</Link>
                    </li>
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/mindgym/mind-gym" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Mind Gym</Link>
                    </li>

                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/programs/the-art-of-mind-training" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Art of Mind Training</Link>
                    </li>
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/mindgym/app" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Positive MindGym App</Link>
                    </li>

                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/programs/bhagavadgita-for-daily-life" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Bhagavad Gita for Life</Link>
                    </li>
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/mindgym/toolkit" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Positive Mind Toolkit</Link>
                    </li>

                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/programs/mind-and-emotional-wellness" style={{ fontSize: '14.5px', lineHeight: '20px' }}>Mind &amp; Wellness</Link>
                    </li>
                    <li style={{ minHeight: '26px', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                      <Link to="/positive-workshops" style={{ fontSize: '14.5px', lineHeight: '20px', color: 'var(--uterpy-base, #CA8A38)', fontWeight: '700' }}>
                        All Programs &rarr;
                      </Link>
                    </li>
                  </ul>
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
