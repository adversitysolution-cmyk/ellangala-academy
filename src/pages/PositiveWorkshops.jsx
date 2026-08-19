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

const positiveWorkshops = [
  {
    title: "Positive Psychology for a Meaningful Life",
    link: "/programs/positive-psychology-meaningful-life",
    img: "/assets/images/case/positive-psychology-meaningful-life.jpg",
    icon: "icon-brain-svgrepo",
    description: "Explore strengths, wellbeing, relationships and purpose for a more meaningful everyday life.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Spiritual Psychology for Daily Life",
    link: "/programs/spiritual-psychology-purposeful-life",
    img: "/assets/images/case/case-v1-img1.jpg",
    icon: "icon-idea",
    description: "Explore values, inner awareness, tranquility and meaning for a deeper sense of daily life purpose.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Positive Parenting",
    link: "/programs/positive-parenting",
    img: "/assets/images/case/case-v1-img3.jpg",
    icon: "icon-support",
    description: "Practical perspectives for healthier communication, emotional awareness and stronger parent-child relationships.",
    btnText: "Learn More",
    delay: "0.3s"
  },
  {
    title: "Positive Teaching",
    link: "/programs/positive-teaching",
    img: "/assets/images/case/case-v1-img4.jpg",
    icon: "icon-award-badge-quality",
    description: "Empowering educators with psychological tools, mindful engagement, and positive classroom dynamics.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Student Success Mindset",
    link: "/programs/student-success-mindset",
    img: "/assets/images/case/case-v1-img5.jpg",
    icon: "icon-aim-target-arrow",
    description: "Build focus, confidence, exam resilience, self-awareness and healthier habits for academic learning.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "The Art of Mind Training",
    link: "/programs/the-art-of-mind-training",
    img: "/assets/images/case/mind-gym.jpg",
    icon: "icon-valentines",
    description: "Structured mental fitness practices to master attention, regulate emotions, and foster clarity.",
    btnText: "Learn More",
    delay: "0.3s"
  },
  {
    title: "Positive Psychology at the Workplace",
    link: "/programs/positive-psychology-at-the-workplace",
    img: "/assets/images/case/case-v1-img2.jpg",
    icon: "icon-checkup-svgrepo",
    description: "Enhance productivity, collaborative leadership, stress management and workplace emotional wellbeing.",
    btnText: "Learn More",
    delay: "0.1s"
  },
  {
    title: "Bhagavad Gita for a Meaningful Life",
    link: "/programs/bhagavadgita-for-daily-life",
    img: "/assets/images/case/indian-culture-and-science.jpg",
    icon: "icon-cel-rings-love",
    description: "Timeless philosophical wisdom for approaching responsibility, choices, and everyday life with greater balance.",
    btnText: "Learn More",
    delay: "0.2s"
  },
  {
    title: "Mind & Emotional Wellness",
    link: "/programs/mind-and-emotional-wellness",
    img: "/assets/images/case/positive-mind-toolkit.jpg",
    icon: "icon-disappointed-boy",
    description: "Holistic psychological practices to nurture calmness, manage anxiety, and cultivate lasting inner peace.",
    btnText: "Learn More",
    delay: "0.3s"
  }
];

export default function PositiveWorkshops() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title="Positive Workshops" breadcrumb="Workshops" />

        {/* Start Positive Workshops Section */}
        <section className="services-one" style={{ paddingBottom: '90px', paddingTop: '90px' }}>
          <div className="container">
            {/* Section Header */}
            <div className="section-title text-center" style={{ marginBottom: '55px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                <i className="fa fa-spa" style={{ fontSize: '12px' }}></i> TRANSFORMATIONAL LEARNING
              </div>
              <h2 style={{ fontFamily: 'var(--fp-font-serif, "Playfair Display", Georgia, serif)', fontSize: '38px', fontWeight: 800, color: '#021B41', textTransform: 'uppercase', margin: 0 }}>
                POSITIVE WORKSHOPS
              </h2>
              <div style={{ width: '48px', height: '2.5px', background: '#D8A54B', margin: '14px auto 0', borderRadius: '2px' }}></div>
            </div>

            {/* Cards Grid Layout */}
            <div className="row">
              {positiveWorkshops.map((item, index) => (
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
        {/* End Positive Workshops Section */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
