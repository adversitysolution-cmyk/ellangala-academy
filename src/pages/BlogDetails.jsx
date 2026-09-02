import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
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
import { blogService } from '../admin/services/blogService';
import Error404 from './Error404';
import { blogContent } from '../contents/blog.content';
import SEO from '../seo/SEO';
import { generateArticleSchema, generateBreadcrumbSchema } from '../seo/schemas/schemaGenerators';

export default function BlogDetails() {
  useUterpyPlugins();
  const [searchParams] = useSearchParams();
  const { id: paramId, slug: paramSlug } = useParams();
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const identifier = paramSlug || paramId || searchParams.get('id');
  const isAdminPreview = Boolean(searchParams.get('admin'));

  useEffect(() => {
    setLoading(true);
    blogService
      .getBlogBySlug(identifier, { admin: isAdminPreview })
      .then((data) => {
        if (data) {
          setPost(data);
        } else {
          const localMatch = (blogContent.list?.posts || []).find(
            (p) => p.slug === identifier || p.id === identifier || String(p.id) === String(identifier)
          );
          setPost(localMatch || null);
        }
        setLoading(false);
      })
      .catch(() => {
        const localMatch = (blogContent.list?.posts || []).find(
          (p) => p.slug === identifier || p.id === identifier || String(p.id) === String(identifier)
        );
        setPost(localMatch || null);
        setLoading(false);
      });
  }, [identifier, isAdminPreview]);

  if (loading) {
    return (
      <>
        <CustomCursor />
        <Preloader />
      </>
    );
  }

  // Return 404 if post doesn't exist or is not published
  if (!post || (post.status && post.status !== 'published' && !isAdminPreview)) {
    return <Error404 />;
  }

  const rawAuthor = post.details?.author || post.author;
  const authorObj = typeof rawAuthor === 'object' && rawAuthor !== null ? rawAuthor : {
    image: '/assets/images/team/naveen-ellangala.jpg',
    name: typeof rawAuthor === 'string' ? rawAuthor : 'Dr. Naveen Ellangala',
    bio: 'Founder and Chief Mentor at Ellangala Academy.'
  };

  const postDetails = {
    headerTitle: post.details?.headerTitle || post.title,
    category: post.details?.category || post.category || 'Positive Psychology',
    date: post.details?.date || (post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Nov 15, 2024'),
    comments: post.details?.comments || '0 Comments',
    author: authorObj,
    title: post.details?.title || post.title,
    text1: post.details?.text1 || post.content || post.excerpt,
    heading2: post.details?.heading2 || '',
    text2: post.details?.text2 || '',
    text3: post.details?.text3 || '',
    quote: post.details?.quote || post.excerpt,
    articleImage: post.details?.articleImage || post.image || post.img || '/assets/images/blog/blog-mind-gym.png',
  };

  const form = blogContent?.form || {
    title: 'Leave a Comment',
    namePlaceholder: 'Your Name',
    emailPlaceholder: 'Email Address',
    messagePlaceholder: 'Write a Message',
    submitBtnText: 'Submit Comment'
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setCommentSubmitted(true);
  };

  const seoTitle = post.seo?.title || `${post.title} | Ellangala’s Academy`;
  const seoDesc = post.seo?.description || post.excerpt || post.title;
  const seoImg = post.seo?.image || post.image;
  const isNoindex = Boolean(post.seo?.noindex);

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title={seoTitle}
          description={seoDesc}
          canonical={`/insights/${post.slug || post.id}`}
          image={seoImg}
          type="article"
          noindex={isNoindex}
          structuredData={[
            generateArticleSchema(post),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Insights', path: '/insights' },
              { name: post.title, path: `/insights/${post.slug || post.id}` }
            ])
          ]}
        />
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
                        src={post.image || post.img || postDetails.articleImage || '/assets/images/blog/blog-mind-gym.png'}
                        alt={post.title}
                        onError={(e) => { e.currentTarget.src = '/assets/images/blog/blog-mind-gym.png'; }}
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
                                <span>{postDetails.date}</span>
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="icon">
                              <span className="icon-comment-o"></span>
                            </div>
                            <div className="text">
                              <p>
                                <span>{postDetails.comments}</span>
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="icon">
                              <span className="icon-user"></span>
                            </div>
                            <div className="text">
                              <p>
                                <span>{postDetails.author.name}</span>
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
                    <div
                      className="text1"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postDetails.text1 || '') }}
                    />
                    {postDetails.heading2 && <h2>{postDetails.heading2}</h2>}
                    {postDetails.text2 && (
                      <p className="text2">
                        {postDetails.text2}
                      </p>
                    )}
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

              <BlogSidebar
                currentSlug={post.slug || identifier}
                currentId={post.id || identifier}
                currentCategory={post.category || postDetails.category}
              />
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
