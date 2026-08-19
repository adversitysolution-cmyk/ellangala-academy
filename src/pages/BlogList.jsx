import React from 'react';
import { Link } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import BlogSidebar from '../components/common/BlogSidebar';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { blogContent } from '../contents/blog.content';

export default function BlogList() {
  useUterpyPlugins();
  const { header, posts } = blogContent.list;

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={header.title} breadcrumb={header.breadcrumb} />

        {/* Start Blog List Page */}
        <section className="blog-list-page">
          <div className="container">
            <div className="row">
              <div className="col-xl-8">
                <div className="blog-list-page__content">
                  {posts.map((item, index) => {
                    const detailUrl = `/blog-details?id=${item.id}`;
                    return (
                      <div key={index} className="blog-list-page__single wow animated fadeInUp" data-wow-delay="0.1s">
                        <div className="blog-list-page__single-img">
                          <img
                            src={item.img}
                            alt={item.title}
                            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                          />
                        </div>

                        <div className="blog-list-page__single-content">
                          <ul className="meta-box">
                            <li>
                              <div className="icon">
                                <span className="icon-calendar-cells"></span>
                              </div>
                              <div className="text">
                                <p>
                                  <Link to={detailUrl}>{item.date}</Link>
                                </p>
                              </div>
                            </li>
                            <li>
                              <div className="icon">
                                <span className="icon-comment-o"></span>
                              </div>
                              <div className="text">
                                <p>
                                  <Link to={detailUrl}>{item.comments}</Link>
                                </p>
                              </div>
                            </li>
                            <li>
                              <div className="icon">
                                <span className="icon-user"></span>
                              </div>
                              <div className="text">
                                <p>
                                  <Link to={detailUrl}>{item.author}</Link>
                                </p>
                              </div>
                            </li>
                          </ul>

                          <h2>
                            <Link to={detailUrl}>{item.title}</Link>
                          </h2>

                          <div className="blog-list-page__single-content-bottom">
                            <div className="blog-list-page__single-content-left">
                              <div className="btn-box">
                                <Link to={detailUrl}>
                                  Continue reading <span className="icon-right-arrow1"></span>
                                </Link>
                              </div>
                              <div className="text-box">
                                <p>
                                  <span className="icon-clock"></span> <Link to={detailUrl}> {item.readTime}</Link>
                                </p>
                              </div>
                            </div>

                            <div className="blog-list-page__single-content-right">
                              <div className="btn-box">
                                <Link to={detailUrl}>
                                  <span className="icon-share"></span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <BlogSidebar />
            </div>
          </div>
        </section>
        {/* End Blog List Page */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
