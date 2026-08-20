import React from 'react';
import { Link } from 'react-router-dom';
import { commonContent } from '../../contents/common.content';
import { useMobileNav } from '../../context/MobileNavContext';

export default function HeaderThree() {
  const { header } = commonContent;
  const { toggleMobileNav } = useMobileNav();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.pageYOffset + 20;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="main-header main-header-one style3 clearfix">
        <div className="main-header-one__top">
          <div className="container-fluid p-0">
            <div className="main-header-one__top-inner">
              <div className="main-header-one__top-left">
                <div className="main-header__contact-list">
                  <ul>
                    <li>
                      <p>
                        {' '}
                        <span className="icon-clock"></span> Office Time : {header.officeTime}
                      </p>
                    </li>
                    <li>
                      <p>
                        {' '}
                        <span className="icon-location"></span> Location : {header.location}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="main-header-one__top-right">
                <div className="main-header-one__top-right-text">
                  <p>
                    <span className="icon-email1"></span> Our Email :{' '}
                    <a href={`mailto:${header.email}`}>{header.email}</a>
                  </p>
                </div>

                <div className="main-header-one__social-links">
                  <div className="title-box">
                    <h4>{header.socialTitle} </h4>
                  </div>
                  <ul>
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

                <div className="main-header__top-right-btn">
                  <Link to="/contact" className="thm-btn">
                    {header.requestBookText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-header-one__bottom">
          <nav className="main-menu clearfix">
            <div className="main-menu__wrapper clearfix">
              <div className="container">
                <div className="main-header-one__bottom-inner">
                  <div className="main-header-one__bottom-left">
                    <div className="logo-one">
                      <Link to="/">
                        <img src="/assets/images/resources/logo-2.png" alt="Ellangala's Academy Logo" style={{ maxHeight: '85px', width: 'auto' }} />
                      </Link>
                    </div>

                    <div className="main-menu__main-menu-box">
                      <ul className="main-menu__list">
                        <li>
                          <Link to="/">{header.nav.home}</Link>
                        </li>
                        <li className="dropdown programs-megamenu-item">
                          <a href="#" onClick={(e) => e.preventDefault()}>{header.nav.services}</a>
                          <div className="programs-megamenu">
                            <div className="programs-megamenu__inner">
                              {/* Column 1: POSITIVE WORKSHOPS */}
                              <div className="programs-megamenu__col">
                                <div className="programs-megamenu__col-header">
                                  <Link to="/positive-workshops" className="programs-megamenu__col-title">
                                    <span className="programs-megamenu__icon-badge">
                                      <i className="fa fa-spa"></i>
                                    </span>
                                    POSITIVE WORKSHOPS
                                  </Link>
                                  <div className="programs-megamenu__line"></div>
                                </div>
                                <ul className="programs-megamenu__list">
                                  <li>
                                    <Link to="/programs/positive-psychology-meaningful-life">
                                      <i className="fa fa-angle-right"></i> Positive Psychology for a Meaningful Life
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/programs/spiritual-psychology-purposeful-life">
                                      <i className="fa fa-angle-right"></i> Spiritual Psychology for Daily Life
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/programs/positive-parenting">
                                      <i className="fa fa-angle-right"></i> Positive Parenting
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/programs/positive-teaching">
                                      <i className="fa fa-angle-right"></i> Positive Teaching
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/programs/student-success-mindset">
                                      <i className="fa fa-angle-right"></i> Student Success Mindset
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/programs/the-art-of-mind-training">
                                      <i className="fa fa-angle-right"></i> The Art of Mind Training
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/programs/positive-psychology-at-the-workplace">
                                      <i className="fa fa-angle-right"></i> Positive Psychology at the Workplace
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/programs/bhagavadgita-for-daily-life">
                                      <i className="fa fa-angle-right"></i> Bhagavad Gita for a Meaningful Life
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/programs/mind-and-emotional-wellness">
                                      <i className="fa fa-angle-right"></i> Mind &amp; Emotional Wellness
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 2: POSITIVE MENTORING */}
                              <div className="programs-megamenu__col">
                                <div className="programs-megamenu__col-header">
                                  <Link to="/positive-mentoring" className="programs-megamenu__col-title">
                                    <span className="programs-megamenu__icon-badge">
                                      <i className="fa fa-hands-helping"></i>
                                    </span>
                                    POSITIVE MENTORING
                                  </Link>
                                  <div className="programs-megamenu__line"></div>
                                </div>
                                <ul className="programs-megamenu__list">
                                  <li>
                                    <Link to="/mentoring/student-mentoring">
                                      <i className="fa fa-angle-right"></i> Student Mentoring
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mentoring/parent-mentoring">
                                      <i className="fa fa-angle-right"></i> Parent Mentoring
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mentoring/teacher-mentoring">
                                      <i className="fa fa-angle-right"></i> Teacher Mentoring
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mentoring/personal-mentoring">
                                      <i className="fa fa-angle-right"></i> Personal Mentoring
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mentoring/life-mentoring">
                                      <i className="fa fa-angle-right"></i> Life Mentoring
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mentoring/career-mentoring">
                                      <i className="fa fa-angle-right"></i> Career Mentoring
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mentoring/purpose-mentoring">
                                      <i className="fa fa-angle-right"></i> Purpose Mentoring
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mentoring/mindset-mentoring">
                                      <i className="fa fa-angle-right"></i> Mindset Mentoring
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mentoring/spiritual-mentoring">
                                      <i className="fa fa-angle-right"></i> Spiritual Mentoring
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Column 3: MindGym */}
                              <div className="programs-megamenu__col programs-megamenu__col--featured">
                                <div className="programs-megamenu__col-header">
                                  <Link to="/mindgym" className="programs-megamenu__col-title">
                                  <span className="programs-megamenu__icon-badge">
                                    <i className="fa fa-brain"></i>
                                  </span>
                                  POSITIVE MINDGYM
                                </Link>
                                  <div className="programs-megamenu__line"></div>
                                </div>
                                <ul className="programs-megamenu__list programs-megamenu__list--featured">
                                  <li>
                                    <Link to="/mindgym/app" className="programs-megamenu__card-link">
                                      <div className="programs-megamenu__card-icon">
                                        <i className="fa fa-mobile-alt"></i>
                                      </div>
                                      <div className="programs-megamenu__card-info">
                                        <strong>POSITIVE MINDGYM APP</strong>
                                        <span>Everyday Digital Mind Training</span>
                                      </div>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mindgym/mind-gym" className="programs-megamenu__card-link">
                                      <div className="programs-megamenu__card-icon">
                                        <i className="fa fa-building"></i>
                                      </div>
                                      <div className="programs-megamenu__card-info">
                                        <strong>POSITIVE MINDGYM CENTRE</strong>
                                        <span>Physical Wellness &amp; Training Center</span>
                                      </div>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/mindgym/toolkit" className="programs-megamenu__card-link">
                                      <div className="programs-megamenu__card-icon">
                                        <i className="fa fa-toolbox"></i>
                                      </div>
                                      <div className="programs-megamenu__card-info">
                                        <strong>POSITIVE MIND TOOLKIT</strong>
                                        <span>Practical Psychological First-Aid</span>
                                      </div>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="dropdown">
                          <Link to="/about">{header.nav.about}</Link>
                          <ul>
                            <li>
                              <Link to="/founder">Founder</Link>
                            </li>
                            <li>
                              <Link to="/team">Team</Link>
                            </li>
                            <li>
                              <Link to="/about#vision-mission" onClick={() => scrollToSection('vision-mission')}>Vision &amp; Mission</Link>
                            </li>
                            <li>
                              <Link to="/about#philosophy" onClick={() => scrollToSection('philosophy')}>Our Philosophy</Link>
                            </li>
                            <li>
                              <Link to="/about#methodology" onClick={() => scrollToSection('methodology')}>Our Methodology</Link>
                            </li>
                          </ul>
                        </li>
                        {/* Page menu item (hidden for now, easy to enable in future)
                        <li className="dropdown">
                          <a href="#">{header.nav.page}</a>
                          <ul>
                            <li>
                              <Link to="/team">Team</Link>
                            </li>
                            <li>
                              <Link to="/faq">Faq</Link>
                            </li>
                            <li>
                              <Link to="/shop">Shop</Link>
                            </li>
                            <li>
                              <Link to="/shop-details">Shop Details</Link>
                            </li>
                            <li>
                              <Link to="/cart">Cart</Link>
                            </li>
                            <li>
                              <Link to="/checkout">Checkout</Link>
                            </li>
                            <li>
                              <Link to="/404">404</Link>
                            </li>
                          </ul>
                        </li>
                        */}
                        <li className="dropdown books-dropdown-item">
                          <Link to="/resources">{header.nav.shop}</Link>
                          <ul className="books-two-column-menu">
                            {header.booksList ? (
                              header.booksList.map((item, idx) => (
                                <li key={idx}>
                                  {item.path.startsWith('http') ? (
                                    <a
                                      href={item.path}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label={item.name}
                                      style={{ display: 'flex', alignItems: 'center', gap: '9px' }}
                                    >
                                      {item.icon && <i className={item.icon} style={{ fontSize: '15px', color: 'inherit' }}></i>}
                                      <span>{item.name}</span>
                                    </a>
                                  ) : (
                                    <Link
                                      to={item.path}
                                      aria-label={item.name}
                                      style={{ display: 'flex', alignItems: 'center', gap: '9px' }}
                                    >
                                      {item.icon && <i className={item.icon} style={{ fontSize: '15px', color: 'inherit' }}></i>}
                                      <span>{item.name}</span>
                                    </Link>
                                  )}
                                </li>
                              ))
                            ) : (
                              <li>
                                <Link to="/resources">All Resources</Link>
                              </li>
                            )}
                          </ul>
                        </li>
                        <li>
                          <Link to="/blog">{header.nav.blog}</Link>
                        </li>
                        <li>
                          <Link to="/contact">{header.nav.contact}</Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="main-header-one__bottom-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="main-header__bottom-contact-box d-none d-xl-flex">
                      <div className="icon-box">
                        <span className="icon-phone2"></span>
                      </div>
                      <div className="text-box">
                        <p>{header.freeCounselingText}</p>
                        <h5>
                          <a href={`tel:${header.phoneCall}`}>{header.phone}</a>
                        </h5>
                      </div>
                    </div>

                    <div className="main-header__search">
                      <a href="#" className="main-menu__search search-toggler icon-search"></a>
                    </div>

                    {/* Mobile Hamburger Toggle Button */}
                    <div className="mobile-nav-toggle-box d-flex d-lg-none">
                      <a
                        href="#"
                        className="mobile-nav__toggler"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMobileNav();
                        }}
                        aria-label="Toggle mobile menu"
                      >
                        <i className="fa fa-bars"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="stricky-header stricky-header__one stricked-menu main-menu">
        <div className="sticky-header__content"></div>
      </div>
    </>
  );
}
