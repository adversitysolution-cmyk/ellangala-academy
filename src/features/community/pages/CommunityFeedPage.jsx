import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import HeaderOne from '../../../components/layout/HeaderOne';
import FooterOne from '../../../components/layout/FooterOne';
import Preloader from '../../../components/layout/Preloader';
import CustomCursor from '../../../components/layout/CustomCursor';
import MobileNav from '../../../components/layout/MobileNav';
import SearchPopup from '../../../components/layout/SearchPopup';
import ScrollToTop from '../../../components/layout/ScrollToTop';
import SEO from '../../../seo/SEO';
import { useUterpyPlugins } from '../../../hooks/useUterpyPlugins';
import { communityService } from '../services/communityService';
import { CommunityAuthProvider, useCommunityAuth } from '../context/CommunityAuthContext';

// Community Components
import CommunitySidebar from '../components/CommunitySidebar';
import CommunityWelcomeBanner from '../components/CommunityWelcomeBanner';
import CommunityFeaturedWorkshop from '../components/CommunityFeaturedWorkshop';
import CommunityFeedFilters from '../components/CommunityFeedFilters';
import CommunityPostCard from '../components/CommunityPostCard';
import CommunityRightSidebar from '../components/CommunityRightSidebar';
import CommunityAuthModal from '../components/CommunityAuthModal';
import CommunityMyLearningView from '../components/CommunityMyLearningView';
import CommunityWorkshopsView from '../components/CommunityWorkshopsView';

// Styles
import '../styles/community.css';
import { Sparkles, RefreshCw, AlertCircle, MessageSquare, ArrowLeft, Bookmark } from 'lucide-react';

