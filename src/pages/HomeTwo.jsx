import React from 'react';
import { Link } from 'react-router-dom';
import HeaderTwo from '../components/layout/HeaderTwo';
import FooterTwo from '../components/layout/FooterTwo';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { homeTwoContent } from '../contents/homeTwo.content';

export default function HomeTwo() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderTwo />

        {/* Start Main Slider Two */}
        <section className="main-slider main-slider-two">
          <div className="main-slider-two__inner">
            <div className="owl-carousel owl-theme main-slider-two__carousel">
              {homeTwoContent.slider.map((slide, idx) => (
                <div key={idx} className="main-slider-two__single">
                  <div
                    className="image-layer"
                    style={{ backgroundImage: `url(${slide.bgImage})` }}
                  ></div>
                  <div className="shape1"></div>
                  <div className="shape2">
                    <img src="/assets/images/shapes/main-slider-v2-shape1.png" alt="#" />
                  </div>
                  <div className="shape3">
                    <img src="/assets/images/shapes/main-slider-v2-shape2.png" alt="#" />
                  </div>
                  <div className="shape4">
                    <img src="/assets/images/shapes/main-slider-v2-shape3.png" alt="#" />
                  </div>
                  <div className="container">
                    <div className="main-slider-two__single-inner">
                      <div className="main-slider-two__content">
                        <div className="tagline">
                          <div className="border-box"></div>
                          <div className="text-box">
                            <p>{slide.tagline}</p>
                          </div>
                        </div>
                        <div className="title">
                          <h2>
                            The world's <br />
                            largest psychlogical <br />
                            services
                          </h2>
                        </div>

                        <div className="main-slider-one__content-btn">
                          <div className="btn-one">
                            <Link to={slide.primaryBtn.link} className="thm-btn">
                              {slide.primaryBtn.text}
                            </Link>
                          </div>
                          <div className="btn-two">
                            <Link to={slide.secondaryBtn.link}>{slide.secondaryBtn.text}</Link>
                          </div>
                        </div>
                      </div>

                      <div className="main-slider-two__video">
                        <a href={slide.videoUrl} className="video-popup">
                          <div className="main-slider-two__video-icon">
                            <span className="icon-play"></span>
                            <i className="ripple"></i>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="owl-theme">
              <div className="owl-controls">
                <div className="text-box">
                  <p>Slide Image</p>
                </div>
                <div className="custom-nav owl-nav"></div>
              </div>
            </div>
          </div>
        </section>
        {/* End Main Slider Two */}

        {/* Start About One */}
        <section className="about-one">
          <div className="shape2">
            <img src="/assets/images/shapes/about-v1-shape1.png" alt="#" />
          </div>
          <div className="shape3">
            <img src="/assets/images/shapes/about-v1-shape2.png" alt="#" />
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xl-6">
                <div className="about-one__img">
                  <div className="about-one__img1 wow fadeInLeft" data-wow-delay=".3s">
                    <div className="shape1"></div>
                    <div className="inner">
                      <img src="/assets/images/about/about-v1-img1.jpg" alt="#" />
                    </div>
                  </div>
                  <div className="about-one__img2 wow fadeInUp" data-wow-delay=".3s">
                    <div className="overlay-content">
                      <div className="icon-box">
                        <span className={homeTwoContent.about.badgeIcon}></span>
                      </div>
                      <div className="text-box">
                        <p>
                          Best Couple <br />
                          Counselling
                        </p>
                      </div>
                    </div>
                    <div className="inner">
                      <img src="/assets/images/about/about-v1-img2.jpg" alt="#" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="about-one__content">
                  <div className="sec-title">
                    <div className="sec-title__tagline">
                      <h6>{homeTwoContent.about.tagline}</h6>
                    </div>
                    <h2 className="sec-title__title">
                      Welcome to <br />
                      our physical therapy <br />
                      services
                    </h2>
                  </div>

                  <div className="about-one__content-text1">
                    <p>
                      Over 20 years’ experience providing top quality therapy across <br /> world orem aliqua lonm andhn
                      ipsum therapy services
                    </p>
                  </div>

                  <div className="about-one__content-text2">
                    <div className="about-one__content-text2-img">
                      <div
                        className="inner"
                        style={{ backgroundImage: 'url(/assets/images/about/about-v1-img3.jpg)' }}
                      ></div>
                      <div className="overlay-content">
                        <h2>
                          <span className="odometer" data-count={homeTwoContent.about.experienceCount}>
                            00
                          </span>
                          <span className="plus">
                            <i className="icon-plus"></i>
                          </span>
                        </h2>
                        <p>
                          Year <br /> Experience{' '}
                        </p>
                      </div>
                    </div>

                    <div className="about-one__content-text2-text">
                      <ul>
                        {homeTwoContent.about.features.map((feat, idx) => (
                          <li key={idx}>
                            <p>
                              {' '}
                              <span className="icon-tick"></span> {feat}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="about-one__content-text3">
                    <div className="left-content">
                      <div className="title-box">
                        <h3>{homeTwoContent.about.doctor.name}</h3>
                        <p>{homeTwoContent.about.doctor.role}</p>
                      </div>
                      <div className="signature-box">
                        <img src="/assets/images/about/about-v1-signature.png" alt="#" />
                      </div>
                    </div>
                    <div className="right-content">
                      <p>
                        {homeTwoContent.about.doctor.quote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End About One */}

        {/* Start Services Two */}
        <section className="services-two">
          <div className="container">
            <div className="sec-title text-center">
              <div className="sec-title__tagline">
                <h6>{homeTwoContent.services.tagline}</h6>
              </div>
              <h2 className="sec-title__title">
                Our latest psychological <br />
                services
              </h2>
            </div>
            <div className="row">
              {homeTwoContent.services.items.map((svc, idx) => (
                <div key={idx} className={`col-xl-3 col-lg-6 col-md-6 wow ${svc.animation}`} data-wow-delay={svc.delay} data-wow-duration="1000ms">
                  <div className="services-two__single">
                    <div className="services-two__single-img">
                      <img src={svc.image} alt="" />
                      <div className="services-two__single-img-icon">
                        <div className="services-two__single-img-icon-inner">
                          <span className={svc.icon}></span>
                        </div>
                      </div>
                    </div>
                    <div className="services-two__single-content clearfix">
                      <h2>
                        <Link to={svc.link}>{svc.title}</Link>
                      </h2>
                      <div className="btn-box">
                        <Link to={svc.link}>
                          <span className="icon-right-arrow1"></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Services Two */}

        {/* Start Counter One */}
        <section className="counter-one counter-one--two">
          <div className="container">
            <div className="counter-one__inner">
              <div
                className="counter-one__inner-bg"
                style={{ backgroundImage: 'url(/assets/images/backgrounds/counter-v1-bg.jpg)' }}
              ></div>
              <div className="row">
                {homeTwoContent.counter.map((cnt, idx) => (
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
        {/* End Counter One */}

        {/* Start Therapy Two */}
        <section className="therapy-two">
          <div className="container">
            <div className="therapy-two__inner">
              <div
                className="therapy-two__img"
                style={{ backgroundImage: 'url(/assets/images/resources/therapy-v2-img1.jpg)' }}
              >
                <div className="shape1"></div>
                <div className="shape2"></div>
                <div className="shape3"></div>
                <div className="therapy-two__img-content">
                  <div className="icon-box">
                    <span className={homeTwoContent.therapy.leftCard.icon}></span>
                  </div>
                  <div className="text-box">
                    <h2>{homeTwoContent.therapy.leftCard.title}</h2>
                    <p>{homeTwoContent.therapy.leftCard.description}</p>
                  </div>
                </div>
              </div>

              <div className="therapy-two__content">
                <div
                  className="therapy-two__content-bg"
                  style={{ backgroundImage: 'url(/assets/images/backgrounds/therapy-v2-bg.jpg)' }}
                ></div>
                <div className="title-box">
                  <h2>
                    Effective Solutions <br />
                    Professional Mental Therapy <br />
                    Services
                  </h2>
                </div>

                <ul className="therapy-two__content-list">
                  {homeTwoContent.therapy.items.map((item, idx) => (
                    <li key={idx} className="wow fadeInUp" data-wow-delay={item.delay}>
                      <div className="icon-box">
                        <span className={item.icon}></span>
                      </div>
                      <div className="content-box">
                        <h2>{item.title}</h2>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* End Therapy Two */}

        {/* Start Testimonial One */}
        <section className="testimonial-one testimonial-one--two">
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
                <h6>{homeTwoContent.testimonials.tagline}</h6>
              </div>
              <h2 className="sec-title__title">
                What does the customer <br />
                have to say?
              </h2>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="testimonial-one__inner">
                  <div className="testimonial-carousel__one owl-theme owl-carousel">
                    {homeTwoContent.testimonials.items.map((t, idx) => (
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

        <FooterTwo />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
