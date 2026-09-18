import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { faqContent } from '../contents/faq.content';
import SEO from '../seo/SEO';
import { generateBreadcrumbSchema } from '../seo/schemas/schemaGenerators';

export default function FAQ() {
  useUterpyPlugins();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Frequently Asked Questions | Ellangala’s Academy"
          description="Find answers to common questions about workshops, positive mentoring, MindGym sessions, book orders, and enrollment at Ellangala’s Academy."
          canonical="/faq"
          structuredData={[
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'FAQ', path: '/faq' }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title={faqContent.header.title} />

        {/* Start Faq Page */}
        <section className="faq-page">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-7">
                <div className="faq-page__left">
                  <div className="title">
                    <h2>{faqContent.sectionTitle}</h2>
                  </div>

                  <div className="services-details__faq services-details__faq--faq-page">
                    <div className="accrodion-grp" data-grp-name="faq-one-accrodion">
                      {faqContent.faqs.map((faq, index) => (
                        <div
                          key={index}
                          className={`accrodion ${activeIndex === index ? 'active' : ''}`}
                          onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="accrodion-title">
                            <h4>{faq.q}</h4>
                          </div>
                          <div
                            className="accrodion-content"
                            style={{ display: activeIndex === index ? 'block' : 'none' }}
                          >
                            <div className="inner">
                              <p>{faq.a}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-lg-5 wow slideInRight" data-wow-delay="500ms" data-wow-duration="2500ms">
                <div className="faq-page__right">
                  <div className="faq-page__form" style={{ padding: '42px 30px 42px 30px' }}>
                    <div
                      className="faq-page__right-bg"
                      style={{ backgroundImage: 'url(/assets/images/backgrounds/faq-page-bg1.jpg)' }}
                    ></div>
                    <div className="title-box">
                      <h2>
                        {faqContent.sidebar.title} <br />
                        <span style={{ color: 'var(--uterpy-base, #CA8A38)', fontSize: '20px' }}>
                          {faqContent.sidebar.subtitle}
                        </span>
                      </h2>
                    </div>
                    <div style={{ marginTop: '20px', position: 'relative', zIndex: 2 }}>
                      <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
                        {faqContent.sidebar.description}
                      </p>
                      <div className="button-box">
                        <Link
                          to="/contact"
                          className="thm-btn"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            textAlign: 'center',
                            textDecoration: 'none'
                          }}
                        >
                          {faqContent.sidebar.btnText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-12">
                <div className="faq-page__bottom">
                  <div className="email">
                    <a href={faqContent.bottom.emailLink}>{faqContent.bottom.email}</a>
                  </div>
                  <div className="text">
                    <p>{faqContent.bottom.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Faq Page */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
