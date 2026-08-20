import React from 'react';
import { Link } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { homeContent } from '../contents/home.content';
import TestimonialsSection from '../components/common/TestimonialsSection';

export default function HomeOne() {
  useUterpyPlugins();
  const programsScrollRef = React.useRef(null);
  const [activeDot, setActiveDot] = React.useState(0);

  const handleProgramScroll = (direction) => {
    if (programsScrollRef.current) {
      const frameWidth = programsScrollRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -frameWidth : frameWidth;
      programsScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleProgramsOnScroll = () => {
    if (programsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = programsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const dotIndex = Math.min(
          4,
          Math.max(0, Math.round((scrollLeft / maxScroll) * 4))
        );
        setActiveDot(dotIndex);
      }
    }
  };

  const scrollToDot = (dotIdx) => {
    if (programsScrollRef.current) {
      const { scrollWidth, clientWidth } = programsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      programsScrollRef.current.scrollTo({
        left: (maxScroll / 4) * dotIdx,
        behavior: 'smooth',
      });
      setActiveDot(dotIdx);
    }
  };

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />

        {/* Start Main Slider One */}
        <section className="main-slider main-slider-one">
          <div className="main-slider-one__inner">
            <div
              className="main-slider__carousel owl-carousel owl-theme thm-owl__carousel"
              data-owl-options='{"loop": true, "items": 1, "navText": ["<span class=\"icon-arrow-right\"></span>","<span class=\"icon-arrow-right1\"></span>"], "margin": 0, "dots": false, "nav": true, "animateOut": "slideOutDown", "animateIn": "fadeIn", "active": true, "smartSpeed": 1000, "autoplay": true, "autoplayTimeout": 7000, "autoplayHoverPause": false}'
            >
              {homeContent.slider.map((slide, idx) => (
                <div key={idx} className="main-slider-one__single">
                  <div
                    className="image-layer"
                    style={{ backgroundImage: `url(${slide.bgImage})` }}
                  ></div>
                  <div className="shape1">
                    <img src="/assets/images/shapes/slider-v1-shape1.png" alt="#" />
                  </div>
                  <div className="shape2">
                    <img src="/assets/images/shapes/slider-v1-shape2.png" alt="#" />
                  </div>
                  <div className="shape3">
                    <img src="/assets/images/shapes/slider-v1-shape3.png" alt="#" />
                  </div>
                  <div className="slider-one__border"></div>
                  <div className="slider-one__border two"></div>
                  <div className="slider-one__border three"></div>
                  <div className="slider-one__border four"></div>
                  <div className="slider-one__border five"></div>
                  <div className="container">
                    <div className="main-slider-one__content">
                      <div className="title">
                        <h2>
                          {slide.title.split('\n').map((tLine, tIdx, arr) => (
                            <React.Fragment key={tIdx}>
                              {tLine}
                              {tIdx < arr.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </h2>
                      </div>

                      <div className="text">
                        <p>{slide.subtitle}</p>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Main Slider One */}

        {/* Start Intro One */}
        <section className="intro-one">
          <div
            className="intro-one__pattern"
            style={{ backgroundImage: 'url(/assets/images/pattern/intro-v1-pattern.jpg)' }}
          ></div>
          <div className="container">
            <ul className="row">
              {homeContent.intro.map((item, idx) => (
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

        {/* Start Services One */}
        <section className="services-one">
          <div className="container">
            <div className="sec-title text-center">
              <div className="sec-title__tagline">
                <h6>{homeContent.services.tagline}</h6>
              </div>
              <h2 className="sec-title__title">
                {homeContent.services.title.split('\n').map((line, lIdx, arr) => (
                  <React.Fragment key={lIdx}>
                    {line}
                    {lIdx < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
            </div>
            <div className="row">
              {homeContent.services.items.map((svc, idx) => (
                <div key={idx} className="col-xl-4 col-lg-4 wow animated fadeInUp" data-wow-delay={svc.delay}>
                  <div className="services-one__single">
                    <div className="services-one__single-img">
                      <div className="inner">
                        <img src={svc.image} alt="#" />
                      </div>
                      <div className="services-one__single-img-icon">
                        <div className="services-one__single-img-icon-inner">
                          <span className={svc.icon}></span>
                        </div>
                      </div>
                    </div>

                    <div className="services-one__single-content clearfix">
                      <div className="btn-box">
                        <Link to={svc.link}>
                          <div className="text-box">{svc.btnText}</div>
                          <div className="icon-box">
                            <span className="icon-arrow-right1"></span>
                          </div>
                        </Link>
                      </div>

                      <div className="services-one__single-content-inner">
                        <h2>
                          <Link to={svc.link}>{svc.title}</Link>
                        </h2>
                        <p>{svc.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Services One */}

        {/* Start Why Choose One */}
        <section className="why-choose-one">
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
                      {homeContent.whyChoose.title.split('\n').map((line, lIdx, arr) => (
                        <React.Fragment key={lIdx}>
                          {line}
                          {lIdx < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </h2>
                  </div>

                  <div className="why-choose-one__content-text">
                    <p className="text1">{homeContent.whyChoose.text1}</p>
                    <p className="text2">
                      {homeContent.whyChoose.text2}
                    </p>
                  </div>

                  <ul className="why-choose-one__content-list">
                    {homeContent.whyChoose.features.map((feat, idx) => (
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
                      {homeContent.whyChoose.highlights.map((item, idx) => (
                        <div key={idx} className="col-xl-6 col-lg-6 col-md-6">
                          <div className="why-choose-one__content-text2-single">
                            <div className="inner">
                              <div className="icon-box">
                                <span className={item.icon}></span>
                              </div>
                              <div className="title-box">
                                <h2>
                                  {item.title.split('\n').map((line, lIdx, arr) => (
                                    <React.Fragment key={lIdx}>
                                      {line}
                                      {lIdx < arr.length - 1 && <br />}
                                    </React.Fragment>
                                  ))}
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
                        {homeContent.whyChoose.ctaText.split('\n').map((line, lIdx, arr) => (
                          <React.Fragment key={lIdx}>
                            {line}
                            {lIdx < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>

                    <div className="btn-box">
                      <Link to={homeContent.whyChoose.ctaBtnLink} className="thm-btn">
                        {homeContent.whyChoose.ctaBtnText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Why Choose One */}

        {/* Start Case One */}
        <section className="case-one" style={{ position: 'relative', paddingBottom: '90px', paddingTop: '80px' }}>
          <div className="container" style={{ position: 'relative' }}>
            <div className="sec-title text-center" style={{ marginBottom: '45px' }}>
              <div className="sec-title__tagline">
                <h6>{homeContent.caseStudies.tagline}</h6>
              </div>
              <h2 className="sec-title__title">{homeContent.caseStudies.title}</h2>
            </div>

            <div className="case-one__carousel-container">
              {/* Navigation Arrows */}
              <button
                type="button"
                className="case-one__nav-btn case-one__nav-btn--prev"
                onClick={() => handleProgramScroll('left')}
                aria-label="Previous programs"
              >
                <i className="fa fa-angle-left"></i>
              </button>
              <button
                type="button"
                className="case-one__nav-btn case-one__nav-btn--next"
                onClick={() => handleProgramScroll('right')}
                aria-label="Next programs"
              >
                <i className="fa fa-angle-right"></i>
              </button>

              {/* Single Horizontal Row Track with all 21 cards */}
              <div
                ref={programsScrollRef}
                onScroll={handleProgramsOnScroll}
                className="case-one__carousel-track"
              >
                {homeContent.caseStudies.items.map((cs, idx) => (
                  <div key={idx} className="case-one__single-item">
                    <div
                      className="case-one__single"
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '0px',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <div className="case-one__single-img" style={{ position: 'relative', width: '100%', aspectRatio: '420 / 380', overflow: 'hidden' }}>
                        <Link to={cs.link}>
                          <img
                            src={cs.image}
                            alt={cs.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </Link>
                      </div>

                      <div
                        className="case-one__single-content"
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '190px',
                        }}
                      >
                        <div className="icon-box">
                          <span className="icon-brain"></span>
                        </div>
                        <div className="btn-box">
                          <Link to={cs.link} aria-label={cs.title}>
                            <span className="icon-arrow-right1"></span>
                          </Link>
                        </div>
                        <div className="case-one__single-content-inner">
                          <h2>
                            <Link to={cs.link}>{cs.title}</Link>
                          </h2>
                          <p>
                            {cs.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots Pagination */}
              <div className="case-one__dots-wrapper">
                {[0, 1, 2, 3, 4].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    className={`case-one__dot ${activeDot === dotIdx ? 'active' : ''}`}
                    onClick={() => scrollToDot(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* End Case One */}

        {/* Start Counter One */}
        <section className="counter-one">
          <div className="container">
            <div className="counter-one__inner">
              <div
                className="counter-one__inner-bg"
                style={{ backgroundImage: 'url(/assets/images/backgrounds/counter-v1-bg.jpg)' }}
              ></div>
              <div className="row">
                {homeContent.counter.map((cnt, idx) => (
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
                <div className="col-xl-5">
                  <div className="therapy-one__left">
                    <div className="sec-title">
                      <div className="sec-title__tagline">
                        <h6>{homeContent.therapy.tagline}</h6>
                      </div>
                      <h2 className="sec-title__title">
                        {homeContent.therapy.title.split('\n').map((line, lIdx, arr) => (
                          <React.Fragment key={lIdx}>
                            {line}
                            {lIdx < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h2>
                      {homeContent.therapy.founderInfo && (
                        <div className="therapy-one__founder-badge" style={{ marginTop: '14px' }}>
                          <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--uterpy-black)', margin: '0 0 2px' }}>
                            {homeContent.therapy.founderInfo.name}
                          </h4>
                          <p style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--uterpy-base)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {homeContent.therapy.founderInfo.role}
                          </p>
                        </div>
                      )}
                    </div>

                    <ul className="therapy-one__left-list">
                      {homeContent.therapy.leftItems.map((item, idx) => (
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

                    <div className="btn-box" style={{ marginTop: '35px' }}>
                      <Link to="/founder" className="thm-btn">
                        About Founder
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-xl-7">
                  <div className="therapy-one__right clearfix">
                    <div className="therapy-one__right-content">
                      <div
                        className="therapy-one__right-content-bg"
                        style={{ backgroundImage: 'url(/assets/images/backgrounds/therapy-v1-bg2.jpg)' }}
                      ></div>
                      <div className="inner">
                        <div className="icon-box">
                          <span className={homeContent.therapy.rightBox.icon}></span>
                        </div>
                        <div className="content-box">
                          <h2>
                            {homeContent.therapy.rightBox.title.split('\n').map((line, lIdx, arr) => (
                              <React.Fragment key={lIdx}>
                                {line}
                                {lIdx < arr.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </h2>
                          <p>
                            {homeContent.therapy.rightBox.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Therapy One */}

        {/* Start Testimonial One */}
        <TestimonialsSection />
        {/* End Testimonial One */}

        {/* Start Team One (hidden) */}
        {/* End Team One */}

        {/* Start Blog One */}
        <section className="blog-one">
          <div
            className="blog-one__pattern1"
            style={{ backgroundImage: 'url(/assets/images/pattern/blog-v1-pattern1.png)' }}
          ></div>
          <div
            className="blog-one__pattern2"
            style={{ backgroundImage: 'url(/assets/images/pattern/blog-v1-pattern2.png)' }}
          ></div>
          <div className="container">
            <div className="sec-title text-center">
              <div className="sec-title__tagline">
                <h6>{homeContent.blog.tagline}</h6>
              </div>
              <h2 className="sec-title__title">
                {homeContent.blog.title.split('\n').map((line, lIdx, arr) => (
                  <React.Fragment key={lIdx}>
                    {line}
                    {lIdx < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
            </div>
            <div className="row">
              {homeContent.blog.posts.map((post, idx) => (
                <div key={idx} className={`col-xl-6 col-lg-6 d-flex wow ${post.animation}`} data-wow-delay="100ms" data-wow-duration="1500ms">
                  <div className="blog-one__single" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                    <div className="blog-one__single-img">
                      <div className="inner">
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                        />
                      </div>
                    </div>

                    <div className="blog-one__single-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div className="blog-one__single-content-top">
                        <div className="shape1">
                          <img src="/assets/images/shapes/blog-v1-shape1.png" alt="#" />
                        </div>
                        <div className="date-box">
                          <h2>
                            {post.day} <br /> <span>{post.monthYear}</span>
                          </h2>
                        </div>

                        <ul className="meta-box">
                          <li>
                            <div className="icon">
                              <span className="icon-user3"></span>
                            </div>
                            <div className="text">
                              <p>
                                <Link to={post.link}>{post.author}</Link>
                              </p>
                            </div>
                          </li>

                          <li>
                            <div className="icon">
                              <span className="icon-comment-o"></span>
                            </div>
                            <div className="text">
                              <p>
                                <Link to={post.link}>{post.comments}</Link>
                              </p>
                            </div>
                          </li>
                        </ul>

                        <div className="btn-box">
                          <Link to={post.link}>
                            {post.btnText} <span className="icon-right-arrow1"></span>
                          </Link>
                        </div>
                      </div>

                      <div className="blog-one__single-content-bottom" style={{ flex: 1, minHeight: '120px' }}>
                        <div className="shape2">
                          <img src="/assets/images/shapes/blog-v1-shape1.png" alt="" />
                        </div>
                        <h2>
                          <Link to={post.link}>{post.title}</Link>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Blog One */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
