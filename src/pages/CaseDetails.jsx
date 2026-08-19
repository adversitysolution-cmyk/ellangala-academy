import React from 'react';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { casesContent } from '../contents/cases.content';

export default function CaseDetails() {
  useUterpyPlugins();
  const details = casesContent.caseDetails;

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={details.header.title} breadcrumb={details.header.breadcrumb} />

        {/* Start Case Details */}
        <section className="case-details">
          <div className="container">
            <div className="row">
              {/* Start Sidebar */}
              <div className="col-xl-4">
                <div className="sidebar">
                  <div className="sidebar__single sidebar__project wow animated fadeInUp" data-wow-delay="0.1s">
                    <div className="title-box">
                      <h2>{details.projectInfo.title}</h2>
                    </div>
                    <div className="sidebar__project-box">
                      <ul className="sidebar__project-box-list list-unstyled clearfix">
                        <li>
                          <div className="inner">
                            <div className="icon-box">
                              <span className="icon-user2"></span>
                            </div>
                            <div className="text-box">
                              <p>{details.projectInfo.clientLabel}</p>
                              <h3>{details.projectInfo.clientName}</h3>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="inner">
                            <div className="icon-box style2">
                              <span className="icon-clock-svgrepo2"></span>
                            </div>
                            <div className="text-box">
                              <p>{details.projectInfo.dateLabel}</p>
                              <h3>{details.projectInfo.dateValue}</h3>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="inner">
                            <div className="icon-box style2 rotate">
                              <span className="icon-tag-chevron"></span>
                            </div>
                            <div className="text-box">
                              <p>{details.projectInfo.categoryLabel}</p>
                              <h3>{details.projectInfo.categoryValue}</h3>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="sidebar__single sidebar__contact wow animated fadeInUp" data-wow-delay="0.3s">
                    <div
                      className="sidebar__contact-bg"
                      style={{ backgroundImage: 'url(/assets/images/services/services-details-img1.jpg)' }}
                    ></div>
                    <div className="sidebar__contact-box text-center">
                      <div className="icon-box">
                        <span className="icon-personal-page"></span>
                      </div>
                      <div className="title">
                        <h2>
                          Book Your <br />
                          Appointment Now
                        </h2>
                      </div>
                      <div className="text-box">
                        <p>feel free to call </p>
                        <h2>
                          <a href="tel:8822116161">(88) 22 11-6161</a>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Sidebar */}

              {/* Start Case Details Content */}
              <div className="col-xl-8">
                <div className="case-details__content">
                  <div className="case-details__content-text1">
                    <div className="img-box">
                      <img src={details.mainImage} alt="#" />
                    </div>
                    <h2>{details.title}</h2>
                    <p className="text1">
                      {details.text1}
                    </p>

                    <p className="text2">
                      {details.text2}
                    </p>
                  </div>

                  <div className="case-details__content-text2">
                    <h2>{details.sectionTwoTitle}</h2>
                    <p className="text1">
                      {details.sectionTwoText}
                    </p>
                  </div>

                  <div className="case-details__content-text3">
                    <div className="row">
                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="case-details__content-text3-img">
                          <img src={details.outcomeImage} alt="#" />
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="case-details__content-text3-content">
                          <h2>{details.outcomeTitle}</h2>
                          <p>
                            {details.outcomeText}
                          </p>
                          <ul className="case-details__content-text3-content-list clearfix">
                            {details.outcomePoints.map((pt, idx) => (
                              <li key={idx}>
                                <p>{pt}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="case-details__content-text4">
                    <div className="case-details__content-text4-top">
                      <div className="icon-box">
                        <span className="icon-child-cognition"></span>
                      </div>
                      <div className="title-box">
                        <h2>{details.helpTitle}</h2>
                      </div>
                    </div>
                    <p>
                      {details.helpText}
                    </p>
                  </div>

                  <div className="case-details__content-text5">
                    <p>
                      {details.confidentialText}
                    </p>
                  </div>
                </div>
              </div>
              {/* End Case Details Content */}
            </div>
          </div>
        </section>
        {/* End Case Details */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
