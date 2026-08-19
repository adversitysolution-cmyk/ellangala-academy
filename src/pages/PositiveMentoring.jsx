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

const positiveMentoring = [
  {
    title: "Student Mentoring",
    link: "/mentoring/student-mentoring",
    img: "/assets/images/case/case-v1-img6.jpg",
    icon: "icon-aim-target-arrow",
    description: "Personalized 1-on-1 guidance for students to build study focus, emotional resilience, self-discipline, and academic confidence.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Parent Mentoring",
    link: "/mentoring/parent-mentoring",
    img: "/assets/images/case/case-v1-img7.jpg",
    icon: "icon-support",
    description: "Individualized counseling and parental guidance to resolve communication barriers and foster loving family environments.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Teacher Mentoring",
    link: "/mentoring/teacher-mentoring",
    img: "/assets/images/case/case-v1-img8.jpg",
    icon: "icon-award-badge-quality",
    description: "Empowering educators with psychological strategies, empathetic mentoring, stress management, and inspirational teaching tools.",
    btnText: "Learn More",
    delay: "0.3s"
  },
  {
    title: "Personal Mentoring",
    link: "/mentoring/personal-mentoring",
    img: "/assets/images/case/case-v1-img9.jpg",
    icon: "icon-checkup-svgrepo",
    description: "Direct one-on-one psychological mentoring tailored to help individuals overcome personal obstacles and thrive.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Life Mentoring",
    link: "/mentoring/life-mentoring",
    img: "/assets/images/case/case-v1-img10.jpg",
    icon: "icon-cel-rings-love",
    description: "Holistic life coaching integrating positive psychology, daily balance, emotional health, and conscious lifestyle habits.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Career Mentoring",
    link: "/mentoring/career-mentoring",
    img: "/assets/images/case/case-v1-img11.jpg",
    icon: "icon-idea",
    description: "Strategic professional mentoring to discover strengths, navigate career transitions, and build workplace leadership.",
    btnText: "Learn More",
    delay: "0.3s"
  },
  {
    title: "Purpose Mentoring",
    link: "/mentoring/purpose-mentoring",
    img: "/assets/images/case/case-v1-img12.jpg",
    icon: "icon-valentines",
    description: "Guided self-inquiry to uncover your authentic calling, deeper core values, and lasting fulfillment in life.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Mindset Mentoring",
    link: "/mentoring/mindset-mentoring",
    img: "/assets/images/case/case-v1-img1.jpg",
    icon: "icon-brain-svgrepo",
    description: "Cognitive reframing and mind conditioning to eliminate self-limiting beliefs and cultivate an empowering growth mindset.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Spiritual Mentoring",
    link: "/mentoring/spiritual-mentoring",
    img: "/assets/images/case/case-v1-img2.jpg",
    icon: "icon-disappointed-boy",
    description: "Inner exploration rooted in Indian wisdom, reflective philosophy, meditation, and conscious spiritual psychology.",
    btnText: "Learn More",
    delay: "0.3s"
  }
];

export default function PositiveMentoring() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title="Positive Mentoring" breadcrumb="Mentoring" />

        {/* Start Positive Mentoring Section */}
        <section className="services-one" style={{ paddingBottom: '90px', paddingTop: '90px' }}>
          <div className="container">
            {/* Section Header */}
            <div className="section-title text-center" style={{ marginBottom: '55px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                <i className="fa fa-hands-helping" style={{ fontSize: '12px' }}></i> GUIDED PERSONAL GROWTH
              </div>
              <h2 style={{ fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)', fontSize: '38px', fontWeight: 800, color: '#021B41', textTransform: 'uppercase', margin: 0 }}>
                POSITIVE MENTORING
              </h2>
              <div style={{ width: '48px', height: '2.5px', background: '#D8A54B', margin: '14px auto 0', borderRadius: '2px' }}></div>
            </div>

            {/* Cards Grid Layout */}
            <div className="row">
              {positiveMentoring.map((item, index) => (
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
        {/* End Positive Mentoring Section */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
