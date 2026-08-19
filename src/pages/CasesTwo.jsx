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

export default function CasesTwo() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={casesContent.header.title} breadcrumb={casesContent.header.breadcrumb} />

        {/* Start Cases Two */}
        <section className="cases-two cases-two--cases-two">
          <div className="container">
            <div className="row">
              {casesContent.casesTwo.map((item, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-md-6 wow animated fadeInUp" data-wow-delay={item.delay}>
                  <div className="cases-two__single">
                    <div className="cases-two__single-img">
                      <img src={item.img} alt="#" />
                    </div>

                    <div className="cases-two__single-content">
                      <div className="cases-two__single-content-top">
                        <h2>
                          <Link to="/case-details">{item.title}</Link>
                        </h2>
                        <p>{item.category}</p>
                      </div>

                      <div className="cases-two__single-content-bottom">
                        <div className="btn-box">
                          <Link to="/case-details">
                            <div className="text-box">Learn More</div>
                            <div className="icon-box">
                              <span className="icon-arrow-right1"></span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Cases Two */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
