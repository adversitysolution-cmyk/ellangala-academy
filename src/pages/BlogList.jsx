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

function getDateParts(dateStr) {
  if (!dateStr) return { day: '15', monthYear: 'Nov 24' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const parts = dateStr.replace(',', '').split(' ');
      if (parts.length >= 2) {
        return { day: parts[1] || '15', monthYear: `${parts[0]} ${parts[2]?.slice(-2) || '24'}` };
      }
      return { day: '15', monthYear: 'Nov 24' };
    }
    const day = d.getDate().toString().padStart(2, '0');
    const monthYear = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    return { day, monthYear };
  } catch {
    return { day: '15', monthYear: 'Nov 24' };
  }
}

export default function BlogList() {
  useUterpyPlugins();
  const [publishedPosts, setPublishedPosts] = useState(blogContent.list?.posts || []);
  const header = blogContent.list?.header || { title: 'Our Blog & Insights', breadcrumb: 'Blog' };

  useEffect(() => {
    blogService
      .getPublishedBlogs()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setPublishedPosts(res);
        } else {
          setPublishedPosts(blogContent.list?.posts || []);
        }
      })
      .catch(() => {
        setPublishedPosts(blogContent.list?.posts || []);
      });
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

        {/* Start Blog One / Blog List */}
        <section className="blog-one blog-one--blog-list" style={{ paddingTop: '90px', paddingBottom: '90px' }}>
          <div className="container">
            <div className="row gy-5">
              {publishedPosts.map((item, index) => {
                const detailUrl = `/insights/${item.slug || item.id}`;
                const dateParts = getDateParts(item.publishedAt || item.createdAt || item.date);

                return (
                  <div key={index} className="col-xl-6 col-lg-6 d-flex wow animated fadeInUp" data-wow-delay={`${0.1 * ((index % 2) + 1)}s`}>
                    <div className="blog-one__single" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                      <div className="blog-one__single-img">
                        <div className="inner">
                          <img
                            src={item.image || item.img || '/assets/images/blog/blog-mind-gym.png'}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.src = '/assets/images/blog/blog-mind-gym.png';
                            }}
                            style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                          />
                        </div>
                      </div>

                      <div className="blog-one__single-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div className="blog-one__single-content-top">
                          <div className="shape1">
                            <img src="/assets/images/shapes/blog-v1-shape1.png" alt="#" />
                          </div>
                          <div className="date-box">
                            <h2>
                              {dateParts.day} <br /> <span>{dateParts.monthYear}</span>
                            </h2>
                          </div>

                          <ul className="meta-box">
                            <li>
                              <div className="icon">
                                <span className="icon-user3"></span>
                              </div>
                              <div className="text">
                                <p>
                                  <Link to={detailUrl}>{item.author || 'Dr. Naveen Ellangala'}</Link>
                                </p>
                              </div>
                            </li>

                            <li>
                              <div className="icon">
                                <span className="icon-comment-o"></span>
                              </div>
                              <div className="text">
                                <p>
                                  <Link to={detailUrl}>{item.comments || '0 Comments'}</Link>
                                </p>
                              </div>
                            </li>
                          </ul>

                          <div className="btn-box">
                            <Link to={detailUrl}>
                              Read More <span className="icon-right-arrow1"></span>
                            </Link>
                          </div>
                        </div>

                        <div className="blog-one__single-content-bottom" style={{ flex: 1, minHeight: '120px' }}>
                          <div className="shape2">
                            <img src="/assets/images/shapes/blog-v1-shape1.png" alt="" />
                          </div>
                          <h2>
                            <Link to={detailUrl}>{item.title}</Link>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* End Blog One */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
