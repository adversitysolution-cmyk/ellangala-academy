import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { aboutContent } from '../contents/about.content';
import AboutEllangalaAcademySection from '../components/about/AboutEllangalaAcademySection';

export default function About() {
  useUterpyPlugins();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
  }, [location]);

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={aboutContent.header.title} />

        {/* Start Intro One */}
        <section className="intro-one intro-one--about">
          <div
            className="intro-one__pattern"
            style={{ backgroundImage: 'url(/assets/images/pattern/intro-v1-pattern.jpg)' }}
          ></div>
          <div className="container">
            <ul className="row">
              {aboutContent.intro.map((item, idx) => (
                <li key={idx} className={`col-xl-3 col-lg-6 col-md-6 ${item.borderClass}`}>
                  <div className="intro-one__single">
                    <div className={`intro-one__single-icon ${item.iconStyle || ''}`}>
                      <span className={item.icon}></span>
                    </div>

                    <div className="intro-one__single-content">
                      <h2>
                        <a href="#">{item.title}</a>
                      </h2>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* End Intro One */}

        {/* Start Why Choose One */}
        <section className="why-choose-one why-choose-one--about">
          <div className="shape3 float-bob-x">
            <img src="/assets/images/shapes/why-choose-v1-shape2.png" alt="#" />
          </div>
          <div className="shape5">
            <img src="/assets/images/shapes/why-choose-v1-shape3.png" alt="#" />
          </div>
          <div className="shape6">
            <img src="/assets/images/shapes/why-choose-v1-shape4.png" alt="#" />
          </div>
          <div className="shape7">
            <img src="/assets/images/shapes/why-choose-v1-shape5.png" alt="#" />
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xl-6">
                <div className="why-choose-one__img">
                  <div className="shape2"></div>
                  <div className="shape1">
                    <img src="/assets/images/shapes/why-choose-v1-shape1.png" alt="#" />
                  </div>
                  <div className="shape4 float-bob-y">
                    <img src="/assets/images/shapes/why-choose-v1-shape2.png" alt="#" />
                  </div>
                  <div className="why-choose-one__img1">
                    <img src="/assets/images/resources/why-choose-v1-img1.jpg" alt="#" />
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="why-choose-one__content">
                  <div className="sec-title">
                    <h2 className="sec-title__title">
                      Welcome to <br />
                      our physical therapy <br />
                      services
                    </h2>
                  </div>

                  <div className="why-choose-one__content-text">
                    <p className="text1">{aboutContent.whyChoose.text1}</p>
                    <p className="text2">
                      {aboutContent.whyChoose.text2}
                    </p>
                  </div>

                  <ul className="why-choose-one__content-list">
                    {aboutContent.whyChoose.features.map((feat, idx) => (
                      <li key={idx}>
                        <p>
                          {' '}
                          <span className="icon-tick"></span> {feat}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="why-choose-one__content-text2">
                    <div className="row">
                      {aboutContent.whyChoose.highlights.map((h, idx) => (
                        <div key={idx} className="col-xl-6 col-lg-6 col-md-6">
                          <div className="why-choose-one__content-text2-single">
                            <div className="inner">
                              <div className="icon-box">
                                <span className={h.icon}></span>
                              </div>

                              <div className="title-box">
                                <h2>
                                  {idx === 0 ? (
                                    <>
                                      Amazing <br />
                                      Counseling Services
                                    </>
                                  ) : (
                                    <>
                                      Innovative <br />
                                      physical theraphy
                                    </>
                                  )}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="why-choose-one__content-text3">
                    <div className="text-box">
                      <p>
                        Something know about <br /> our services
                      </p>
                    </div>

                    <div className="btn-box">
                      <Link to={aboutContent.whyChoose.ctaBtnLink} className="thm-btn">
                        {aboutContent.whyChoose.ctaBtnText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Why Choose One */}

        {/* Start Positive Psychology for Meaningful Life (Ellangala Academy) Section */}
        <AboutEllangalaAcademySection />
        {/* End Positive Psychology for Meaningful Life (Ellangala Academy) Section */}

        {/* Start Counter One */}
        <section className="counter-one">
          <div className="container">
            <div className="counter-one__inner">
              <div
                className="counter-one__inner-bg"
                style={{ backgroundImage: 'url(/assets/images/backgrounds/counter-v1-bg.jpg)' }}
              ></div>
              <div className="row">
                {aboutContent.counter.map((cnt, idx) => (
                  <div key={idx} className="col-xl-3 col-lg-6 col-md-6">
                    <div className="counter-one__single text-center">
                      <div className="counter-one__single-top">
                        <div className={`icon-box ${cnt.iconStyle || ''}`}>
                          <span className={cnt.icon}></span>
                        </div>
                        <div className="text-box">
                          <h2>
                            <span className="odometer" data-count={cnt.count}>
                              00
                            </span>
                            {cnt.hasPlus && (
                              <>
                                {' '}
                                <span className="icon-plus plus"></span>
                              </>
                            )}
                          </h2>
                        </div>
                      </div>
                      <div className="counter-one__single-bottom">
                        <p>{cnt.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Start Therapy One */}
        <section className="therapy-one">
          <div className="container">
            <div className="therapy-one__inner">
              <div
                className="therapy-one__pattern"
                style={{ backgroundImage: 'url(/assets/images/pattern/therapy-v1-pattern.png)' }}
              ></div>
              <div
                className="therapy-one__bg"
                style={{ backgroundImage: 'url(/assets/images/backgrounds/therapy-v1-bg.jpg)' }}
              ></div>
              <div className="therapy-one__img1 wow slideInRight" data-wow-delay="100ms" data-wow-duration="2500ms">
                <img src="/assets/images/resources/therapy-v1-img1.png" alt="#" />
              </div>
              <div className="shape1"></div>
              <div className="shape2"></div>
              <div className="shape3"></div>
              <div className="row">
                {/* Start Therapy One Left */}
                <div className="col-xl-5">
                  <div className="therapy-one__left">
                    <div className="sec-title">
                      <div className="sec-title__tagline">
                        <h6>{aboutContent.therapy.tagline}</h6>
                      </div>
                      <h2 className="sec-title__title">
                        {aboutContent.therapy.title.split('\n').map((line, lIdx, arr) => (
                          <React.Fragment key={lIdx}>
                            {line}
                            {lIdx < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h2>
                      {aboutContent.therapy.founderInfo && (
                        <div className="therapy-one__founder-badge" style={{ marginTop: '14px' }}>
                          <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--uterpy-black)', margin: '0 0 2px' }}>
                            {aboutContent.therapy.founderInfo.name}
                          </h4>
                          <p style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--uterpy-base)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {aboutContent.therapy.founderInfo.role}
                          </p>
                        </div>
                      )}
                    </div>

                    <ul className="therapy-one__left-list">
                      {aboutContent.therapy.leftItems.map((item, idx) => (
                        <li key={idx} className="wow fadeInLeft" data-wow-delay={item.delay} data-wow-duration="1500ms">
                          <div className="icon-box">
                            <span className={item.icon}></span>
                          </div>
                          <div className="content-box">
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* End Therapy One Left */}

                {/* Start Therapy One Right */}
                <div className="col-xl-7">
                  <div className="therapy-one__right clearfix">
                    <div className="therapy-one__right-content">
                      <div
                        className="therapy-one__right-content-bg"
                        style={{ backgroundImage: 'url(/assets/images/backgrounds/therapy-v1-bg2.jpg)' }}
                      ></div>
                      <div className="inner">
                        <div className="icon-box">
                          <span className={aboutContent.therapy.rightBox.icon}></span>
                        </div>
                        <div className="content-box">
                          <h2>
                            {aboutContent.therapy.rightBox.title.split('\n').map((line, lIdx, arr) => (
                              <React.Fragment key={lIdx}>
                                {line}
                                {lIdx < arr.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </h2>
                          <p>{aboutContent.therapy.rightBox.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Therapy One Right */}
              </div>
            </div>
          </div>
        </section>
        {/* End Therapy One */}

        {/* Start Testimonial One */}
        <section className="testimonial-one">
          <div
            className="testimonial-one__pattern"
            style={{ backgroundImage: 'url(/assets/images/pattern/testimonial-v1-pattern1.png)' }}
          ></div>
          <div className="carousel-control-block__outer">
            <div className="carousel-control-block">
              <div className="carousel-btn-block testimonial-carousel-btn">
                <span className="carousel-btn left-btn">
                  <i className="icon-right-arrow"></i>
                </span>
                <span className="carousel-btn right-btn">
                  <i className="icon-right-arrow1"></i>
                </span>
              </div>
              <div className="carousel-number-count"></div>
            </div>
          </div>
          <div className="container">
            <div className="sec-title">
              <div className="sec-title__tagline">
                <h6>{aboutContent.testimonials.tagline}</h6>
              </div>
              <h2 className="sec-title__title">
                {aboutContent.testimonials.title.split('\n').map((line, lIdx, arr) => (
                  <React.Fragment key={lIdx}>
                    {line}
                    {lIdx < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="testimonial-one__inner">
                  <div className="testimonial-carousel__one owl-theme owl-carousel">
                    {aboutContent.testimonials.items.map((t, idx) => (
                      <div key={idx} className="testimonial-one__slide testimonial-one__single">
                        <p className="testimonial-one__single-text">
                          {t.text}
                        </p>
                        <div className="testimonial-one__client-info">
                          <div className="testimonial-one__client-details">
                            <div className="testimonial-one__client-img">
                              <img src={t.image} alt="#" />
                            </div>
                            <div className="testimonial-one__client-content">
                              <h4>{t.name}</h4>
                              <p>{t.role}</p>
                            </div>
                          </div>
                          <div className="testimonial-one__quote">
                            <span className="icon-quote"></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Testimonial One */}

        {/* Start Team One */}
        <section className="team-one" id="our-team">
          <div className="container">
            <div className="sec-title text-center">
              <div className="sec-title__tagline">
                <h6>{aboutContent.team.tagline}</h6>
              </div>
              <h2 className="sec-title__title">
                {aboutContent.team.title.split('\n').map((line, lIdx, arr) => (
                  <React.Fragment key={lIdx}>
                    {line}
                    {lIdx < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
            </div>
            <div className="row justify-content-center gy-5">
              {aboutContent.team.members.map((member, idx) => (
                <div
                  key={idx}
                  className={`col-xl-3 col-lg-6 col-md-6 d-flex mb-4 wow ${member.animation}`}
                  data-wow-delay=".3s"
                >
                  <div className="team-one__single">
                    <div className="team-one__single-img">
                      <img src={member.image} alt="#" />
                    </div>
                    <div className="team-one__single-content">
                      <div className="title-box text-center">
                        <h2>
                          <Link to={member.link}>{member.name}</Link>
                        </h2>
                        <p className="team-one__designation">{member.designation}</p>
                        {member.qualification && (
                          <p className="team-one__qualification">{member.qualification}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Team One */}
        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
