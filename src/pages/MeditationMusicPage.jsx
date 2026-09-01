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

const videoUrls = [
  "https://www.youtube.com/embed/HZwvTXi-aYA",
  "https://www.youtube.com/embed/4sap0ChHOpM",
  "https://www.youtube.com/embed/GjoJzPPa1_4"
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
                Immerse yourself in guided meditation sessions and calming soundscapes created by Dr. Naveen Ellangala for emotional balance.
              </p>
            </div>

            {/* Embedded YouTube Videos Grid */}
            <div className="row gy-4">
              {videoUrls.map((url, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-md-6">
                  <div
                    style={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
                      backgroundColor: '#000000'
                    }}
                  >
                    <iframe
                      src={url}
                      title={`Meditation Video ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
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
