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
import { error404Content } from '../contents/error404.content';

export default function Error404() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={error404Content.header.title} breadcrumb={error404Content.header.breadcrumb} />

        {/* Start Error Page */}
        <section className="error-page">
          <div className="shape1">
            <img src="/assets/images/shapes/error-page-shape1.png" alt="#" />
          </div>
          <div className="shape2">
            <img src="/assets/images/shapes/error-page-shape2.png" alt="#" />
          </div>
          <div className="shape3">
            <img src="/assets/images/shapes/error-page-shape3.png" alt="#" />
          </div>
          <div className="shape4">
            <img src="/assets/images/shapes/error-page-shape4.png" alt="#" />
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="error-page__inner text-center">
                  <div className="error-page__content-box">
                    <h2>{error404Content.errorCode}</h2>
                    <h3>{error404Content.errorTitle}</h3>
                    <p>{error404Content.errorDescription}</p>
                  </div>
                  <div className="error-page__search">
                    <form onSubmit={(e) => e.preventDefault()} className="error-page__search-form">
                      <input type="search" placeholder={error404Content.searchPlaceholder} />
                      <button type="submit">
                        <i className="icon-search"></i>
                      </button>
                    </form>
                  </div>
                  <div className="error-page__btn">
                    <Link to={error404Content.backHomeLink} className="thm-btn">
                      {error404Content.backHomeText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Error Page */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
