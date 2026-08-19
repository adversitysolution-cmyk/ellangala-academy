import React from 'react';
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
import { casesContent } from '../contents/cases.content';

export default function CasesOne() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={casesContent.header.title} breadcrumb={casesContent.header.breadcrumb} />

        {/* Start Case One */}
        <section className="case-one case-one--case">
          <div className="container">
            <div className="row">
              {casesContent.casesOne.map((item, index) => (
                <div key={index} className="col-xl-3 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay={item.delay}>
                  <div className="case-one__single">
                    <div className="case-one__single-img">
                      <img src={item.img} alt="#" />
                    </div>

                    <div className="case-one__single-content">
                      <div className="icon-box">
                        <span className="icon-brain-svgrepo"></span>
                      </div>
                      <div className="btn-box">
                        <Link to="/case-details">
                          <span className="icon-arrow-right1"></span>
                        </Link>
                      </div>

                      <div className="case-one__single-content-inner">
                        <h2>
                          <Link to="/case-details">{item.title}</Link>
                        </h2>
                        <p>
                          Lorem ipsum dolor sit amet, magna tellus <br />
                          fringilla eleifend. adipiscing elit massa{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Case One */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