function CommunityFeedPageContent() {
  useUterpyPlugins();
  const { id: singlePostId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useCommunityAuth();

  const [posts, setPosts] = useState([]);
  const [singlePost, setSinglePost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sidebarData, setSidebarData] = useState({ upcomingEvents: [], recommendedCourses: [] });

  const [currentView, setCurrentView] = useState('feed'); // 'feed' | 'learning' | 'saved' | 'workshops'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('latest'); // 'latest' | 'popular' | 'saved'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // Load initial categories
  useEffect(() => {
    communityService.getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Fetch rule-based sidebar data whenever selected channel/category changes
  useEffect(() => {
    communityService.getSidebarData(selectedCategory)
      .then(setSidebarData)
      .catch(() => {});
  }, [selectedCategory]);

  // Handle single post view vs general feed
  useEffect(() => {
    if (singlePostId) {
      setCurrentView('feed');
      setLoading(true);
      setError('');
      communityService.getPostById(singlePostId)
        .then(post => {
          if (!post) {
            setError('This community post could not be found or has not been published yet.');
            setPosts([]);
            setSinglePost(null);
          } else {
            setSinglePost(post);
            setPosts([post]);
            setTotalPosts(1);
          }
        })
        .catch(err => {
          setError(err.message || 'Discussion post could not be loaded.');
          setPosts([]);
          setSinglePost(null);
        })
        .finally(() => setLoading(false));
    } else {
      setSinglePost(null);
      fetchPosts(1, false);
    }
  }, [singlePostId, selectedCategory, activeFilter, isAuthenticated]);

  // Load posts for general feed
  const fetchPosts = async (targetPage = 1, append = false) => {
    if (singlePostId) return;

    if (targetPage === 1) setLoading(true);
    else setLoadingMore(true);
    setError('');

    try {
      const res = await communityService.getPosts({
        category: selectedCategory,
        filter: activeFilter,
        page: targetPage,
        limit: 10
      });

      const fetched = res.posts || [];
      if (append) {
        setPosts(prev => [...prev, ...fetched]);
      } else {
        setPosts(fetched);
      }

      setPage(targetPage);
      setTotalPosts(res.pagination?.total || 0);
      setHasMore(targetPage < (res.pagination?.totalPages || 1));
    } catch (err) {
      setError(err.message || 'Unable to connect to community feed.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !singlePostId) {
      fetchPosts(page + 1, true);
    }
  };

  // Next upcoming masterclass
  const nextWorkshop = sidebarData.upcomingEvents?.[0] || null;

  // Dynamic SEO metadata
  const seoTitle = singlePost
    ? `${singlePost.title} | Ellangala Community`
    : 'Ellangala Community Feed | Daily Mind Training & Wisdom';
  const seoDescription = singlePost
    ? singlePost.content?.slice(0, 160)
    : "Join Dr. Naveen Ellangala's Positive Psychology and MindGym community feed. Explore daily reflections, workshop announcements, character strengths, and peer discussions.";
  const seoCanonical = singlePost
    ? `/community/posts/${singlePost.id}`
    : '/community';
  const seoImage = singlePost?.mediaUrls?.[0]?.mediaUrl || null;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={seoCanonical}
        image={seoImage}
      />

      <div className="custom-cursor">
        <CustomCursor />
        <Preloader />

        <div className="page-wrapper">
          <HeaderOne />

          <main className="community-page-wrapper">
            <div className="community-container">
              <div className="community-grid-layout">
                {/* 1. LEFT SIDEBAR */}
                <CommunitySidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(catId) => {
                    if (singlePostId) navigate('/community');
                    setCurrentView('feed');
                    setSelectedCategory(catId);
                  }}
                  activeFilter={activeFilter}
                  onSelectFilter={(fil) => {
                    if (singlePostId) navigate('/community');
                    setActiveFilter(fil);
                    if (fil === 'saved') {
                      setCurrentView('saved');
                    } else {
                      setCurrentView('feed');
                    }
                  }}
                  currentView={currentView}
                  onSelectView={(view) => {
                    if (singlePostId) navigate('/community');
                    setCurrentView(view);
                    if (view === 'saved') {
                      setActiveFilter('saved');
                    } else if (activeFilter === 'saved' && view === 'feed') {
                      setActiveFilter('latest');
                    }
                  }}
                />

                {/* 2. CENTER FEED STREAM OR DEDICATED VIEW */}
                <section className="community-feed-stream">
                  {/* Single Post Navigation Banner */}
                  {singlePostId && (
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Link
                        to="/community"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#CA8A38',
                          fontSize: '13px',
                          fontWeight: '700',
                          textDecoration: 'none'
                        }}
                      >
                        <ArrowLeft size={16} />
                        <span>Back to All Discussions</span>
                      </Link>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        Shared Public Discussion
                      </span>
                    </div>
                  )}

                  {/* VIEW 1: MY LEARNING */}
                  {!singlePostId && currentView === 'learning' && (
                    <CommunityMyLearningView
                      onReturnToFeed={() => {
                        setCurrentView('feed');
                        setActiveFilter('latest');
                      }}
                    />
                  )}

                  {/* VIEW 2: ENROLLED WORKSHOPS */}
                  {!singlePostId && currentView === 'workshops' && (
                    <CommunityWorkshopsView
                      onReturnToFeed={() => {
                        setCurrentView('feed');
                        setActiveFilter('latest');
                      }}
                    />
                  )}

                  {/* VIEW 3: SAVED POSTS OR GENERAL FEED STREAM */}
                  {!singlePostId && (currentView === 'feed' || currentView === 'saved') && (
                    <>
                      {/* Saved Header Banner (when in Saved view) */}
                      {currentView === 'saved' ? (
                        <div className="community-saved-header-banner">
                          <Bookmark size={24} color="#CA8A38" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <h3>My Saved Discussions</h3>
                            <p>Here are your bookmarked insights, reflections, and announcements.</p>
                          </div>
                          <button
                            type="button"
                            className="community-btn-text-link"
                            onClick={() => {
                              setCurrentView('feed');
                              setActiveFilter('latest');
                            }}
                          >
                            ← Back to Feed
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Welcome Hero Banner (feed only) */}
                          <CommunityWelcomeBanner />

                          {/* Featured Next Masterclass (feed only) */}
                          {nextWorkshop && (
                            <CommunityFeaturedWorkshop event={nextWorkshop} />
                          )}

                          {/* Feed Heading & Filter Tabs (feed only) */}
                          <CommunityFeedFilters
                            activeFilter={activeFilter}
                            onSelectFilter={(f) => {
                              setActiveFilter(f);
                              if (f === 'saved') setCurrentView('saved');
                              else setCurrentView('feed');
                            }}
                            totalPosts={totalPosts}
                          />
                        </>
                      )}

                      {/* Loading State */}
                      {loading && (
                        <div style={{
                          padding: '60px 20px',
                          textAlign: 'center',
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          color: '#64748B'
                        }}>
                          <div style={{
                            display: 'inline-block',
                            width: '36px',
                            height: '36px',
                            border: '3px solid #F1F5F9',
                            borderTopColor: '#CA8A38',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            marginBottom: '14px'
                          }} />
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                            Loading community discussions...
                          </p>
                        </div>
                      )}

                      {/* Error State */}
                      {!loading && error && (
                        <div style={{
                          padding: '40px 24px',
                          textAlign: 'center',
                          background: '#FEF2F2',
                          borderRadius: '16px',
                          border: '1px solid #FECACA',
                          color: '#991B1B'
                        }}>
                          <AlertCircle size={32} style={{ margin: '0 auto 10px auto', display: 'block' }} />
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700' }}>
                            Discussion Unavailable
                          </h4>
                          <p style={{ margin: '0 0 16px 0', fontSize: '13px' }}>{error}</p>
                          <Link
                            to="/community"
                            style={{
                              background: '#CA8A38',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 18px',
                              fontSize: '13px',
                              fontWeight: '600',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <ArrowLeft size={14} />
                            <span>Return to Community Feed</span>
                          </Link>
                        </div>
                      )}

                      {/* Empty State */}
                      {!loading && !error && posts.length === 0 && (
                        <div style={{
                          padding: '60px 24px',
                          textAlign: 'center',
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          color: '#64748B'
                        }}>
                          <MessageSquare size={36} color="#CBD5E1" style={{ margin: '0 auto 12px auto', display: 'block' }} />
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>
                            {activeFilter === 'saved' || currentView === 'saved'
                              ? 'No Saved Discussions Yet'
                              : 'No discussions in this channel yet'}
                          </h4>
                          <p style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
                            {activeFilter === 'saved' || currentView === 'saved'
                              ? 'Click the bookmark icon on any post in the feed to save it here for quick access anytime.'
                              : 'Check back soon for new reflections and masterclass announcements.'}
                          </p>
                          {(activeFilter === 'saved' || currentView === 'saved') && (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentView('feed');
                                setActiveFilter('latest');
                              }}
                              style={{
                                background: '#CA8A38',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 18px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Explore Community Feed
                            </button>
                          )}
                        </div>
                      )}

                      {/* Posts List */}
                      {!loading && !error && posts.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {posts.map((post) => (
                            <CommunityPostCard
                              key={post.id}
                              post={post}
                              onPostUpdated={() => fetchPosts(page, false)}
                            />
                          ))}

                          {/* Pagination: Load More (feed only) */}
                          {!singlePostId && currentView === 'feed' && hasMore && (
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                              <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                style={{
                                  background: '#FFFFFF',
                                  color: '#CA8A38',
                                  border: '1px solid #FDE68A',
                                  padding: '12px 28px',
                                  borderRadius: '10px',
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  boxShadow: '0 2px 6px rgba(202, 138, 56, 0.1)'
                                }}
                              >
                                <RefreshCw size={15} className={loadingMore ? 'spin' : ''} />
                                <span>{loadingMore ? 'Loading discussions...' : 'Load More Discussions'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </section>

                {/* 3. RIGHT SIDEBAR */}
                <CommunityRightSidebar sidebarData={sidebarData} />
              </div>
            </div>
          </main>

          <FooterOne />
        </div>

        <MobileNav />
        <SearchPopup />
        <ScrollToTop />

        {/* Global Community Auth Modal */}
        <CommunityAuthModal />
      </div>
    </>
  );
}

export default function CommunityFeedPage() {
  return (
    <CommunityAuthProvider>
      <CommunityFeedPageContent />
    </CommunityAuthProvider>
  );
}
