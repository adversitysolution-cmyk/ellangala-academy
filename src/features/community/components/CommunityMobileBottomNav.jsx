import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Bookmark, User } from 'lucide-react';
import { useCommunityAuth } from '../context/CommunityAuthContext';

export default function CommunityMobileBottomNav({ singlePostId = null }) {
  const { user, isAuthenticated, openAuthModal } = useCommunityAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const isFeed = (!singlePostId && (pathname === '/feed' || pathname === '/feed/' || pathname === '/community' || pathname === '/community/'));
  const isSaved = pathname === '/feed/saved' || pathname === '/community/saved';
  const isProfile = pathname === '/feed/profile' || pathname === '/community/profile';

  const handleTabClick = (targetPath) => {
    navigate(targetPath);
  };

  const handleSavedClick = () => {
    if (!isAuthenticated) {
      openAuthModal('signup', 'Sign up or log in to view your saved community reflections.', () => {
        navigate('/feed/saved');
      });
      return;
    }
    navigate('/feed/saved');
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Sign in to access your personal seeker profile and learning.', () => {
        navigate('/feed/profile');
      });
      return;
    }
    navigate('/feed/profile');
  };

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  const [imgError, setImgError] = React.useState(false);

  return (
    <nav className="community-mobile-bottom-nav" aria-label="Feed navigation">
      {/* 1. HOME / FEED */}
      <button
        type="button"
        className={`community-mobile-nav-item ${isFeed ? 'active' : ''}`}
        onClick={() => handleTabClick('/feed')}
        aria-label="Feed"
      >
        <Home size={22} />
        <span>Feed</span>
      </button>

      {/* 2. SAVE */}
      <button
        type="button"
        className={`community-mobile-nav-item ${isSaved ? 'active' : ''}`}
        onClick={handleSavedClick}
        aria-label="Saved"
      >
        <Bookmark size={22} />
        <span>Saved</span>
      </button>

      {/* 3. PROFILE */}
      <button
        type="button"
        className={`community-mobile-nav-item ${isProfile ? 'active' : ''}`}
        onClick={handleProfileClick}
        aria-label="Profile"
      >
        {isAuthenticated && user ? (
          user.avatarUrl && !imgError ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="community-mobile-nav-avatar"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="community-mobile-nav-initials">
              <span>{getInitial(user.name)}</span>
            </div>
          )
        ) : (
          <User size={22} />
        )}
        <span>Profile</span>
      </button>
    </nav>
  );
}
