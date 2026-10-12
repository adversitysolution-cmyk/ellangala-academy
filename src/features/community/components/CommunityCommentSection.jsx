import React, { useState, useEffect } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import { communityService } from '../services/communityService';

export default function CommunityCommentSection({ postId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const savedProfile = communityService.getVisitorProfile();
  const [authorName, setAuthorName] = useState(savedProfile?.name === 'Academy Learner' ? '' : (savedProfile?.name || ''));
  const [authorEmail, setAuthorEmail] = useState(savedProfile?.email || '');
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    communityService.getComments(postId)
      .then(res => setComments(res.comments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!authorName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Comment cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newComment = await communityService.postComment(postId, {
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        content: content.trim()
      });
      setComments(prev => [...prev, newComment]);
      setContent('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="community-comment-section">
      {/* Existing Comments List */}
      {loading ? (
        <div style={{ fontSize: '13px', color: '#94A3B8', padding: '10px 0' }}>Loading thoughts...</div>
      ) : comments.length === 0 ? (
        <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '14px' }}>
          No comments yet. Be the first to share your reflection!
        </div>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          {comments.map(c => (
            <div key={c.id} className="community-comment-item">
              <img
                src={c.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorName)}&background=CA8A38&color=fff&size=80`}
                alt={c.authorName}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div className="community-comment-bubble">
                <div className="community-comment-bubble-header">
                  <span className="community-comment-bubble-author">{c.authorName}</span>
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

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="community-comment-input-wrap">
        <div className="community-comment-author-row">
          <input
            type="text"
            className="community-comment-input"
            placeholder="Your Name *"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
          <input
            type="email"
            className="community-comment-input"
            placeholder="Email (optional, private)"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
          />
        </div>

        <textarea
          className="community-comment-input"
          rows={2}
          placeholder="Share your reflection or ask a question..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {errorMsg && (
          <div style={{ fontSize: '12px', color: '#EF4444' }}>{errorMsg}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="community-comment-submit-btn"
        >
          {isSubmitting ? 'Posting...' : 'Post Reflection'}
        </button>
      </form>
    </div>
  );
}
