import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import ServiceSidebar from '../components/common/ServiceSidebar';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { serviceDetailsContent } from '../contents/serviceDetails.content';
import { programsData } from '../contents/programsData.content';
import ProgramDetailPage from '../components/common/ProgramDetailPage';
import PositiveMindGymAppPage from './PositiveMindGymAppPage';

export default function ServicesDetails({ serviceKey: propKey }) {
  useUterpyPlugins();
  const { slug } = useParams();
  const location = useLocation();

  // If this is the Positive MindGym App detailed page, render the dedicated app redesign page
  if (propKey === 'app' || slug === 'app' || slug === 'positive-mindgym-app' || location.pathname === '/mindgym/app') {
    return <PositiveMindGymAppPage />;
  }

  // 1. Check if slug or propKey exists in centralized programsData
  const targetKey = propKey || slug;
  let currentProgramData = null;

  if (targetKey && programsData[targetKey]) {
    currentProgramData = programsData[targetKey];
  } else {
    // Find by matching pathname or slug key
    const found = Object.values(programsData).find(
      (item) => item.slug === targetKey || location.pathname.endsWith('/' + item.slug) || location.pathname.includes('/' + item.slug)
    );
    if (found) currentProgramData = found;
  }

  // If matched in programsData, render the unified ProgramDetailPage component
  if (currentProgramData) {
    return <ProgramDetailPage data={currentProgramData} />;
  }

  // 2. Fallback to existing serviceDetailsContent for generic services or counselling
  let content = null;
  if (propKey && serviceDetailsContent[propKey]) {
    content = serviceDetailsContent[propKey];
  } else if (slug && serviceDetailsContent[slug]) {
    content = serviceDetailsContent[slug];
  } else {
    const entry = Object.values(serviceDetailsContent).find(
      (item) => item.path === location.pathname
    );
    content = entry || serviceDetailsContent['mind-gym'] || serviceDetailsContent['personal-counselling'];
  }

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={content.headerTitle || content.title} />

        {/* Start Services Details */}
        <section className="services-details">
          <div className="container">
            <div className="row">
              <ServiceSidebar currentProgram={content.title} />

              <div className="col-xl-8">
                <div className="services-details__content">
                  <div className="services-details__content-text1">
                    <h2>{content.title}</h2>
                    {content.tagline && (
                      <p className="tagline" style={{ fontSize: '18px', fontWeight: '500', color: 'var(--uterpy-base)', marginBottom: '15px' }}>
                        {content.tagline}
                      </p>
                    )}
                    {content.text1 && <p className="text1">{content.text1}</p>}
                    {content.image && (
                      <div className="img-box" style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '36px', backgroundColor: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={content.image} alt={content.title} style={{ width: '100%', maxHeight: '560px', objectFit: 'contain', display: 'block' }} />
                      </div>
                    )}
                    {content.text2 && <p className="text2">{content.text2}</p>}
                  </div>

                  {(content.sectionTwoTitle || content.sectionTwoText1) && (
                    <div className="services-details__content-text2">
                      {content.sectionTwoTitle && <h2>{content.sectionTwoTitle}</h2>}
                      {content.sectionTwoText1 && <p className="text1">{content.sectionTwoText1}</p>}
                      {content.sectionTwoText2 && <p className="text2">{content.sectionTwoText2}</p>}
                    </div>
                  )}

                  {(content.sectionThreeTitle || content.sectionThreeText) && (
                    <div className="services-details__content-text3">
                      {content.sectionThreeTitle && <h2>{content.sectionThreeTitle}</h2>}
                      {content.sectionThreeText && <p className="text1">{content.sectionThreeText}</p>}
                    </div>
                  )}

                  {((content.reasonsLeft && content.reasonsLeft.length > 0) || (content.reasonsRight && content.reasonsRight.length > 0)) && (
                    <div className="services-details__content-text4">
                      <div className="row">
                        {content.reasonsLeft && (
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="single-list-box">
                              <ul className="clearfix">
                                {content.reasonsLeft.map((r, idx) => (
                                  <li key={idx}>
                                    <p>
                                      <span className="icon-tag-chevron"></span> {r}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {content.reasonsRight && (
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="single-list-box">
                              <ul className="clearfix">
                                {content.reasonsRight.map((r, idx) => (
                                  <li key={idx}>
                                    <p>
                                      <span className="icon-tag-chevron"></span> {r}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {content.features && content.features.length > 0 && (
                    <div className="services-details__content-text5">
                      <div className="row">
                        {content.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className={
                              content.features.length === 3
                                ? "col-xl-4 col-lg-4 col-md-6 col-sm-12"
                                : content.features.length >= 4
                                ? "col-xl-3 col-lg-3 col-md-6 col-sm-12"
                                : "col-xl-6 col-lg-6 col-md-6"
                            }
                            style={{ marginBottom: '20px' }}
                          >
                            <div
                              className="services-details__content-text5-single"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: content.features.length === 3 ? '22px 18px' : '30px',
                                minHeight: '100%',
                              }}
                            >
                              <div className="icon-box" style={{ flexShrink: 0 }}>
                                <span
                                  className={feat.icon}
                                  style={content.features.length === 3 ? { fontSize: '42px' } : undefined}
                                ></span>
                              </div>
                              <div className="title-box" style={{ marginLeft: content.features.length === 3 ? '4px' : '16px' }}>
                                <h2
                                  style={
                                    content.features.length === 3
                                      ? {
                                          fontSize: '17px',
                                          lineHeight: '23px',
                                          fontWeight: '700',
                                          margin: 0,
                                        }
                                      : undefined
                                  }
                                >
                                  {feat.title.split('\n').map((line, lIdx, arr) => (
                                    <React.Fragment key={lIdx}>
                                      {line}
                                      {lIdx < arr.length - 1 && <br />}
                                    </React.Fragment>
                                  ))}
                                </h2>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Services Details */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
