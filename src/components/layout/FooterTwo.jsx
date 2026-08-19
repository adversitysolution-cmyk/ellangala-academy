import React from 'react';
import { Link } from 'react-router-dom';
import { commonContent } from '../../contents/common.content';
import SubscribeOne from '../common/SubscribeOne';

export default function FooterTwo() {
  const { footer } = commonContent;

  return (
    <>
      <SubscribeOne />
      <footer className="site-footer site-footer--two">
      <div className="shape1">
        <img src="/assets/images/shapes/footer-v2-shape1.png" alt="#" />
      </div>
      <div className="shape2">
        <img src="/assets/images/shapes/footer-v2-shape2.png" alt="#" />
      </div>
      <div className="shape3">
        <img src="/assets/images/shapes/footer-v2-shape3.png" alt="#" />
      </div>
      <div
        className="site-footer--two__pattern"
        style={{ backgroundImage: 'url(/assets/images/pattern/footer-v2-pattern.png)' }}
      ></div>
      <div className="site-footer__top">
        <div className="container">
          <div className="row">
            {/* Start Footer Widget Column */}
            <div className="col-xl-4 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay="0.1s">
              <div className="footer-widget__column footer-widget__about">
                <div className="footer-widget__logo">
                  <Link to="/">
                    <img src="/assets/images/resources/footer-logo.png" alt="Ellangala's Academy Logo" style={{ maxHeight: '95px', width: 'auto' }} />
                  </Link>
                </div>
                <div className="footer-widget__about-text-box">
                  <p className="footer-widget__about-text">
                    {footer.aboutTextTwo}
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
            <div className="col-xl-2 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay="0.3s">
              <div className="footer-widget__column footer-widget__service-two clearfix">
                <div className="footer-widget__title-box">
                  <h3 className="footer-widget__title">Our Programs</h3>
                </div>
                <ul className="footer-widget__service-list list-unstyled clearfix">
                  <li>
                    <Link to="/mindgym/mind-gym">Mind Gym</Link>
                  </li>
                  <li>
                    <Link to="/mindgym/toolkit">Mind Toolkit</Link>
                  </li>
                  <li>
                    <Link to="/mindgym/app">MindGym App</Link>
                  </li>
                  <li>
                    <Link to="/programs/positive-psychology-meaningful-life">Positive Psychology</Link>
                  </li>
                  <li>
                    <Link to="/programs/indian-culture-and-science">Culture & Science</Link>
                  </li>
                  <li>
                    <Link to="/services">All Programs &rarr;</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* End Footer Widget Column */}

            {/* Start Footer Widget Column */}
            <div className="col-xl-3 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay="0.5s">
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
                    <Link to="/shop">Shop</Link>
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
            <div className="col-xl-3 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay="0.7s">
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
              </div>
            </div>
            {/* End Footer Widget Column */}
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container">
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
