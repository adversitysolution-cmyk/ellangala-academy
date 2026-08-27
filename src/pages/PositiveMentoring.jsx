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

const positiveMentoring = [
  {
    title: "Student Mentoring",
    link: "/mentoring/student-mentoring",
    img: "/assets/images/case/case-v1-img6.jpg",
    icon: "fas fa-user-graduate",
    description: "Personalized 1-on-1 guidance for students to build study focus, emotional resilience, self-discipline, and academic confidence.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Parent Mentoring",
    link: "/mentoring/parent-mentoring",
    img: "/assets/images/case/case-v1-img7.jpg",
    icon: "fas fa-hands-helping",
    description: "Individualized counseling and parental guidance to resolve communication barriers and foster loving family environments.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Teacher Mentoring",
    link: "/mentoring/teacher-mentoring",
    img: "/assets/images/case/case-v1-img8.jpg",
    icon: "fas fa-chalkboard-teacher",
    description: "Empowering educators with psychological strategies, empathetic mentoring, stress management, and inspirational teaching tools.",
    btnText: "Learn More",
    delay: "0.3s"
  },
  {
    title: "Personal Mentoring",
    link: "/mentoring/personal-mentoring",
    img: "/assets/images/case/case-v1-img9.jpg",
    icon: "fas fa-user-check",
    description: "Direct one-on-one psychological mentoring tailored to help individuals overcome personal obstacles and thrive.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Life Mentoring",
    link: "/mentoring/life-mentoring",
    img: "/assets/images/case/case-v1-img10.jpg",
    icon: "fas fa-seedling",
    description: "Holistic life coaching integrating positive psychology, daily balance, emotional health, and conscious lifestyle habits.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Career Mentoring",
    link: "/mentoring/career-mentoring",
    img: "/assets/images/case/case-v1-img11.jpg",
    icon: "fas fa-briefcase",
    description: "Strategic professional mentoring to discover strengths, navigate career transitions, and build workplace leadership.",
    btnText: "Learn More",
    delay: "0.3s"
  },
  {
    title: "Purpose Mentoring",
    link: "/mentoring/purpose-mentoring",
    img: "/assets/images/case/case-v1-img12.jpg",
    icon: "fas fa-compass",
    description: "Guided self-inquiry to uncover your authentic calling, deeper core values, and lasting fulfillment in life.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Mindset Mentoring",
    link: "/mentoring/mindset-mentoring",
    img: "/assets/images/case/case-v1-img1.jpg",
    icon: "fas fa-brain",
    description: "Cognitive reframing and mind conditioning to eliminate self-limiting beliefs and cultivate an empowering growth mindset.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Spiritual Mentoring",
    link: "/mentoring/spiritual-mentoring",
    img: "/assets/images/case/case-v1-img2.jpg",
    icon: "fas fa-spa",
    description: "Inner exploration rooted in Indian wisdom, reflective philosophy, meditation, and conscious spiritual psychology.",
    btnText: "Learn More",
    delay: "0.3s"
  }
];

export default function PositiveMentoring() {
  useUterpyPlugins();
  const { openEnrollModal } = useEnrollModal();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Positive Mentoring | Ellangala’s Academy"
          description="Tailored 1-on-1 Positive Mentoring pathways for students, parents, educators, and working professionals by Dr. Naveen Ellangala."
          canonical="/positive-mentoring"
          structuredData={[
            generateOrganizationSchema(),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Positive Mentoring', path: '/positive-mentoring' }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title="Positive Mentoring" breadcrumb="Mentoring" />

        {/* Start Positive Mentoring Section */}
        <section className="services-one" style={{ padding: '80px 0' }}>
          <div className="container">
            {/* Section Header */}
            <div className="section-title text-center" style={{ marginBottom: '50px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                <i className="fa fa-hands-helping" style={{ fontSize: '12px' }}></i> GUIDED PERSONAL GROWTH
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1B2A38', marginTop: '8px' }}>
                POSITIVE MENTORING
              </h2>
              <div style={{ width: '48px', height: '2.5px', background: '#D8A54B', margin: '14px auto 0', borderRadius: '2px' }}></div>
            </div>

            {/* Cards Grid Layout */}
            <div className="row">
              {positiveMentoring.map((item, index) => (
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
        {/* End Positive Mentoring Section */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
