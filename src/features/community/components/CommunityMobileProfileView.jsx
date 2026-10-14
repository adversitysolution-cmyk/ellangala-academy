import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  Bookmark,
  Home,
  Sparkles,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Heart,
  Camera,
  RefreshCw
} from 'lucide-react';
import { useCommunityAuth } from '../context/CommunityAuthContext';
import { communityService } from '../services/communityService';

export default function CommunityMobileProfileView({ onSelectView }) {
  const { user, isAuthenticated, token, updateUserProfile, openAuthModal, logout } = useCommunityAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const getInitial = (name) => {
    if (!name) return 'S';
    return name.trim().charAt(0).toUpperCase();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setImgError(false);

    try {
      let avatarUrl = null;
      try {
        avatarUrl = await communityService.uploadAvatar(file);
      } catch (err) {
        const reader = new FileReader();
        avatarUrl = await new Promise((res) => {
          reader.onload = (ev) => res(ev.target.result);
          reader.onerror = () => res(null);
          reader.readAsDataURL(file);
        });
      }

      if (avatarUrl && token) {
        const updated = await communityService.updateProfile(token, { avatarUrl });
        updateUserProfile(updated);
      } else if (avatarUrl) {
        updateUserProfile({ ...user, avatarUrl });
      }
    } catch (err) {
      console.warn('Avatar update failed:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="community-mobile-profile-view">
      {/* 1. PROFILE HEADER CARD */}
      <div className="community-card community-mobile-profile-card">
        {isAuthenticated && user ? (
          /* ================= LOGGED IN MEMBER ================= */
          <div className="community-profile-member-box">
            <div className="community-profile-row">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {user.avatarUrl && !imgError ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="community-mock-avatar"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="community-initials-avatar">
                    <span>{getInitial(user.name)}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change profile photo"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#B87B28',
                    color: '#fff',
                    border: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <RefreshCw size={12} className="spin" />
                  ) : (
                    <Camera size={12} />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="community-mock-user-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 className="community-mock-user-name" style={{ fontSize: '18px' }}>
                    {user.name}
                  </h3>
                  <ShieldCheck size={16} color="#B87B28" />
                </div>
                <span className="community-mock-user-handle">
                  {user.email || 'Community Member'}
                </span>
                <span className="community-member-status-pill">
                  Verified Seeker
                </span>
              </div>
            </div>

            {/* Quick Stats / Navigation Links */}
            <div className="community-profile-quick-stats">
              <button
                type="button"
                className="community-profile-stat-box"
                onClick={() => navigate('/feed/saved')}
              >
                <Bookmark size={18} color="#B87B28" />
                <span className="stat-label">Saved Discussions</span>
              </button>

              <button
                type="button"
                className="community-profile-stat-box"
                onClick={() => navigate('/feed')}
              >
                <Home size={18} color="#B87B28" />
                <span className="stat-label">Feed</span>
              </button>
            </div>

            {/* User Interests */}
            {Array.isArray(user.topics) && user.topics.length > 0 && (
              <div className="community-profile-topics-wrap">
                <span className="community-profile-topics-label">Your Topics &amp; Interests:</span>
                <div className="community-profile-topics-chips">
                  {user.topics.map((t, idx) => (
                    <span key={idx} className="community-profile-topic-chip">
                      <Sparkles size={11} color="#B87B28" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Logout button */}
            <button
              type="button"
              className="community-profile-logout-btn"
              onClick={logout}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          /* ================= GUEST STATE (SIGNUP / LOGIN) ================= */
          <div className="community-profile-guest-box">
            <div className="community-guest-avatar-ring">
              <User size={38} color="#B87B28" />
            </div>

            <h3 className="community-guest-title">Welcome, Seeker</h3>
            <p className="community-guest-subtitle">
              Join our wisdom circle to participate in reflections, bookmark your favorite teachings, and engage in daily mind training.
            </p>

            {/* Signup and Login Buttons */}
            <div className="community-profile-auth-buttons">
              <button
                type="button"
                className="community-profile-btn-signup"
                onClick={() => openAuthModal('signup', 'Create your account to start interacting with the community.')}
              >
                <UserPlus size={16} />
                <span>Create Account / Sign Up</span>
              </button>

              <button
                type="button"
                className="community-profile-btn-login"
                onClick={() => openAuthModal('login', 'Log in to access your saved posts and discussions.')}
              >
                <LogIn size={16} />
                <span>Log In</span>
              </button>
            </div>

            {/* Community Benefits Checklist */}
            <div className="community-guest-perks-list">
              <div className="perk-item">
                <Sparkles size={14} color="#B87B28" />
                <span>Daily Positive Psychology &amp; Mind Training</span>
              </div>
              <div className="perk-item">
                <Bookmark size={14} color="#B87B28" />
                <span>Bookmark and save inspiring discussions</span>
              </div>
              <div className="perk-item">
                <Heart size={14} color="#B87B28" />
                <span>Connect with like-minded wisdom seekers</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. POSITIVE MINDGYM APP PROMO CARD ON PROFILE */}
      <div className="community-card community-profile-app-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B87B28'
          }}>
            <Smartphone size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>
              Positive Mind GYM App
            </h4>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Daily mind conditioning on the go
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <a
            href="https://play.google.com/store/apps/details?id=in.adversitysolutions.mindgym"
            target="_blank"
            rel="noopener noreferrer"
            className="community-app-dl-btn community-dl-android"
            style={{ padding: '8px 10px', fontSize: '11px' }}
          >
            <span>Google Play</span>
          </a>
          <a
            href="https://apps.apple.com/in/app/positive-mindgym/id6769993640"
            target="_blank"
            rel="noopener noreferrer"
            className="community-app-dl-btn community-dl-apple"
            style={{ padding: '8px 10px', fontSize: '11px' }}
          >
            <span>App Store</span>
          </a>
        </div>
      </div>
    </div>
  );
}
