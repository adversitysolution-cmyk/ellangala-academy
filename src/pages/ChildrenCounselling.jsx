import React from 'react';
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

export default function ChildrenCounselling() {
  useUterpyPlugins();
  const content = serviceDetailsContent.childrenCounselling;

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={content.headerTitle} />

        <section className="services-details">
          <div className="container">
            <div className="row">
              <ServiceSidebar />

              <div className="col-xl-8">
                <div className="services-details__content">
                  <div className="services-details__content-text1">
                    <h2>{content.title}</h2>
                    <p className="text1">
                      {content.text1}
                    </p>
                    <div className="img-box">
                      <img src={content.image} alt="#" />
                    </div>
                    <p className="text2">
                      {content.text2}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
