import React, { useState } from 'react';
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
                  <div className="faq-page__form">
                    <div
                      className="faq-page__right-bg"
                      style={{ backgroundImage: 'url(/assets/images/backgrounds/faq-page-bg1.jpg)' }}
                    ></div>
                    <div className="title-box">
                      <h2>
                        Do You Have Questions? <br /> Please drop below
                      </h2>
                    </div>
                    <div className="form-box">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                          <input type="text" name="username" placeholder={faqContent.sidebar.namePlaceholder} required />
                        </div>
                        <div className="form-group">
                          <input type="email" placeholder={faqContent.sidebar.emailPlaceholder} name="email" required />
                        </div>
                        <div className="form-group">
                          <textarea placeholder={faqContent.sidebar.questionPlaceholder} required></textarea>
                        </div>
                        <div className="row">
                          <div className="col-xl-12">
                            <div className="button-box">
                              <button className="thm-btn" type="submit">
                                {faqContent.sidebar.submitBtnText}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
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
