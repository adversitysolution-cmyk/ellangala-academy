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
import { useEnrollModal } from '../context/EnrollModalContext';
import '../assets/css/founder-profile.css';
import SEO from '../seo/SEO';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '../seo/schemas/schemaGenerators';

const mindGymPrograms = [
  {
    title: "POSITIVE MINDGYM APP",
    link: "/mindgym/app",
    img: "/assets/images/case/positive-mindgym-app.jpg",
    icon: "fas fa-mobile-alt",
    description: "Guided digital practices and Positive Psychology tools for building consistent everyday mental wellbeing habits.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "POSITIVE MINDGYM CENTRE",
    link: "/mindgym/mind-gym",
    img: "/assets/images/services/positive-mindgym-centre.png",
    icon: "fas fa-landmark",
    description: "Our dedicated physical mind training center with structured experiential workshops, reflexology, and wellness sessions.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "POSITIVE MIND TOOLKIT",
    link: "/mindgym/toolkit",
    img: "/assets/images/case/positive-mind-toolkit.png",
    icon: "fas fa-toolbox",
    description: "Simple practical techniques for calmness, mental clarity, focus, and handling challenging everyday emotional moments.",
    btnText: "Learn More",
    delay: "0.3s"
  }
];

export default function MindGymPage() {
  useUterpyPlugins();
  const { openEnrollModal } = useEnrollModal();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Positive MindGym Centre & Ecosystem | Ellangala’s Academy"
          description="Explore the Positive MindGym Centre, MindGym Mobile App, and Positive Mind Toolkit for regular mental fitness, emotional strength, and mind practice."
          canonical="/mindgym"
          structuredData={[
            generateOrganizationSchema(),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Positive MindGym', path: '/mindgym' }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title="Positive MindGym" breadcrumb="Positive MindGym" />

        {/* Start MindGym Section */}
        <section className="services-one" style={{ padding: '80px 0' }}>
          <div className="container">
            {/* Section Header */}
            <div className="section-title text-center" style={{ marginBottom: '50px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                <i className="fa fa-brain" style={{ fontSize: '12px' }}></i> MENTAL WELLNESS ARCHITECTURE
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1B2A38', marginTop: '8px' }}>
                Our Best Recommended Programs
              </h2>
              <div style={{ width: '48px', height: '2.5px', background: '#D8A54B', margin: '14px auto 0', borderRadius: '2px' }}></div>
            </div>

            {/* Cards Grid Layout */}
            <div className="row justify-content-center">
              {mindGymPrograms.map((item, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-md-6 wow animated fadeInUp" data-wow-delay={item.delay} style={{ marginBottom: '30px' }}>
                  <div className="services-one__single" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="services-one__single-img">
                      <div className="inner">
                        <img
                          src={item.img}
                          alt={item.title}
                          onError={(e) => {
                            if (item.title === 'POSITIVE MINDGYM CENTRE') e.currentTarget.src = '/assets/images/services/mindgymcentre.jpeg';
                            else if (item.title === 'POSITIVE MIND TOOLKIT') e.currentTarget.src = '/assets/images/case/positive-mind-toolkit.jpg';
                            else e.currentTarget.src = '/assets/images/case/positive-mindgym-app.jpg';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="services-one__single-img-icon">
                        <div className="services-one__single-img-icon-inner">
                          <span className={item.icon}></span>
                        </div>
                      </div>
                    </div>

                    <div className="services-one__single-content clearfix" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 20px 20px' }}>
                      <div className="services-one__single-content-inner">
                        <h2>
                          <Link to={item.link}>{item.title}</Link>
                        </h2>
                        <p>{item.description}</p>
                      </div>

                      {/* Bottom Button Action Row */}
                      <div className="card-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #F0ECE6' }}>
                        <Link
                          to={item.link}
                          style={{
                            flex: 1,
                            padding: '9px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CA8A38',
                            color: '#CA8A38',
                            fontSize: '13px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            textAlign: 'center',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#CA8A38';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#CA8A38';
                          }}
                        >
                          <span>Learn More</span>
                          <i className="fas fa-arrow-right" style={{ fontSize: '11px' }}></i>
                        </Link>

                        <button
                          type="button"
                          onClick={() => openEnrollModal(item.title)}
                          style={{
                            flex: 1,
                            padding: '9px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#D4A359',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 3px 10px rgba(212, 163, 89, 0.3)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#CA8A38';
                            e.currentTarget.style.boxShadow = '0 5px 14px rgba(202, 138, 56, 0.45)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#D4A359';
                            e.currentTarget.style.boxShadow = '0 3px 10px rgba(212, 163, 89, 0.3)';
                          }}
                        >
                          <span>Enroll Now</span>
                          <i className="fas fa-paper-plane" style={{ fontSize: '11px' }}></i>
                        </button>
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
