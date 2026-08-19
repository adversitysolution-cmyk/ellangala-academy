import React, { useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
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

export default function BlogDetails() {
  useUterpyPlugins();
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const posts = blogContent.list.posts;
  const currentId = paramId || searchParams.get('id') || posts[0].id;
  const post = posts.find((p) => p.id === currentId || p.slug === currentId) || posts[0];
  const postDetails = post.details || posts[0].details;
  const form = blogContent.form;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setCommentSubmitted(true);
  };

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title="Blog Details" breadcrumb="Blog Details" />

        {/* Start Blog Details */}
        <section className="blog-details">
          <div className="container">
            <div className="row">
              <div className="col-xl-8">
                <div className="blog-details__content">
                  <div className="blog-list-page__single">
                    <div className="blog-list-page__single-img">
                      <img
                        src={post.img}
                        alt={post.title}
                        style={{ width: '100%', height: 'clamp(220px, 45vw, 420px)', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="blog-list-page__single-content">
                      <div className="blog-list-page__single-content-top">
                        <ul className="meta-box">
                          <li>
                            <div className="icon">
                              <span className="icon-calendar-cells"></span>
                            </div>
                            <div className="text">
                              <p>
                                <span>{post.date}</span>
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="icon">
                              <span className="icon-comment-o"></span>
                            </div>
                            <div className="text">
                              <p>
                                <span>{post.comments}</span>
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="icon">
                              <span className="icon-user"></span>
                            </div>
                            <div className="text">
                              <p>
                                <span>{post.author}</span>
                              </p>
                            </div>
                          </li>
                        </ul>

                        <div className="btn-box">
                          <a href="#" onClick={(e) => e.preventDefault()} title="Share Article">
                            <span className="icon-share"></span>
                          </a>
                        </div>
                      </div>

                      <h2>{post.title}</h2>
                    </div>
                  </div>

                  <div className="blog-details__content-text1">
                    <p className="text1">
                      {postDetails.text1}
                    </p>
                    <h2>{postDetails.heading2}</h2>
                    <p className="text2">
                      {postDetails.text2}
                    </p>
                  </div>

                  <div className="blog-details__content-text3">
                    <div className="text-box">
                      <h2>
                        "{postDetails.quote}"
                      </h2>
                    </div>
                    <div className="icon-box">
                      <span className="icon-quote-left"></span>
                    </div>
                  </div>

                  <div className="blog-details__content-text4">
                    <p className="text1">
                      {postDetails.text3}
                    </p>
                    <div className="img-box text-center" style={{ padding: '20px', backgroundColor: '#fcfaf7', borderRadius: '24px', margin: '30px 0' }}>
                      <img
                        src={postDetails.articleImage}
                        alt="Related Program Article"
                        style={{ maxHeight: '340px', width: 'auto', margin: '0 auto', borderRadius: '16px', objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  {/* Author Box */}
                  <div className="blog-details__author">
                    <div className="img-box" style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={postDetails.author.image}
                        alt={postDetails.author.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="content-box">
                      <h2>{postDetails.author.name}</h2>
                      <p>
                        {postDetails.author.bio}
                      </p>
                    </div>
                  </div>

                  {/* Comment Form (hidden as requested, easy to re-enable in future)
                  <div className="comment-form">
                    <h3 className="comment-form__title">{form.title}</h3>
                    {commentSubmitted ? (
                      <div className="alert alert-success" style={{ padding: '16px 20px', borderRadius: '8px' }}>
                        <i className="fas fa-check-circle me-2"></i> Thank you for your thoughtful comment! It will be displayed after moderation.
                      </div>
                    ) : (
                      <form onSubmit={handleCommentSubmit} className="comment-one__form">
                        <div className="row">
                          <div className="col-xl-6 col-lg-6">
                            <div className="comment-form__input-box">
                              <input type="text" placeholder={form.namePlaceholder} name="name" required />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6">
                            <div className="comment-form__input-box">
                              <input type="email" placeholder={form.emailPlaceholder} name="email" required />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-12">
                            <div className="comment-form__input-box text-message-box">
                              <textarea name="message" placeholder={form.messagePlaceholder} required></textarea>
                            </div>
                            <div className="comment-form__btn-box">
                              <button type="submit" className="thm-btn comment-form__btn">
                                <span>{form.submitBtnText}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                  */}
                </div>
              </div>

              <BlogSidebar />
            </div>
          </div>
        </section>
        {/* End Blog Details */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
