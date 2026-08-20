import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { commonContent } from '../../contents/common.content';
import { useMobileNav } from '../../context/MobileNavContext';

export default function MobileNav() {
  const { mobileNav, header } = commonContent;
  const { isOpen, closeMobileNav } = useMobileNav();

  // Accordion open/close states
  const [openPrograms, setOpenPrograms] = useState(false);
  const [openWorkshops, setOpenWorkshops] = useState(false);
  const [openMentoring, setOpenMentoring] = useState(false);
  const [openMindgym, setOpenMindgym] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [openResources, setOpenResources] = useState(false);

  const handleClose = () => {
    closeMobileNav();
  };

  const navContent = (
    <div className={`mobile-nav__wrapper ${isOpen ? 'expanded' : ''}`}>
      <div className="mobile-nav__overlay" onClick={handleClose}></div>
      <div className="mobile-nav__content">
        <div className="mobile-nav__header-bar">
          <div className="logo-box">
            <Link to="/" onClick={handleClose} aria-label="logo image">
              <img src="/assets/images/resources/logo-1.png" alt="Ellangala's Academy Logo" style={{ maxHeight: '50px', width: 'auto' }} />
            </Link>
          </div>
          <span className="mobile-nav__close" onClick={handleClose} aria-label="Close menu">
            <i className="fa fa-times"></i>
          </span>
        </div>

        {/* Top Mobile Action Button */}
        <div className="mobile-nav__cta-box">
          <Link to="/contact" onClick={handleClose} className="thm-btn mobile-nav__cta-btn">
            <span>{header.requestBookText || "Request Book"}</span>
            <i className="fa fa-arrow-right"></i>
          </Link>
        </div>

        <div className="mobile-nav__container">
          <ul className="mobile-nav__menu list-unstyled">
            {/* 1. Home */}
            <li className="mobile-nav__item">
              <Link to="/" onClick={handleClose} className="mobile-nav__link">
                <i className="fa fa-home mobile-nav__item-icon"></i>
                <span>{header.nav.home}</span>
              </Link>
            </li>

            {/* 2. Programs Mega Menu */}
            <li className={`mobile-nav__item mobile-nav__item--dropdown ${openPrograms ? 'open' : ''}`}>
              <div className="mobile-nav__link-row">
                <Link to="/positive-workshops" onClick={handleClose} className="mobile-nav__link">
                  <i className="fa fa-graduation-cap mobile-nav__item-icon"></i>
                  <span>{header.nav.services}</span>
                </Link>
                <button
                  type="button"
                  aria-label="Toggle Programs dropdown"
                  className="mobile-nav__sub-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenPrograms(!openPrograms);
                  }}
                >
                  <i className={`fa fa-chevron-${openPrograms ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {openPrograms && (
                <ul className="mobile-nav__sub-menu list-unstyled">
                  {/* Pillar 1: Positive Workshops */}
                  <li className={`mobile-nav__pillar-card ${openWorkshops ? 'open' : ''}`}>
                    <div className="mobile-nav__link-row mobile-nav__link-row--pillar">
                      <Link to="/positive-workshops" onClick={handleClose} className="mobile-nav__pillar-title">
                        <span className="mobile-nav__pillar-badge">
                          <i className="fa fa-spa"></i>
                        </span>
                        <span>POSITIVE WORKSHOPS</span>
                      </Link>
                      <button
                        type="button"
                        aria-label="Toggle Workshops"
                        className="mobile-nav__sub-toggle mobile-nav__sub-toggle--pillar"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenWorkshops(!openWorkshops);
                        }}
                      >
                        <i className={`fa fa-angle-${openWorkshops ? 'up' : 'down'}`}></i>
                      </button>
                    </div>

                    {openWorkshops && (
                      <ul className="mobile-nav__sub-sub-menu list-unstyled">
                        <li><Link to="/programs/positive-psychology-meaningful-life" onClick={handleClose}><i className="fa fa-angle-right"></i> Positive Psychology for a Meaningful Life</Link></li>
                        <li><Link to="/programs/spiritual-psychology-purposeful-life" onClick={handleClose}><i className="fa fa-angle-right"></i> Spiritual Psychology for Daily Life</Link></li>
                        <li><Link to="/programs/positive-parenting" onClick={handleClose}><i className="fa fa-angle-right"></i> Positive Parenting</Link></li>
                        <li><Link to="/programs/positive-teaching" onClick={handleClose}><i className="fa fa-angle-right"></i> Positive Teaching</Link></li>
                        <li><Link to="/programs/student-success-mindset" onClick={handleClose}><i className="fa fa-angle-right"></i> Student Success Mindset</Link></li>
                        <li><Link to="/programs/the-art-of-mind-training" onClick={handleClose}><i className="fa fa-angle-right"></i> The Art of Mind Training</Link></li>
                        <li><Link to="/programs/positive-psychology-at-the-workplace" onClick={handleClose}><i className="fa fa-angle-right"></i> Positive Psychology at the Workplace</Link></li>
                        <li><Link to="/programs/bhagavadgita-for-daily-life" onClick={handleClose}><i className="fa fa-angle-right"></i> Bhagavad Gita for a Meaningful Life</Link></li>
                        <li><Link to="/programs/mind-and-emotional-wellness" onClick={handleClose}><i className="fa fa-angle-right"></i> Mind &amp; Emotional Wellness</Link></li>
                      </ul>
                    )}
                  </li>

                  {/* Pillar 2: Positive Mentoring */}
                  <li className={`mobile-nav__pillar-card ${openMentoring ? 'open' : ''}`}>
                    <div className="mobile-nav__link-row mobile-nav__link-row--pillar">
                      <Link to="/positive-mentoring" onClick={handleClose} className="mobile-nav__pillar-title">
                        <span className="mobile-nav__pillar-badge">
                          <i className="fa fa-hands-helping"></i>
                        </span>
                        <span>POSITIVE MENTORING</span>
                      </Link>
                      <button
                        type="button"
                        aria-label="Toggle Mentoring"
                        className="mobile-nav__sub-toggle mobile-nav__sub-toggle--pillar"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenMentoring(!openMentoring);
                        }}
                      >
                        <i className={`fa fa-angle-${openMentoring ? 'up' : 'down'}`}></i>
                      </button>
                    </div>

                    {openMentoring && (
                      <ul className="mobile-nav__sub-sub-menu list-unstyled">
                        <li><Link to="/mentoring/student-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Student Mentoring</Link></li>
                        <li><Link to="/mentoring/parent-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Parent Mentoring</Link></li>
                        <li><Link to="/mentoring/teacher-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Teacher Mentoring</Link></li>
                        <li><Link to="/mentoring/personal-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Personal Mentoring</Link></li>
                        <li><Link to="/mentoring/life-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Life Mentoring</Link></li>
                        <li><Link to="/mentoring/career-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Career Mentoring</Link></li>
                        <li><Link to="/mentoring/purpose-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Purpose Mentoring</Link></li>
                        <li><Link to="/mentoring/mindset-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Mindset Mentoring</Link></li>
                        <li><Link to="/mentoring/spiritual-mentoring" onClick={handleClose}><i className="fa fa-angle-right"></i> Spiritual Mentoring</Link></li>
                      </ul>
                    )}
                  </li>

                  {/* Pillar 3: MindGym */}
                  <li className={`mobile-nav__pillar-card ${openMindgym ? 'open' : ''}`}>
                    <div className="mobile-nav__link-row mobile-nav__link-row--pillar">
                      <Link to="/mindgym" onClick={handleClose} className="mobile-nav__pillar-title">
                        <span className="mobile-nav__pillar-badge">
                          <i className="fa fa-brain"></i>
                        </span>
                        <span>POSITIVE MINDGYM</span>
                      </Link>
                      <button
                        type="button"
                        aria-label="Toggle MindGym"
                        className="mobile-nav__sub-toggle mobile-nav__sub-toggle--pillar"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenMindgym(!openMindgym);
                        }}
                      >
                        <i className={`fa fa-angle-${openMindgym ? 'up' : 'down'}`}></i>
                      </button>
                    </div>

                    {openMindgym && (
                      <ul className="mobile-nav__sub-sub-menu list-unstyled">
                        <li><Link to="/mindgym/app" onClick={handleClose}><i className="fa fa-angle-right"></i> Positive MindGym App</Link></li>
                        <li><Link to="/mindgym/mind-gym" onClick={handleClose}><i className="fa fa-angle-right"></i> Positive MindGym Centre</Link></li>
                        <li><Link to="/mindgym/toolkit" onClick={handleClose}><i className="fa fa-angle-right"></i> Positive Mind Toolkit</Link></li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>

            {/* 3. About */}
            <li className={`mobile-nav__item mobile-nav__item--dropdown ${openAbout ? 'open' : ''}`}>
              <div className="mobile-nav__link-row">
                <Link to="/about" onClick={handleClose} className="mobile-nav__link">
                  <i className="fa fa-user-tie mobile-nav__item-icon"></i>
                  <span>{header.nav.about}</span>
                </Link>
                <button
                  type="button"
                  aria-label="Toggle About dropdown"
                  className="mobile-nav__sub-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenAbout(!openAbout);
                  }}
                >
                  <i className={`fa fa-chevron-${openAbout ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {openAbout && (
                <ul className="mobile-nav__sub-menu list-unstyled">
                  <li>
                    <Link to="/founder" onClick={handleClose} className="mobile-nav__sub-link">
                      <i className="fa fa-user-circle mobile-nav__sub-icon"></i>
                      <span>Founder</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/team" onClick={handleClose} className="mobile-nav__sub-link">
                      <i className="fa fa-users mobile-nav__sub-icon"></i>
                      <span>Team</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about#vision-mission"
                      onClick={() => {
                        handleClose();
                        const el = document.getElementById('vision-mission');
                        if (el) {
                          const offset = el.getBoundingClientRect().top + window.pageYOffset + 20;
                          window.scrollTo({ top: offset, behavior: 'smooth' });
                        }
                      }}
                      className="mobile-nav__sub-link"
                    >
                      <i className="fa fa-bullseye mobile-nav__sub-icon"></i>
                      <span>Vision &amp; Mission</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about#philosophy"
                      onClick={() => {
                        handleClose();
                        const el = document.getElementById('philosophy');
                        if (el) {
                          const offset = el.getBoundingClientRect().top + window.pageYOffset + 20;
                          window.scrollTo({ top: offset, behavior: 'smooth' });
                        }
                      }}
                      className="mobile-nav__sub-link"
                    >
                      <i className="fa fa-lightbulb mobile-nav__sub-icon"></i>
                      <span>Our Philosophy</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about#methodology"
                      onClick={() => {
                        handleClose();
                        const el = document.getElementById('methodology');
                        if (el) {
                          const offset = el.getBoundingClientRect().top + window.pageYOffset + 20;
                          window.scrollTo({ top: offset, behavior: 'smooth' });
                        }
                      }}
                      className="mobile-nav__sub-link"
                    >
                      <i className="fa fa-sitemap mobile-nav__sub-icon"></i>
                      <span>Our Methodology</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* 4. Resources */}
            <li className={`mobile-nav__item mobile-nav__item--dropdown ${openResources ? 'open' : ''}`}>
              <div className="mobile-nav__link-row">
                <Link to="/resources" onClick={handleClose} className="mobile-nav__link">
                  <i className="fa fa-book-open mobile-nav__item-icon"></i>
                  <span>{header.nav.shop}</span>
                </Link>
                <button
                  type="button"
                  aria-label="Toggle Resources dropdown"
                  className="mobile-nav__sub-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenResources(!openResources);
                  }}
                >
                  <i className={`fa fa-chevron-${openResources ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {openResources && (
                <ul className="mobile-nav__sub-menu list-unstyled">
                  {header.booksList && header.booksList.map((item, idx) => (
                    <li key={idx}>
                      {item.path.startsWith('http') ? (
                        <a href={item.path} target="_blank" rel="noopener noreferrer" onClick={handleClose} className="mobile-nav__sub-link">
                          {item.icon && <i className={`${item.icon} mobile-nav__sub-icon`}></i>}
                          <span>{item.name}</span>
                        </a>
                      ) : (
                        <Link to={item.path} onClick={handleClose} className="mobile-nav__sub-link">
                          {item.icon && <i className={`${item.icon} mobile-nav__sub-icon`}></i>}
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* 5. Blog (hidden)
            <li className="mobile-nav__item">
              <Link to="/blog" onClick={handleClose} className="mobile-nav__link">
                <i className="fa fa-newspaper mobile-nav__item-icon"></i>
                <span>{header.nav.blog}</span>
              </Link>
            </li>
            */}

            {/* 6. Contact */}
            <li className="mobile-nav__item">
              <Link to="/contact" onClick={handleClose} className="mobile-nav__link">
                <i className="fa fa-envelope-open-text mobile-nav__item-icon"></i>
                <span>{header.nav.contact}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info matching desktop header top bar */}
        <div className="mobile-nav__contact-box">
          <h6 className="mobile-nav__section-title">GET IN TOUCH</h6>
          <ul className="mobile-nav__contact list-unstyled">
            <li>
              <div className="mobile-nav__contact-icon">
                <i className="fa fa-envelope"></i>
              </div>
              <div className="mobile-nav__contact-info">
                <small>Email Us</small>
                <a href={`mailto:${mobileNav.email}`}>{mobileNav.email}</a>
              </div>
            </li>
            <li>
              <div className="mobile-nav__contact-icon">
                <i className="fa fa-phone-alt"></i>
              </div>
              <div className="mobile-nav__contact-info">
                <small>Call Anytime</small>
                <a href={`tel:${mobileNav.phoneCall}`}>{mobileNav.phone}</a>
              </div>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="mobile-nav__social-box">
          <div className="mobile-nav__social">
            <a href={commonContent.social.facebook} target="_blank" rel="noopener noreferrer" className="fab fa-facebook-f" aria-label="Facebook"></a>
            <a href={commonContent.social.instagram} target="_blank" rel="noopener noreferrer" className="fab fa-instagram" aria-label="Instagram"></a>
            <a href={commonContent.social.linkedin} target="_blank" rel="noopener noreferrer" className="fab fa-linkedin-in" aria-label="LinkedIn"></a>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(navContent, document.body) : navContent;
}
