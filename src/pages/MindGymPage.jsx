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
import '../assets/css/founder-profile.css';

const mindGymPrograms = [
  {
    title: "POSITIVE MINDGYM APP",
    link: "/mindgym/app",
    img: "/assets/images/case/positive-mindgym-app.jpg",
    icon: "icon-pediatrics",
    description: "Guided digital practices and Positive Psychology tools for building consistent everyday mental wellbeing habits.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "POSITIVE MINDGYM CENTRE",
    link: "/mindgym/mind-gym",
    img: "/assets/images/case/mind-gym.jpg",
    icon: "icon-valentines",
    description: "Our dedicated physical mind training center with structured experiential workshops, reflexology, and wellness sessions.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "POSITIVE MIND TOOLKIT",
    link: "/mindgym/toolkit",
    img: "/assets/images/case/positive-mind-toolkit.jpg",
    icon: "icon-disappointed-boy",
    description: "Simple practical techniques for calmness, mental clarity, focus, and handling challenging everyday emotional moments.",
    btnText: "Learn More",
    delay: "0.3s"
  }
];

export default function MindGymPage() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title="MindGym" breadcrumb="MindGym" />

        {/* Start MindGym Section */}
        <section className="services-one" style={{ paddingBottom: '100px', paddingTop: '90px' }}>
          <div className="container">
            {/* Section Header */}
            <div className="section-title text-center" style={{ marginBottom: '55px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                <i className="fa fa-star" style={{ fontSize: '12px' }}></i> SIGNATURE EXPERIENCES
              </div>
              <h2 style={{ fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)', fontSize: '38px', fontWeight: 800, color: '#021B41', textTransform: 'uppercase', margin: 0 }}>
                Our Best Recommended Programs
              </h2>
              <div style={{ width: '48px', height: '2.5px', background: '#D8A54B', margin: '14px auto 0', borderRadius: '2px' }}></div>
            </div>

            {/* Cards Grid Layout */}
            <div className="row justify-content-center">
              {mindGymPrograms.map((item, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-md-6 wow animated fadeInUp" data-wow-delay={item.delay}>
                  <div className="services-one__single">
                    <div className="services-one__single-img">
                      <div className="inner">
                        <img src={item.img} alt={item.title} />
                      </div>
                      <div className="services-one__single-img-icon">
                        <div className="services-one__single-img-icon-inner">
                          <span className={item.icon}></span>
                        </div>
                      </div>
                    </div>

                    <div className="services-one__single-content clearfix">
                      <div className="btn-box">
                        <Link to={item.link}>
                          <div className="text-box">{item.btnText}</div>
                          <div className="icon-box">
                            <span className="icon-right-arrow1"></span>
                          </div>
                        </Link>
                      </div>

                      <div className="services-one__single-content-inner">
                        <h2>
                          <Link to={item.link}>{item.title}</Link>
                        </h2>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End MindGym Section */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
