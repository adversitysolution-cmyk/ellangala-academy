import React, { useState } from 'react';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import SEO from '../seo/SEO';
import { generateBreadcrumbSchema, generateDigitalResourceSchema } from '../seo/schemas/schemaGenerators';

const pdfResources = [
  {
    id: 'english',
    label: 'English',
    title: 'Bhagavad Gita for a Meaningful Life',
    subtitle: 'From Spiritual and Psychological Perspectives',
    file: '/assets/pdfs/bhagavad-gita-for-meaningful-life-english.pdf',
    fileName: 'Bhagavad-Gita-for-a-Meaningful-Life-English.pdf',
    inLanguage: 'en',
    schemaName: 'Bhagavad Gita for a Meaningful Life (English)',
    schemaDescription: 'A free reflection workbook taking readers chapter by chapter through the Bhagavad Gita, from spiritual and psychological perspectives.'
  },
  {
    id: 'kannada',
    label: 'ಕನ್ನಡ (Kannada)',
    title: '"ಅರ್ಥಪೂರ್ಣ ಜೀವನಕ್ಕಾಗಿ ಭಗವದ್ಗೀತೆ"',
    subtitle: 'ಆಧ್ಯಾತ್ಮಿಕ ಮತ್ತು ಮನೋವಿಜ್ಞಾನದ ನೆಲೆಯಲ್ಲಿ',
    file: '/assets/pdfs/bhagavad-gita-for-meaningful-life-kannada.pdf',
    fileName: 'Bhagavad-Gita-for-a-Meaningful-Life-Kannada.pdf',
    inLanguage: 'kn',
    schemaName: 'ಅರ್ಥಪೂರ್ಣ ಜೀವನಕ್ಕಾಗಿ ಭಗವದ್ಗೀತೆ (Bhagavad Gita for a Meaningful Life, Kannada)',
    schemaDescription: 'ಆಧ್ಯಾತ್ಮಿಕ ಮತ್ತು ಮನೋವಿಜ್ಞಾನದ ನೆಲೆಯಲ್ಲಿ ಭಗವದ್ಗೀತೆಯ ಅಧ್ಯಾಯವಾರು ಪ್ರತಿಬಿಂಬ ಕಾರ್ಯಪುಸ್ತಕ.'
  }
];

export default function FreeResourcesPage() {
  useUterpyPlugins();
  const [activeId, setActiveId] = useState(pdfResources[0].id);
  const activeResource = pdfResources.find((r) => r.id === activeId) || pdfResources[0];

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Bhagavad Gita for a Meaningful Life | Free Workbook | Ellangala’s Academy"
          description="Download the free Bhagavad Gita for a Meaningful Life workbook by Dr. Naveen Ellangala, available in English and Kannada, blending spiritual wisdom with psychological insight."
          canonical="/free-resources"
          structuredData={[
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Bhagavad Gita for a Meaningful Life', path: '/free-resources' }
            ]),
            ...pdfResources.map((resource) => generateDigitalResourceSchema({
              id: resource.id,
              name: resource.schemaName,
              description: resource.schemaDescription,
              pageUrl: '/free-resources',
              fileUrl: resource.file,
              inLanguage: resource.inLanguage
            }))
          ]}
        />
        <HeaderOne />
        <PageHeader title="Bhagavad Gita for a Meaningful Life" breadcrumb="Bhagavad Gita for a Meaningful Life" />

        {/* Start Free Resources Page */}
        <section style={{ paddingTop: '60px', paddingBottom: '90px', backgroundColor: '#FAF8F5' }}>
          <div className="container">
            {/* Page Section Header */}
            <div className="text-center" style={{ maxWidth: '720px', margin: '0 auto 40px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: '#FAF5EC', borderRadius: '30px', color: '#CA8A38', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>
                <i className="fa fa-gift" style={{ fontSize: '15px' }}></i>
                <span>FREE WORKBOOK</span>
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0F231B', marginBottom: '12px' }}>
                Bhagavad Gita for a Meaningful Life
              </h2>
              <p style={{ fontSize: '16px', color: '#CA8A38', fontWeight: '600', marginBottom: '12px' }}>
                From Spiritual and Psychological Perspectives
              </p>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.65' }}>
                A free, downloadable reflection workbook by Dr. Naveen Ellangala, chapter by chapter through the Bhagavad Gita, with guided self-discovery questions for a more meaningful life. Available in English and Kannada — view it below or open/download your preferred language.
              </p>
            </div>

            {/* Language Switch Tabs */}
            <div className="text-center" style={{ marginBottom: '28px' }}>
              <div style={{ display: 'inline-flex', gap: '10px', backgroundColor: '#fff', padding: '6px', borderRadius: '40px', boxShadow: '0 4px 18px rgba(0,0,0,0.08)' }}>
                {pdfResources.map((resource) => (
                  <button
                    key={resource.id}
                    type="button"
                    onClick={() => setActiveId(resource.id)}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      padding: '10px 22px',
                      borderRadius: '30px',
                      fontWeight: '700',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      backgroundColor: activeId === resource.id ? '#CA8A38' : 'transparent',
                      color: activeId === resource.id ? '#fff' : '#0F231B'
                    }}
                  >
                    {resource.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active PDF Card */}
            <div className="row justify-content-center">
              <div className="col-xl-10 col-lg-11">
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 24px',
                      borderBottom: '1px solid #F0EDE8'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          backgroundColor: '#FAF5EC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#CA8A38',
                          fontSize: '20px',
                          flexShrink: 0
                        }}
                      >
                        <i className="fa fa-file-pdf" aria-hidden="true"></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#0F231B' }}>
                          {activeResource.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748B' }}>
                          {activeResource.subtitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <a
                        href={activeResource.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '9px 18px',
                          borderRadius: '30px',
                          fontSize: '13px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          backgroundColor: '#FAF5EC',
                          color: '#CA8A38',
                          border: '1px solid #EADFC9'
                        }}
                      >
                        <i className="fa fa-external-link-alt" aria-hidden="true"></i>
                        Open in New Tab
                      </a>
                      <a
                        href={activeResource.file}
                        download={activeResource.fileName}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '9px 18px',
                          borderRadius: '30px',
                          fontSize: '13px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          backgroundColor: '#CA8A38',
                          color: '#fff'
                        }}
                      >
                        <i className="fa fa-download" aria-hidden="true"></i>
                        Download
                      </a>
                    </div>
                  </div>

                  {/* PDF Viewer */}
                  <div style={{ backgroundColor: '#525659' }}>
                    <iframe
                      key={activeResource.id}
                      src={`${activeResource.file}#view=FitH`}
                      title={activeResource.title}
                      style={{
                        width: '100%',
                        height: '85vh',
                        minHeight: '480px',
                        border: 'none',
                        display: 'block'
                      }}
                    />
                  </div>
                </div>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '16px' }}>
                  Can&apos;t see the preview above? Use &quot;Open in New Tab&quot; or &quot;Download&quot; to access the workbook.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* End Free Resources Page */}

        <FooterOne />
      </div>

      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
