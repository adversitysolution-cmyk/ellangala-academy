import React from 'react';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';

const meditationTracks = [
  {
    id: "HZwvTXi-aYA",
    title: "Guided Meditation & Mindfulness Soundscape",
    tag: "Meditation Music",
    author: "Dr. Naveen Ellangala",
    embedUrl: "https://www.youtube.com/embed/HZwvTXi-aYA?enablejsapi=1&rel=0&modestbranding=1"
  },
  {
    id: "4sap0ChHOpM",
    title: "Deep Relaxation & Emotional Calm Melody",
    tag: "Mind Soundscape",
    author: "Dr. Naveen Ellangala",
    embedUrl: "https://www.youtube.com/embed/4sap0ChHOpM?enablejsapi=1&rel=0&modestbranding=1"
  },
  {
    id: "GjoJzPPa1_4",
    title: "Inner Harmony & Positive Energy Session",
    tag: "Calming Music",
    author: "Dr. Naveen Ellangala",
    embedUrl: "https://www.youtube.com/embed/GjoJzPPa1_4?enablejsapi=1&rel=0&modestbranding=1"
  }
];

export default function MeditationMusicPage() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title="Meditation & Music" breadcrumb="Meditation & Music" />

        {/* Start Meditation & Music Page */}
        <section style={{ paddingTop: '60px', paddingBottom: '90px', backgroundColor: '#FAF8F5' }}>
          <div className="container">
            {/* Page Section Header */}
            <div className="text-center" style={{ maxWidth: '680px', margin: '0 auto 45px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: '#FAF5EC', borderRadius: '30px', color: '#CA8A38', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>
                <i className="fa fa-music" style={{ fontSize: '15px' }}></i>
                <span>GUIDED MEDITATION &amp; SOUNDSCAPES</span>
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0F231B', marginBottom: '12px' }}>
                Guided Meditation &amp; Mindful Music
              </h2>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.65' }}>
                Immerse yourself in guided meditation sessions and calming soundscapes created by Dr. Naveen Ellangala for emotional balance, relaxation, and inner clarity.
              </p>
            </div>

            {/* Embedded YouTube Videos Grid */}
            <div className="row gy-4">
              {meditationTracks.map((item, index) => (
                <div key={item.id || index} className="col-xl-4 col-lg-4 col-md-6">
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                      border: '1px solid #F1ECE3',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        backgroundColor: '#000000'
                      }}
                    >
                      <iframe
                        src={item.embedUrl}
                        title={item.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#CA8A38', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {item.tag}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                          <i className="fa fa-play-circle" style={{ marginRight: '4px', color: '#CA8A38' }}></i> Play Inside
                        </span>
                      </div>
                      <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#0F231B', marginBottom: '6px', lineHeight: '1.4' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                        {item.author}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Meditation & Music Page */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
