import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { faqContent, getPageFaqData } from '../../contents/faq.content';

export default function FAQSection({
  title,
  faqs,
  sidebar,
  showBottom = true,
  className = ''
}) {
  const location = useLocation();
  const pageData = getPageFaqData(location?.pathname || '/');

  const activeTitle = title || pageData.sectionTitle || faqContent.sectionTitle;
  const activeFaqs = faqs || pageData.faqs || faqContent.faqs;
  const activeSidebar = sidebar || pageData.sidebar || faqContent.sidebar;

  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(prev => (prev === index ? -1 : index));
  };

  // Structured Schema for Answer Engines (AEO) and Generative Engines (GEO)
  const faqSchemaJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section
      className={`faq-page faq-section-global ${className}`}
      style={{ paddingTop: '90px', paddingBottom: '90px' }}
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Invisible Schema Script for AEO/GEO Scrapers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaJson) }}
      />

      <div className="container">
        <div className="row">
          {/* Left Column: Contextual FAQ Accordion */}
          <div className="col-xl-8 col-lg-7">
            <div className="faq-page__left">
              <div className="title">
                <h2>{activeTitle}</h2>
              </div>

              <div className="services-details__faq services-details__faq--faq-page">
                <div className="accrodion-grp" data-grp-name="faq-one-accrodion">
                  {activeFaqs.map((faq, index) => {
                    const isOpen = activeIndex === index;
                    return (
                      <div
                        key={index}
                        className={`accrodion ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleAccordion(index)}
                        style={{ cursor: 'pointer' }}
                        itemScope
                        itemProp="mainEntity"
                        itemType="https://schema.org/Question"
                      >
                        <div className="accrodion-title">
                          <h4 itemProp="name">{faq.q}</h4>
                        </div>
                        <div
                          className="accrodion-content"
                          style={{ display: isOpen ? 'block' : 'none' }}
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                        >
                          <div className="inner">
                            <p itemProp="text">{faq.a}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Help & Contact Sidebar Card */}
          <div className="col-xl-4 col-lg-5 wow slideInRight" data-wow-delay="300ms" data-wow-duration="1500ms">
            <div className="faq-page__right">
              <div className="faq-page__form" style={{ padding: '42px 30px 42px 30px' }}>
                <div
                  className="faq-page__right-bg"
                  style={{ backgroundImage: 'url(/assets/images/backgrounds/faq-page-bg1.jpg)' }}
                ></div>
                <div className="title-box">
                  <h2>
                    {activeSidebar.title} <br />
                    <span style={{ color: 'var(--uterpy-base, #CA8A38)', fontSize: '20px' }}>
                      {activeSidebar.subtitle}
                    </span>
                  </h2>
                </div>
                <div style={{ marginTop: '20px', position: 'relative', zIndex: 2 }}>
                  <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
                    {activeSidebar.description}
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
                      {activeSidebar.btnText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Help Strip */}
        {showBottom && faqContent.bottom && (
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
        )}
      </div>
    </section>
  );
}
