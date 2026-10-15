import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  CheckCircle2,
  Pin
} from 'lucide-react';
import CommunityPostMedia from './CommunityPostMedia';
import CommunityCommentSection from './CommunityCommentSection';
import CommunityShareModal from './CommunityShareModal';
import { communityService } from '../services/communityService';
import { useCommunityAuth } from '../context/CommunityAuthContext';
import { useAdminAuth } from '../../../admin/context/AdminAuthContext';

export default function CommunityPostCard({ post, onPostUpdated }) {
  const { user, openAuthModal } = useCommunityAuth();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const hasAccess = Boolean(user || isAdmin);
  const [liked, setLiked] = useState(Boolean(post.hasLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [saved, setSaved] = useState(Boolean(post.hasSaved));
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [post.authorAvatar]);

  const authorInitials = (post.authorName || 'Academy Administrator')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AA';

  const executeToggleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));

    try {
      const res = await communityService.toggleLike(post.id);
      setLikesCount(res.likesCount);
      setLiked(res.liked);
    } catch (_) {
      setLiked(!nextLiked);
      setLikesCount(prev => nextLiked ? Math.max(0, prev - 1) : prev + 1);
    }
  };

  const handleToggleLike = () => {
    if (!hasAccess) {
      openAuthModal('signup', 'Please sign up or log in to like community posts and connect with seekers.', () => {
        executeToggleLike();
      });
      return;
    }
    executeToggleLike();
  };

  const executeToggleSave = async () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    try {
      const res = await communityService.toggleSave(post.id);
      setSaved(res.saved);
    } catch (_) {
      setSaved(!nextSaved);
    }
  };

  const handleToggleSave = () => {
    if (!hasAccess) {
      openAuthModal('signup', 'Please sign up or log in to save insights and reflections to your profile.', () => {
        executeToggleSave();
      });
      return;
    }
    executeToggleSave();
  };

  const handleShareClick = () => {
    if (!hasAccess) {
      openAuthModal('signup', 'Please sign up or log in to share reflections with the community.', () => {
        setShowShareModal(true);
      });
      return;
    }
    setShowShareModal(true);
  };

  // Human friendly time badge e.g. "3 days ago"
  const getTimeAgo = () => {
    if (post.id === 'seed-pinned-1' || post.title?.includes('Welcome')) return '3 days ago';
    if (post.id === 'seed-thought-2' || post.title?.includes('Thought for Today')) return '2 days ago';
    if (post.id === 'seed-meditation-3' || post.title?.includes('Guided Meditation')) return '4 days ago';
    if (!post.publishedAt) return 'Recently';
    const diffHours = Math.round((Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return `${Math.max(1, diffHours)}h ago`;
    const days = Math.round(diffHours / 24);
    return `${days} days ago`;
  };

  return (
    <article
      id={post.id}
      className={`community-mock-post-card ${post.isPinned ? 'is-pinned' : ''}`}
    >
      {/* Top Author Row */}
      <div className="community-post-header-row">
        <div className="community-post-author-block">
          {post.authorAvatar && !avatarError ? (
            <img
              src={post.authorAvatar}
              alt={post.authorName || 'Dr. Naveen Ellangala'}
              className="community-post-avatar-img"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div
              className="community-post-avatar-initials"
              title={post.authorName || 'Dr. Naveen Ellangala'}
            >
              {authorInitials}
            </div>
          )}
          <div className="community-post-author-info">
            <div className="community-post-author-name-line">
              <span className="community-author-display-name">
                {post.authorName || 'Dr. Naveen Ellangala'}
              </span>
              <span className="community-gold-verified" title="Verified Founder / Faculty">
                <CheckCircle2 size={15} />
              </span>
              {post.isPinned && (
                <span className="community-pinned-tag">
                  <Pin size={11} style={{ fill: '#B87B28' }} />
                  <span>Pinned</span>
                </span>
              )}
            </div>

            <div className="community-post-subline">
              <span>{getTimeAgo()}</span>
              <span className="community-dot-sep">•</span>
              <span className="community-post-cat-text">
                {post.categoryName || 'Daily Positive Wisdom'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Title */}
      {post.title && (
        <h3 className="community-feed-post-title">{post.title}</h3>
      )}

      {/* Post Body text */}
      {post.content && (
        <div className="community-feed-post-body">
          {post.content.split('\n\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      )}

      {/* Post Media (Image, Audio Waveform, Gallery, Video) */}
      <CommunityPostMedia postType={post.postType} mediaUrls={post.mediaUrls} aspectRatio={post.aspectRatio} />

      {/* Clean Bottom Action Row: Like, Comment, Share */}
      <div className="community-post-footer-actions">
        {/* Heart / Like */}
        <button
          type="button"
          onClick={handleToggleLike}
          className={`community-footer-act-btn ${liked ? 'active-liked' : ''}`}
        >
          <Heart
            size={18}
            className={liked ? 'heart-filled' : ''}
            style={{ fill: liked ? '#E11D48' : 'none', color: liked ? '#E11D48' : '#64748B' }}
          />
          <span>{likesCount}</span>
        </button>

        {/* Reflection / Comment */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="community-footer-act-btn"
        >
          <MessageSquare size={17} style={{ color: '#64748B' }} />
          <span>{commentsCount}</span>
        </button>

        {/* Bookmark / Save */}
        <button
          type="button"
          onClick={handleToggleSave}
          className={`community-footer-act-btn ${saved ? 'active-saved' : ''}`}
          title={saved ? 'Remove from saved' : 'Save post'}
        >
          <Bookmark
            size={17}
            style={{ fill: saved ? '#CA8A38' : 'none', color: saved ? '#CA8A38' : '#64748B' }}
          />
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShareClick}
          className="community-footer-act-btn"
          title="Share post"
        >
          <Share2 size={17} style={{ color: '#64748B' }} />
          <span>Share</span>
        </button>
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <CommunityCommentSection
          postId={post.id}
          onCommentAdded={() => setCommentsCount(prev => prev + 1)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <CommunityShareModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </article>
  );
}
