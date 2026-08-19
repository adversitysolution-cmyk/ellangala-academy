import React from 'react';
import { Link } from 'react-router-dom';
import HeaderThree from '../components/layout/HeaderThree';
import FooterOne from '../components/layout/FooterOne';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { homeThreeContent } from '../contents/homeThree.content';

export default function HomeThree() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderThree />

        {/* Start Main Slider One Style 3 */}
        <section className="main-slider main-slider-one style3">
          <div className="main-slider-one__inner">
            <div
              className="main-slider__carousel owl-carousel owl-theme thm-owl__carousel"
              data-owl-options='{"loop": true, "items": 1, "navText": ["<span class=\"icon-arrow-right\"></span>","<span class=\"icon-arrow-right1\"></span>"], "margin": 0, "dots": false, "nav": true, "animateOut": "slideOutDown", "animateIn": "fadeIn", "active": true, "smartSpeed": 1000, "autoplay": true, "autoplayTimeout": 7000, "autoplayHoverPause": false}'
            >
              {homeThreeContent.slider.map((slide, idx) => (
                <div key={idx} className="main-slider-one__single">
                  <div
                    className="image-layer"
                    style={{ backgroundImage: `url(${slide.bgImage})` }}
                  ></div>
                  <div className="main-slider-three__outer-content">
                    <div className="top-content">
                      <div className="icon-box">
                        <span className={slide.outer.icon}></span>
                      </div>
                      <div className="title-box">
                        <h2>
                          Getting Your Mind Well, <br />
                          With the Finest Therapy
                        </h2>
                      </div>
                    </div>

                    <div className="bottom-content">
                      <p>
                        Et tristique nunc faucibus sit tortor commodo aliquet commodo <br /> quam. aliquam sed volutpat
                        consequat sagittis duis donec neque.
                      </p>
                      <div className="btn-box">
                        <a href={slide.outer.btnLink}>{slide.outer.btnText}</a>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <div className="main-slider-one__content">
                      <div className="title">
                        <h2>
                          We offer <br />
                          counseling in <br />
                          psychology
                        </h2>
                      </div>

                      <div className="text">
                        <p>{slide.main.subtitle}</p>
                      </div>
                      <div className="main-slider-one__content-btn">
                        <div className="btn-one">
                          <Link to={slide.main.primaryBtn.link} className="thm-btn">
                            {slide.main.primaryBtn.text}
                          </Link>
                        </div>
                        <div className="btn-two">
                          <Link to={slide.main.secondaryBtn.link}>{slide.main.secondaryBtn.text}</Link>
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

        {/* Start Intro Two */}
        <section className="intro-two">
          <div className="container">
            <div className="row">
              {homeThreeContent.intro.map((item, idx) => (
                <div key={idx} className={`col-xl-4 col-lg-4 wow ${item.animation}`} data-wow-delay={item.delay} data-wow-duration="1500ms">
                  <div className="intro-two__single">
                    <div className="shape1">
                      <img src="/assets/images/shapes/intro-v2-shape1.png" alt="" />
                    </div>
                    <div className="shape2">
                      <img src="/assets/images/shapes/intro-v2-shape2.png" alt="" />
                    </div>
                    <div className="intro-two__single-icon">
                      <span className={item.icon}></span>
                    </div>

                    <div className="intro-two__single-content text-center">
                      <h2>
                        <a href="#">{item.title}</a>
                      </h2>
                      <p>
                        Psychlogical porro quisquam est qui dolorem <br /> ipsum quia dolor sit amet consectetur sit
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Intro Two */}

        {/* Start Why Choose One Style 2 */}
        <section className="why-choose-one style2">
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
          <div className="shape8">
            <img src="/assets/images/shapes/why-choose-v2-shape1.png" alt="#" />
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
                    <img src="/assets/images/resources/why-choose-v2-img1.jpg" alt="#" />
                  </div>

                  <div
                    className="why-choose-one__img2 wow fadeInRight"
                    data-wow-delay="100ms"
                    data-wow-duration="1000ms"
                  >
                    <div className="inner">
                      <img src="/assets/images/resources/why-choose-v2-img2.jpg" alt="#" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="why-choose-one__content">
                  <div className="sec-title">
                    <div className="sec-title__tagline">
                      <h6>{homeThreeContent.whyChoose.tagline}</h6>
                    </div>
                    <h2 className="sec-title__title">
                      Best Online <br />
                      Therapy & Counselling <br />
                      Services
                    </h2>
                  </div>

                  <ul className="why-choose-one__content-list">
                    {homeThreeContent.whyChoose.features.map((feat, idx) => (
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
                      {homeThreeContent.whyChoose.highlights.map((h, idx) => (
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
                                      Connect <br />
                                      with an expert
                                    </>
                                  ) : (
                                    <>
                                      Discuss your <br />
                                      concern
                                    </>
                                  )}
                                </h2>
                              </div>
                            </div>
                            <div className="text-box">
                              <p>
                                Eaque ipsa quae ab illo inventore <br /> veritatis et quasi
                              </p>
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
                      <Link to={homeThreeContent.whyChoose.ctaBtnLink} className="thm-btn">
                        {homeThreeContent.whyChoose.ctaBtnText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Start Testimonial Three */}
        <section className="testimonial-three">
          <div
            className="testimonial-three__bg"
            style={{ backgroundImage: 'url(/assets/images/backgrounds/testimonial-v2-bg.jpg)' }}
          ></div>
          <div
            className="testimonial-three__pattern"
            style={{ backgroundImage: 'url(/assets/images/pattern/testimonial-v3-pattern.png)' }}
          ></div>
          <div className="container">
            <div className="sec-title text-center">
              <div className="sec-title__tagline">
                <h6>{homeThreeContent.testimonials.tagline}</h6>
              </div>
              <h2 className="sec-title__title">{homeThreeContent.testimonials.title}</h2>
            </div>

            <div className="row">
              <div className="col-xl-12">
                <div className="testimonial-three__inner">
                  <div className="owl-carousel owl-theme thm-owl__carousel testimonial-three__carousel">
                    {homeThreeContent.testimonials.items.map((item, idx) => (
                      <div key={idx} className="testimonial-three__single">
                        <div className="testimonial-three__client-info">
                          <div className="testimonial-three__client-details">
                            <div className="testimonial-three__client-img">
                              <img src={item.image} alt="#" />
                            </div>
                            <div className="testimonial-three__client-content">
                              <h4>{item.name}</h4>
                              <p>{item.role}</p>
                            </div>
                          </div>
                          <div className="testimonial-three__quote">
                            <span className="icon-quote"></span>
                          </div>
                        </div>
                        <div className="testimonial-three__single-text">
                          <p>{item.text}</p>
                        </div>
                        <div className="testimonial-three__single-bottom">
                          <div className="border-box"></div>
                          <div className="rating-box">
                            <ul>
                              {[...Array(item.rating)].map((_, rIdx) => (
                                <li key={rIdx}>
                                  <span className="icon-star"></span>
                                </li>
                              ))}
                            </ul>
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
        {/* End Testimonial Three */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
