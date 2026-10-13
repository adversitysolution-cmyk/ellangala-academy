import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Bookmark,
  Calendar,
  ArrowRight,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
  Smartphone,
  Download
} from 'lucide-react';
import { useAdminAuth } from '../../../admin/context/AdminAuthContext';
import { useCommunityAuth } from '../context/CommunityAuthContext';

export default function CommunitySidebar({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  activeFilter = 'latest',
  onSelectFilter,
  currentView = 'feed', // 'feed' | 'learning' | 'saved' | 'workshops'
  onSelectView
}) {
  const { isAuthenticated: isAdmin, currentUser: adminUser } = useAdminAuth();
  const {
    user: communityUser,
    isAuthenticated: isCommunityMember,
    openAuthModal,
    logout
  } = useCommunityAuth();

  const topicPills = [
    { label: 'Positive Psychology', id: 'psychology' },
    { label: 'Mindfulness', id: 'mindfulness' },
    { label: 'Bhagavad Gita', id: 'bhagavad-gita' },
    { label: 'Workshops', id: 'workshops' },
    { label: 'Personal Growth', id: 'personal-growth' },
    { label: 'Leadership', id: 'leadership' },
    { label: 'Mental Wellbeing', id: 'mental-wellbeing' },
    { label: 'Life Purpose', id: 'life-purpose' }
  ];

  // Check if topic is in user's saved interests
  const isUserTopic = (label) => {
    if (!communityUser?.topics) return false;
    return communityUser.topics.some(
      t => t.toLowerCase().includes(label.toLowerCase()) || label.toLowerCase().includes(t.toLowerCase())
    );
  };

  const handleNavClick = (viewName) => {
    if (onSelectView) {
      onSelectView(viewName);
    }
  };

  // Get user initial for initials avatar
  const getInitial = (name) => {
    if (!name) return 'S';
    return name.trim().charAt(0).toUpperCase();
  };

  const [sidebarImgError, setSidebarImgError] = React.useState(false);

  return (
    <aside className="community-left-sidebar community-sidebar-sticky">
      {/* 1. Profile / Navigation Card */}
      <div className="community-card community-left-card">
        {/* Profile Header */}
        {isCommunityMember && communityUser ? (
          /* ================= MEMBER STATE ================= */
          <div className="community-member-profile-header">
            <div className="community-profile-row">
              {communityUser.avatarUrl && !sidebarImgError ? (
                <img
                  src={communityUser.avatarUrl}
                  alt={communityUser.name}
                  className="community-mock-avatar"
                  onError={() => setSidebarImgError(true)}
                />
              ) : (
                <div className="community-initials-avatar">
                  <span>{getInitial(communityUser.name)}</span>
                </div>
              )}
              <div className="community-mock-user-meta">
                <h4 className="community-mock-user-name" title={communityUser.name}>
                  {communityUser.name}
                </h4>
                <p className="community-mock-user-role">
                  {isAdmin ? 'Admin & Faculty' : 'Community Member'}
                </p>
                <div className="community-member-quick-actions">
                  <button
                    type="button"
                    className="community-signout-btn"
                    onClick={() => {
                      if (window.confirm('Do you want to log out from this device?')) {
                        logout();
                      }
                    }}
                    title="Sign out from this device"
                  >
                    <LogOut size={12} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= GUEST STATE (New User) ================= */
          <div className="community-guest-profile-header">
            <div className="community-profile-row">
              <div className="community-silhouette-avatar">
                <User size={26} color="#94A3B8" />
              </div>
              <div className="community-mock-user-meta">
                <h4 className="community-mock-user-name">
                  Welcome, Seeker
                </h4>
                <p className="community-mock-user-role">
                  Join our wisdom circle
                </p>
              </div>
            </div>

            {/* Guest Action Buttons */}
            <div className="community-guest-cta-row">
              <button
                type="button"
                className="community-btn-signin"
                onClick={() => openAuthModal('login')}
              >
                <LogIn size={14} />
                <span>Login</span>
              </button>
              <button
                type="button"
                className="community-btn-join"
                onClick={() => openAuthModal('signup')}
              >
                <UserPlus size={14} />
                <span>Signup</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Navigation List */}
        <nav className="community-mock-nav">
          {/* Feed */}
          <button
            type="button"
            className={`community-mock-nav-item ${currentView === 'feed' && activeFilter !== 'saved' && selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => {
              handleNavClick('feed');
              onSelectCategory('all');
              if (activeFilter === 'saved') onSelectFilter('latest');
            }}
          >
            <Home size={18} className="community-nav-icon" />
            <span>Feed</span>
          </button>

          {/* Saved */}
          <button
            type="button"
            className={`community-mock-nav-item ${currentView === 'saved' || activeFilter === 'saved' ? 'active' : ''}`}
            onClick={() => {
              if (!isCommunityMember) {
                openAuthModal('login', 'Sign in to view and manage your saved community posts.');
              } else {
                handleNavClick('saved');
                onSelectFilter('saved');
              }
            }}
          >
            <Bookmark size={18} className="community-nav-icon" />
            <span>Saved</span>
          </button>
        </nav>

        {/* Divider */}
        <hr className="community-sidebar-divider" />

        {/* Topics & Interests Section */}
        <div className="community-topics-section">
          <div className="community-topics-header">
            <h4>Topics &amp; Interests</h4>
          </div>

          <div className="community-topic-pills-wrap">
            {topicPills.map((t) => {
              const isCategoryActive = selectedCategory === t.id;
              const isMemberInterest = isCommunityMember && isUserTopic(t.label);
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`community-topic-pill ${isCategoryActive ? 'active' : ''} ${isMemberInterest ? 'member-fav' : ''}`}
                  onClick={() => {
                    handleNavClick('feed');
                    onSelectCategory(isCategoryActive ? 'all' : t.id);
                  }}
                  title={isMemberInterest ? 'Your selected interest' : t.label}
                >
                  {isMemberInterest && <Sparkles size={11} className="fav-star" />}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Mountain Quote Vertical Poster Card */}
      <div className="community-mountain-quote-card">
        <div className="community-mountain-quote-overlay">
          <blockquote className="community-mountain-quote-text">
            “A calmer mind creates a brighter life.”
          </blockquote>
          <cite className="community-mountain-quote-author">
            — DR. NAVEEN ELLANGALA
          </cite>
        </div>
      </div>

      {/* 3. Positive MindGym App Card (Opposite to Recommended for You Card) */}
      <div className="community-mock-card community-mindgym-card">
        <div className="community-card-head-row">
          <div>
            <h4 className="community-card-title">Positive Mind GYM App</h4>
            <span className="community-card-topic-subtitle">
              Daily Mind Conditioning
            </span>
          </div>
          <Link
            to="/mindgym/app"
            className="community-card-link"
            title="Explore Positive Mind GYM App"
          >
            <span>Explore</span>
            <span>→</span>
          </Link>
        </div>

        {/* First Item: Positive Mind GYM App - Download Now */}
        <Link
          to="/mindgym/app"
          className="community-rec-item-link"
          title="Positive Mind GYM App - Download Now"
        >
          <div className="community-app-icon-thumb-wrap">
            <img
              src="/assets/images/services/Positive MindGym App.png"
              alt="Positive Mind GYM App"
              className="community-rec-thumb community-app-thumb"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/case/positive-mindgym-app.jpg';
              }}
            />
          </div>
          <div className="community-rec-info">
            <h5 className="community-rec-title">Positive Mind GYM App</h5>
            <span className="community-download-now-badge">
              <Download size={12} />
              <span>Download Now</span>
            </span>
          </div>
        </Link>

        {/* Direct 2 Download Buttons for Android & Apple */}
        <div className="community-app-dl-buttons-row">
          <a
            href="https://play.google.com/store/apps/details?id=in.adversitysolutions.mindgym"
            target="_blank"
            rel="noopener noreferrer"
            className="community-app-dl-btn community-dl-android"
            title="Direct Download for Android on Google Play"
          >
            <i className="fab fa-google-play dl-icon"></i>
            <div className="dl-labels">
              <span className="dl-sub">GET IT ON</span>
              <span className="dl-name">Google Play</span>
            </div>
          </a>

          <a
            href="https://apps.apple.com/in/app/positive-mindgym/id6769993640"
            target="_blank"
            rel="noopener noreferrer"
            className="community-app-dl-btn community-dl-apple"
            title="Direct Download for Apple on App Store"
          >
            <i className="fab fa-apple dl-icon"></i>
            <div className="dl-labels">
              <span className="dl-sub">Download on</span>
              <span className="dl-name">App Store</span>
            </div>
          </a>
        </div>
      </div>
    </aside>
  );
}
