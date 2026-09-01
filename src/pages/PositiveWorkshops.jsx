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

const positiveWorkshops = [
  {
    title: "Positive Psychology for a Meaningful Life",
    link: "/programs/positive-psychology-meaningful-life",
    img: "/assets/images/programs/positive-psychology-meaningful-life.png",
    icon: "fas fa-brain",
    description: "Explore strengths, wellbeing, relationships and purpose for a more meaningful everyday life.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Spiritual Psychology for Daily Life",
    link: "/programs/spiritual-psychology-purposeful-life",
    img: "/assets/images/programs/spiritual-psychology-purposeful-life.png",
    icon: "fas fa-spa",
    description: "Explore values, inner awareness, tranquility and meaning for a deeper sense of daily life purpose.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Positive Parenting",
    link: "/programs/positive-parenting",
    img: "/assets/images/programs/positive-parenting.png",
    icon: "fas fa-hands-helping",
    description: "Practical perspectives for healthier communication, emotional awareness and stronger parent-child relationships.",
    btnText: "Learn More",
    delay: "0.3s"
  },
  {
    title: "Positive Teaching",
    link: "/programs/positive-teaching",
    img: "/assets/images/programs/positive-teaching.png",
    icon: "fas fa-chalkboard-teacher",
    description: "Empowering educators with psychological tools, mindful engagement, and positive classroom dynamics.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Student Success Mindset",
    link: "/programs/student-success-mindset",
    img: "/assets/images/programs/student-success-mindset.png",
    icon: "fas fa-user-graduate",
    description: "Build focus, confidence, exam resilience, self-awareness and healthier habits for academic learning.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "The Art of Mind Training",
    link: "/programs/the-art-of-mind-training",
    img: "/assets/images/programs/the-art-of-mind-training.png",
    icon: "fas fa-brain",
    description: "Structured mental fitness practices to master attention, regulate emotions, and foster clarity.",
    btnText: "Learn More",
    delay: "0.3s"
  },
  {
    title: "Positive Psychology at the Workplace",
    link: "/programs/positive-psychology-at-the-workplace",
    img: "/assets/images/programs/positive-psychology-at-the-workplace.png",
    icon: "fas fa-briefcase",
    description: "Enhance productivity, collaborative leadership, stress management and workplace emotional wellbeing.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Bhagavad Gita for a Meaningful Life",
    link: "/programs/bhagavadgita-for-daily-life",
    img: "/assets/images/programs/bhagavadgita-for-daily-life.png",
    icon: "fas fa-book-open",
    description: "Timeless philosophical wisdom for approaching responsibility, choices, and everyday life with greater balance.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Mind & Emotional Wellness",
    link: "/programs/mind-and-emotional-wellness",
    img: "/assets/images/programs/mind-and-emotional-wellness.png",
    icon: "fas fa-heart",
    description: "Holistic psychological practices to nurture calmness, manage anxiety, and cultivate lasting inner peace.",
    btnText: "Learn More",
    delay: "0.3s"
  }
];

export default function PositiveWorkshops() {
  useUterpyPlugins();
  const { openEnrollModal } = useEnrollModal();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Positive Workshops | Ellangala’s Academy"
          description="Explore interactive Positive Psychology, spiritual psychology, parenting, teaching, and workplace workshops by Dr. Naveen Ellangala for personal and institutional growth."
          canonical="/positive-workshops"
          structuredData={[
            generateOrganizationSchema(),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Positive Workshops', path: '/positive-workshops' }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title="Positive Workshops" breadcrumb="Workshops" />

        {/* Start Positive Workshops Section */}
        <section className="services-one" style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="section-title text-center" style={{ marginBottom: '50px' }}>
              <span className="section-title__tagline" style={{ color: '#CA8A38', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px' }}>
                TRANSFORMATIVE LEARNING
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1B2A38', marginTop: '8px' }}>
                Our Positive Workshops
              </h2>
              <div style={{ width: '48px', height: '2.5px', background: '#D8A54B', margin: '14px auto 0', borderRadius: '2px' }}></div>
            </div>

            {/* Cards Grid Layout */}
            <div className="row">
              {positiveWorkshops.map((item, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-md-6 wow animated fadeInUp" data-wow-delay={item.delay} style={{ marginBottom: '30px' }}>
                  <div className="services-one__single" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                          className="btn-learn-more"
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
                          className="btn-enroll-now"
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
        {/* End Positive Workshops Section */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
