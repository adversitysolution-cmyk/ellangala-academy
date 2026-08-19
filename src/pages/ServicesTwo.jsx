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
import { servicesContent } from '../contents/services.content';

export default function ServicesTwo() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={servicesContent.header.title} breadcrumb={servicesContent.header.breadcrumb} />

        {/* Start Services Two */}
        <section className="services-two services-two--services2">
          <div className="container">
            <div className="row">
              {servicesContent.servicesTwo.map((item, index) => (
                <div key={index} className={`col-xl-4 col-lg-6 col-md-6 wow ${item.dir}`} data-wow-delay={item.delay} data-wow-duration="1000ms">
                  <div className="services-two__single">
                    <div className="services-two__single-img">
                      <img src={item.img} alt="" />
                      <div className="services-two__single-img-icon">
                        <div className="services-two__single-img-icon-inner">
                          <span className={item.icon}></span>
                        </div>
                      </div>
                    </div>
                    <div className="services-two__single-content clearfix">
                      <h2>
                        <Link to={item.link}>{item.title}</Link>
                      </h2>
                      <div className="btn-box">
                        <Link to={item.link}>
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

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
