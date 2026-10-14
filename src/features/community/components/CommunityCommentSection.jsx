import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Send, User, MessageSquare, X, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { communityService } from '../services/communityService';
import { useCommunityAuth } from '../context/CommunityAuthContext';
import { useAdminAuth } from '../../../admin/context/AdminAuthContext';

export default function CommunityCommentSection({ postId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Authentication contexts
  const {
    user: communityUser,
    isAuthenticated: isCommunityMember,
    openAuthModal
  } = useCommunityAuth();

  const {
    currentUser: adminUser,
    isAuthenticated: isAdmin
  } = useAdminAuth();

  const isUserLoggedIn = Boolean(isCommunityMember || isAdmin);

  // Resolved user meta
  const currentAuthorName = isAdmin
    ? (adminUser?.name || 'Dr. Naveen Ellangala')
    : (communityUser?.name || '');
  const currentAuthorEmail = isAdmin
    ? (adminUser?.email || 'admin@ellangala.com')
    : (communityUser?.email || '');
  const currentAuthorAvatar = isAdmin
    ? (adminUser?.profilePhoto || adminUser?.avatar || '')
    : (communityUser?.avatarUrl || '');

  // Load existing comments
  useEffect(() => {
    communityService.getComments(postId)
      .then(res => setComments(res.comments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  // Restore pending comment if user previously typed before signing in
  useEffect(() => {
    const pending = sessionStorage.getItem(`pending_comment_${postId}`);
    if (pending && !content) {
      setContent(pending);
    }
  }, [postId]);

  // Auto-post after successful login/signup if guest had a pending comment
  const hasAutoSubmittedRef = useRef(false);
  useEffect(() => {
    if (isUserLoggedIn && !hasAutoSubmittedRef.current) {
      const pending = sessionStorage.getItem(`pending_comment_${postId}`);
      if (pending && pending.trim()) {
        hasAutoSubmittedRef.current = true;
        sessionStorage.removeItem(`pending_comment_${postId}`);
        postCommentDirect(pending.trim(), true);
      }
    }
  }, [isUserLoggedIn, postId]);

  // Helper function to post comment
  const postCommentDirect = async (commentText, wasAutoSubmitted = false) => {
    const textToSubmit = (commentText || content).trim();
    if (!textToSubmit) return;

    const authorName = isAdmin
      ? (adminUser?.name || 'Dr. Naveen Ellangala')
      : (communityUser?.name || 'Community Member');
    const authorEmail = isAdmin
      ? (adminUser?.email || 'admin@ellangala.com')
      : (communityUser?.email || '');

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const newComment = await communityService.postComment(postId, {
        authorName,
        authorEmail,
        content: textToSubmit
      });

      setComments(prev => [...prev, newComment]);
      setContent('');
      sessionStorage.removeItem(`pending_comment_${postId}`);
      if (onCommentAdded) onCommentAdded();

      if (wasAutoSubmitted) {
        setSuccessToast('Your reflection has been posted successfully!');
        setTimeout(() => setSuccessToast(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit button handler
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!content.trim()) {
      setErrorMsg('Please write your reflection before submitting.');
      return;
    }

    // Guest Flow: show popup modal requesting signup/login
    if (!isUserLoggedIn) {
      sessionStorage.setItem(`pending_comment_${postId}`, content.trim());
      setShowGuestModal(true);
      return;
    }

    // Authenticated Flow: post immediately
    postCommentDirect(content.trim());
  };

  // Get user avatar initial
  const getInitial = (name) => {
    if (!name) return 'S';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="community-comment-section">
      {/* Existing Comments List */}
      {loading ? (
        <div style={{ fontSize: '13px', color: '#94A3B8', padding: '10px 0' }}>
          Loading thoughts...
        </div>
      ) : comments.length === 0 ? (
        <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '14px' }}>
          No comments yet. Be the first to share your reflection!
        </div>
      ) : (
        <div className="community-comments-list">
          {comments.map(c => (
            <div key={c.id} className="community-comment-item">
              {c.authorAvatar ? (
                <img
                  src={c.authorAvatar}
                  alt={c.authorName}
                  className="community-comment-avatar"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) {
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                className="community-comment-avatar-fallback"
                style={{ display: c.authorAvatar ? 'none' : 'flex' }}
              >
                {getInitial(c.authorName)}
              </div>

              <div className="community-comment-bubble">
                <div className="community-comment-bubble-header">
                  <div>
                    <span className="community-comment-bubble-author">{c.authorName}</span>
                    {c.authorEmail === 'admin@ellangala.com' || c.authorName.toLowerCase().includes('dr. naveen') ? (
                      <span className="community-comment-bubble-badge">Author</span>
                    ) : null}
                  </div>
                  <span className="community-comment-bubble-time">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="community-comment-bubble-text">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Notification after auto-submit */}
      {successToast && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534',
          padding: '8px 14px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '12px'
        }}>
          <CheckCircle2 size={16} color="#16A34A" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Redesigned Direct Comment Box */}
      <form onSubmit={handleSubmit} className="community-comment-form-direct">
        {/* User avatar on the left */}
        {isUserLoggedIn && currentAuthorAvatar ? (
          <img
            src={currentAuthorAvatar}
            alt={currentAuthorName}
            className="community-comment-user-avatar"
          />
        ) : isUserLoggedIn ? (
          <div className="community-comment-user-avatar" style={{ fontWeight: '700', color: '#CA8A38' }}>
            {getInitial(currentAuthorName)}
          </div>
        ) : (
          <div className="community-comment-user-avatar" title="Guest">
            <User size={18} color="#94A3B8" />
          </div>
        )}

        {/* Comment Box Container */}
        <div className="community-comment-box-card">
          <textarea
            className="community-comment-textarea-direct"
            rows={2}
            placeholder={
              isUserLoggedIn
                ? `Share your reflection or ask a question as ${currentAuthorName}...`
                : "Share your reflection or ask a question..."
            }
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
          />

          {errorMsg && (
            <div style={{
              fontSize: '12px',
              color: '#DC2626',
              padding: '0 14px 6px',
              fontWeight: '500'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Action Footer Bar */}
          <div className="community-comment-actions-bar">
            <div className="community-comment-identity-hint">
              {isUserLoggedIn ? (
                <>
                  <span>Posting as</span>
                  <span className="community-comment-identity-name">{currentAuthorName}</span>
                </>
              ) : (
                <span>Guest • Sign in on submit</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="community-comment-submit-btn-direct"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Posting...' : 'Post Reflection'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Guest Authentication Popup Modal */}
      {showGuestModal && typeof document !== 'undefined' && createPortal(
        <div
          className="community-comment-auth-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGuestModal(false);
          }}
        >
          <div className="community-comment-auth-modal-card">
            <button
              type="button"
              className="community-comment-auth-close-btn"
              onClick={() => setShowGuestModal(false)}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="community-comment-auth-icon-wrap">
              <Sparkles size={26} />
            </div>

            <h3 className="community-comment-auth-title">
              Sign In to Share Your Reflection
            </h3>

            <p className="community-comment-auth-desc">
              To join the conversation and publish your thoughts, please sign in or create a free account.
            </p>

            {/* Preserved comment preview */}
            {content.trim() && (
              <div className="community-comment-auth-preview-quote">
                <div className="community-comment-auth-preview-label">Your Reflection Preview</div>
                <p className="community-comment-auth-preview-text">
                  “{content.trim()}”
                </p>
              </div>
            )}

            {/* Navigation buttons to login or signup */}
            <div className="community-comment-auth-btns-grid">
              <button
                type="button"
                className="community-comment-auth-btn-primary"
                onClick={() => {
                  setShowGuestModal(false);
                  openAuthModal('login', 'Please sign in to publish your reflection.');
                }}
              >
                <LogIn size={16} />
                <span>Sign In / Log In</span>
              </button>

              <button
                type="button"
                className="community-comment-auth-btn-secondary"
                onClick={() => {
                  setShowGuestModal(false);
                  openAuthModal('signup', 'Create a free account to join the discussion.');
                }}
              >
                <UserPlus size={16} />
                <span>Create Free Account</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
