import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import HeaderOne from '../../../components/layout/HeaderOne';
import FooterOne from '../../../components/layout/FooterOne';
import Preloader from '../../../components/layout/Preloader';
import CustomCursor from '../../../components/layout/CustomCursor';
import MobileNav from '../../../components/layout/MobileNav';
import SearchPopup from '../../../components/layout/SearchPopup';
import ScrollToTop from '../../../components/layout/ScrollToTop';
import SEO from '../../../seo/SEO';
import { generateCommunityPostSchema } from '../../../seo/schemas/schemaGenerators';
import { useUterpyPlugins } from '../../../hooks/useUterpyPlugins';
import { communityService, extractPostIdFromSlug, buildPostShareSlug } from '../services/communityService';
import { eventService, getNextEligibleUpcomingEvent } from '../../events/services/eventService';
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
import CommunityMobileBottomNav from '../components/CommunityMobileBottomNav';
import CommunityMobileProfileView from '../components/CommunityMobileProfileView';

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
  const [sidebarData, setSidebarData] = useState({ featuredEvent: null, upcomingEvents: [], recommendedCourses: [] });
  const [featuredEvent, setFeaturedEvent] = useState(null);

  const [currentView, setCurrentView] = useState('feed'); // 'feed' | 'learning' | 'saved' | 'workshops'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('latest'); // 'latest' | 'popular' | 'saved'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  // Route-based view synchronization & Desktop guard
  useEffect(() => {
    const pathname = location.pathname;

    // Desktop guard: on desktop (>991px), no separate subpages; redirect to /feed
    if (window.innerWidth > 991) {
      if (['/feed/saved', '/feed/profile', '/community/saved', '/community/profile'].includes(pathname)) {
        navigate('/feed', { replace: true });
        return;
      }
    }

    if (pathname === '/feed/saved' || pathname === '/community/saved') {
      setCurrentView('saved');
      setActiveFilter('saved');
    } else if (pathname === '/feed/profile' || pathname === '/community/profile') {
      setCurrentView('profile');
    } else if (pathname === '/feed' || pathname === '/feed/' || pathname === '/community' || pathname === '/community/') {
      if (currentView === 'profile' || currentView === 'saved') {
        setCurrentView('feed');
        if (activeFilter === 'saved') setActiveFilter('latest');
      }
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        if (['/feed/saved', '/feed/profile', '/community/saved', '/community/profile'].includes(location.pathname)) {
          navigate('/feed', { replace: true });
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname, navigate]);

  // Load initial categories
  useEffect(() => {
    communityService.getCategories()
      .then(setCategories)
      .catch(() => { });
  }, []);

  // Fetch rule-based sidebar data whenever selected channel/category changes
  useEffect(() => {
    communityService.getSidebarData(selectedCategory)
      .then((data) => {
        setSidebarData(data);
      })
      .catch(() => { });
  }, [selectedCategory]);

  // Connect Feed page's Featured Events card to the existing Events page & event management system:
  // Dynamically resolve only the next upcoming eligible event with earliest start date/time
  useEffect(() => {
    const fetchNextUpcomingEvent = () => {
      eventService.getPublishedEvents()
        .then((events) => {
          const nextEvent = getNextEligibleUpcomingEvent(events);
          setFeaturedEvent(nextEvent);
        })
        .catch(() => {
          setFeaturedEvent(null);
        });
    };

    fetchNextUpcomingEvent();

    // Re-check periodically (30s) and on window focus so card updates automatically when event finishes,
    // or when admin creates, edits, cancels, or deletes an event
    const interval = setInterval(fetchNextUpcomingEvent, 30000);
    window.addEventListener('focus', fetchNextUpcomingEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchNextUpcomingEvent);
    };
  }, []);

  // Synchronize equal height and ratio between left sidebar cards and right sidebar cards
  useEffect(() => {
    let frameId;
    const syncSidebarCardHeights = () => {
      // Pair 1: Top Cards (Left Welcome/Topics vs Right Free Resources)
      const leftCard1 = document.querySelector('.community-left-card');
      const rightCard1 = document.querySelector('.community-fr-card');

      // Pair 2: Second Cards (Left Mountain Quote vs Right Recommended Books)
      const leftCard2 = document.querySelector('.community-mountain-quote-card');
      const rightCard2 = document.querySelector('.community-books-card');

      // Pair 3: Third Cards (Left MindGym App vs Right Recommended for You)
      const leftCard3 = document.querySelector('.community-mindgym-card');
      const rightCard3 = document.querySelector('.community-rec-card');

      // Sidebars & Center Feed Stream
      const leftSidebar = document.querySelector('.community-left-sidebar');
      const rightSidebar = document.querySelector('.community-right-sidebar');
      const feedStream = document.querySelector('.community-feed-stream');

      // On mobile / single-column, clear minHeight and feed stream constraints
      if (window.innerWidth <= 991) {
        if (leftCard1) leftCard1.style.minHeight = '';
        if (rightCard1) rightCard1.style.minHeight = '';
        if (leftCard2) leftCard2.style.minHeight = '';
        if (rightCard2) {
          rightCard2.style.minHeight = '';
          rightCard2.style.height = '';
        }
        if (leftCard3) leftCard3.style.minHeight = '';
        if (rightCard3) rightCard3.style.minHeight = '';
        if (feedStream) {
          feedStream.style.height = '';
          feedStream.style.maxHeight = '';
        }
        return;
      }

      // Reset inline minHeight to measure natural content size
      if (leftCard1) leftCard1.style.minHeight = '';
      if (rightCard1) rightCard1.style.minHeight = '';
      if (leftCard2) leftCard2.style.minHeight = '';
      if (rightCard2) {
        rightCard2.style.minHeight = '';
        rightCard2.style.height = '';
      }
      if (leftCard3) leftCard3.style.minHeight = '';
      if (rightCard3) rightCard3.style.minHeight = '';

      frameId = requestAnimationFrame(() => {
        // Pair 1 sync
        if (leftCard1 && rightCard1) {
          const maxH1 = Math.max(leftCard1.offsetHeight, rightCard1.offsetHeight);
          if (maxH1 > 0) {
            leftCard1.style.minHeight = `${maxH1}px`;
            rightCard1.style.minHeight = `${maxH1}px`;
          }
        }

        // Pair 2 sync: Lock Mountain Quote Card to its permanent constant height (435px)
        if (leftCard2) {
          leftCard2.style.height = '435px';
          leftCard2.style.minHeight = '435px';
          leftCard2.style.maxHeight = '435px';
        }
        if (rightCard2) {
          rightCard2.style.minHeight = '435px';
          rightCard2.style.height = 'auto';
        }

        // Pair 3 sync (Corner cards)
        if (leftCard3 && rightCard3) {
          const maxH3 = Math.max(leftCard3.offsetHeight, rightCard3.offsetHeight);
          if (maxH3 > 0) {
            leftCard3.style.minHeight = `${maxH3}px`;
            rightCard3.style.minHeight = `${maxH3}px`;
          }
        }
      });
    };

    syncSidebarCardHeights();
    const t1 = setTimeout(syncSidebarCardHeights, 150);
    const t2 = setTimeout(syncSidebarCardHeights, 500);

    window.addEventListener('resize', syncSidebarCardHeights);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', syncSidebarCardHeights);
    };
  }, [user, isAuthenticated, selectedCategory, categories, posts.length, loading]);

  // Handle single post view vs general feed
  useEffect(() => {
    if (singlePostId) {
      setCurrentView('feed');
      setLoading(true);
      setError('');
      const targetId = extractPostIdFromSlug(singlePostId);
      communityService.getPostById(targetId)
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

  // Resolved featured event (displays next eligible upcoming event, or null for fallback message)
  const activeFeaturedEvent = featuredEvent;

  // Dynamic SEO metadata
  let seoTitle = 'Ellangala Feed | Daily Mind Training & Wisdom';
  let seoDescription = "Join Dr. Naveen Ellangala's Positive Psychology and MindGym feed. Explore daily reflections, workshop announcements, character strengths, and peer discussions.";
  let seoCanonical = '/feed';

  if (singlePost) {
    seoTitle = `${singlePost.title} | Ellangala Feed`;
    seoDescription = singlePost.content?.slice(0, 160);
    seoCanonical = `/feed/posts/${buildPostShareSlug(singlePost)}`;
  } else if (location.pathname === '/feed/saved' || location.pathname === '/community/saved') {
    seoTitle = 'Saved Discussions | Ellangala Feed';
    seoDescription = 'View your saved positive psychology discussions, reflections, and bookmarked insights.';
    seoCanonical = '/feed/saved';
  } else if (location.pathname === '/feed/profile' || location.pathname === '/community/profile') {
    seoTitle = 'Feed Profile | Ellangala Feed';
    seoDescription = 'Manage your Ellangala Feed profile, authentication, and personalized learning preferences.';
    seoCanonical = '/feed/profile';
  }

  const seoImage = singlePost?.mediaUrls?.[0]?.mediaUrl || null;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={seoCanonical}
        image={seoImage}
        type={singlePost ? 'article' : 'website'}
        structuredData={singlePost ? generateCommunityPostSchema(singlePost) : null}
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
                    if (singlePostId) navigate('/feed');
                    setCurrentView('feed');
                    setSelectedCategory(catId);
                  }}
                  activeFilter={activeFilter}
                  onSelectFilter={(fil) => {
                    if (singlePostId) navigate('/feed');
                    setActiveFilter(fil);
                    if (fil === 'saved') {
                      setCurrentView('saved');
                    } else {
                      setCurrentView('feed');
                    }
                  }}
                  currentView={currentView}
                  onSelectView={(view) => {
                    if (singlePostId) navigate('/feed');
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
                        to="/feed"
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


                  {/* VIEW 4: PROFILE (MOBILE INSTAGRAM TAB) */}
                  {!singlePostId && currentView === 'profile' && (
                    <CommunityMobileProfileView
                      onSelectView={(view) => {
                        setCurrentView(view);
                        if (view === 'saved') {
                          setActiveFilter('saved');
                        } else if (view === 'feed') {
                          setActiveFilter('latest');
                        }
                      }}
                    />
                  )}

                  {/* VIEW 5: SAVED POSTS, GENERAL FEED STREAM, OR SINGLE SHARED POST */}
                  {(currentView === 'feed' || currentView === 'saved') && (
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
                        !singlePostId && (
                          <>
                            {/* Welcome Hero Banner (feed only) */}
                            <CommunityWelcomeBanner />

                            {/* Featured Event Alert Bar (feed only) */}
                            <CommunityFeaturedWorkshop event={activeFeaturedEvent} />

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
                        )
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
                              onPostUpdated={() => {
                                if (singlePostId) {
                                  const targetId = extractPostIdFromSlug(singlePostId);
                                  communityService.getPostById(targetId)
                                    .then((p) => {
                                      if (p) {
                                        setSinglePost(p);
                                        setPosts([p]);
                                      }
                                    })
                                    .catch(() => { });
                                } else {
                                  fetchPosts(page, false);
                                }
                              }}
                            />
                          ))}

                          {/* When on Single Post view, add a helpful exploration footer */}
                          {singlePostId && (
                            <div className="community-single-post-footer" style={{
                              textAlign: 'center',
                              padding: '24px 20px',
                              background: '#FFFFFF',
                              borderRadius: '16px',
                              border: '1px solid #ECE7DE',
                              marginTop: '8px'
                            }}>
                              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: '#1E1A16' }}>
                                Explore More Community Discussions
                              </h4>
                              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
                                Join fellow learners in exploring positive psychology reflections, mind gym habits, and transformative insights.
                              </p>
                              <Link
                                to="/feed"
                                style={{
                                  background: '#CA8A38',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '10px 22px',
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                              >
                                <span>Go to Community Feed</span>
                                <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                              </Link>
                            </div>
                          )}

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
                <CommunityRightSidebar
                  sidebarData={sidebarData}
                  selectedCategory={selectedCategory}
                />
              </div>
            </div>
          </main>
        </div>

        <MobileNav />
        <SearchPopup />
        <ScrollToTop />

        {/* Instagram-style Mobile Bottom Navigation (Feed, Saved, Profile) */}
        <CommunityMobileBottomNav singlePostId={singlePostId} />
      </div>
    </>
  );
}

export default function CommunityFeedPage() {
  return <CommunityFeedPageContent />;
}

