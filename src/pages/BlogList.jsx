import React, { useState, useEffect } from 'react';
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
import { blogService } from '../admin/services/blogService';
import SEO from '../seo/SEO';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '../seo/schemas/schemaGenerators';
import { blogContent } from '../contents/blog.content';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function BlogList() {
  useUterpyPlugins();
  const [publishedPosts, setPublishedPosts] = useState([]);
  const header = blogContent.list?.header || { title: 'Our Blog & Insights', breadcrumb: 'Blog' };

  useEffect(() => {
    blogService.getPublishedBlogs().then(setPublishedPosts).catch(() => {});
  }, []);

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Insights & Articles | Ellangala’s Academy"
          description="Read articles and insights on Positive Psychology, mind training, emotional fitness, parenting, and leadership by Dr. Naveen Ellangala."
          canonical="/blog"
          structuredData={[
            generateOrganizationSchema(),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Blog Insights', path: '/blog' }
            ])
          ]}
        />
        <HeaderOne />
        <PageHeader title={header.title} breadcrumb={header.breadcrumb} />

        {/* Start Blog List Grid Page */}
        <section className="blog-list-page" style={{ paddingTop: '60px', paddingBottom: '90px' }}>
          <div className="container">
            <div className="row gy-4">
              {publishedPosts.map((item, index) => {
                const detailUrl = `/insights/${item.slug || item.id}`;
                return (
                  <div key={index} className="col-xl-6 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay={`${0.1 * (index + 1)}s`}>
                    <div
                      className="blog-list-page__single"
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #ECE7DE',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div className="blog-list-page__single-img" style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.4s ease' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            backgroundColor: 'var(--uterpy-base, #CA8A38)',
                            color: '#ffffff',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '700',
                            letterSpacing: '0.4px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {item.category}
                        </div>
                      </div>

                      <div className="blog-list-page__single-content" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <ul className="meta-box" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: 0, margin: '0 0 14px', listStyle: 'none' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B' }}>
                              <span className="icon-calendar-cells" style={{ color: 'var(--uterpy-base, #CA8A38)' }}></span>
                              <Link to={detailUrl} style={{ color: '#64748B' }}>{formatDate(item.publishedAt || item.createdAt)}</Link>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B' }}>
                              <span className="icon-user" style={{ color: 'var(--uterpy-base, #CA8A38)' }}></span>
                              <Link to={detailUrl} style={{ color: '#64748B' }}>{item.author}</Link>
                            </li>
                          </ul>

                          <h2 style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.4', marginBottom: '14px' }}>
                            <Link to={detailUrl} style={{ color: '#0F231B', textDecoration: 'none' }}>
                              {item.title}
                            </Link>
                          </h2>

                          <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: '1.65', marginBottom: '20px' }}>
                            {item.excerpt}
                          </p>
                        </div>

                        <div
                          className="blog-list-page__single-content-bottom"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '16px',
                            borderTop: '1px solid #F1F5F9'
                          }}
                        >
                          <div className="btn-box">
                            <Link
                              to={detailUrl}
                              style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                color: 'var(--uterpy-base, #CA8A38)',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <span>Continue reading</span>
                              <span className="icon-right-arrow1"></span>
                            </Link>
                          </div>
                          <div style={{ fontSize: '12.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="icon-clock"></span>
                            <span>{item.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* End Blog List Grid Page */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
