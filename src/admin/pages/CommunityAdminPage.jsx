import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { communityAdminService } from '../services/communityAdminService';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  MessageSquareShare,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Pin,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  ThumbsUp,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  AlertTriangle,
  X,
  Check,
  ShieldAlert,
  Reply,
  Send,
  CornerDownLeft,
  User
} from 'lucide-react';

export default function CommunityAdminPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'comments'
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for Posts
  const [postSearch, setPostSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filters for Comments
  const [commentStatusFilter, setCommentStatusFilter] = useState('all');

  // Modal States
  const [deleteModalPost, setDeleteModalPost] = useState(null);
  const [deleteModalComment, setDeleteModalComment] = useState(null);

  // Dedicated Post Comments & Reply Modal State
  const { currentUser: adminUser } = useAdminAuth();
  const [selectedPostDetails, setSelectedPostDetails] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [loadingPostComments, setLoadingPostComments] = useState(false);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replySuccessMsg, setReplySuccessMsg] = useState('');
  const [replyingToComment, setReplyingToComment] = useState(null);
  const replyInputRef = useRef(null);

  // Quick Comment Reply Modal State
  const [quickReplyComment, setQuickReplyComment] = useState(null);
  const [quickReplyText, setQuickReplyText] = useState('');
  const [isSubmittingQuickReply, setIsSubmittingQuickReply] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, postsRes, commentsRes] = await Promise.all([
        communityAdminService.getCategories(),
        communityAdminService.getPosts({ status: 'all', limit: 100 }),
        communityAdminService.getComments({ status: 'all', limit: 100 })
      ]);
      setCategories(cats || []);
      setPosts(postsRes.posts || []);
      setComments(commentsRes.comments || []);
    } catch (err) {
      console.error('Error loading community admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open post and load its specific comments
  const handleOpenPostComments = async (post) => {
    setSelectedPostDetails(post);
    setAdminReplyText('');
    setReplySuccessMsg('');
    setReplyingToComment(null);
    setLoadingPostComments(true);
    try {
      const res = await communityAdminService.getComments({ postId: post.id, limit: 100 });
      setPostComments(res.comments || []);
    } catch (err) {
      console.error('Error loading comments for post:', err);
    } finally {
      setLoadingPostComments(false);
    }
  };

  // Submit Admin reply to post / comment
  const handlePostAdminReply = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPostDetails || !adminReplyText.trim()) return;

    setIsSubmittingReply(true);
    setReplySuccessMsg('');

    try {
      const authorName = adminUser?.name || 'Dr. Naveen Ellangala';
      const authorEmail = adminUser?.email || 'admin@ellangala.com';

      const newComment = await communityAdminService.postComment(selectedPostDetails.id, {
        authorName,
        authorEmail,
        content: adminReplyText.trim()
      });

      setPostComments(prev => [...prev, newComment]);
      setAdminReplyText('');
      setReplyingToComment(null);
      setReplySuccessMsg('Admin reply published successfully!');
      setTimeout(() => setReplySuccessMsg(''), 3500);

      // Increment commentsCount in table and add to global comments queue
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === selectedPostDetails.id
            ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
            : p
        )
      );
      setComments(prev => [newComment, ...prev]);
    } catch (err) {
      alert(err.message || 'Failed to post reply.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Delete a specific comment directly from post modal
  const handleDeletePostComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to permanently delete this comment?')) return;
    try {
      await communityAdminService.deleteComment(commentId);
      setPostComments(prev => prev.filter(c => c.id !== commentId));
      setComments(prev => prev.filter(c => c.id !== commentId));
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === selectedPostDetails?.id
            ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 1) - 1) }
            : p
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to delete comment.');
    }
  };

  // Open Quick Reply modal for any comment
  const handleOpenReplyModal = (comment) => {
    setQuickReplyComment(comment);
    setQuickReplyText(`@${comment.authorName} `);
  };

  // Submit Quick Reply from comment table
  const handleSubmitQuickReply = async (e) => {
    if (e) e.preventDefault();
    if (!quickReplyComment || !quickReplyText.trim()) return;

    setIsSubmittingQuickReply(true);
    try {
      const authorName = adminUser?.name || 'Dr. Naveen Ellangala';
      const authorEmail = adminUser?.email || 'admin@ellangala.com';
      const targetPostId = quickReplyComment.postId || posts[0]?.id || 'post-seed-001';

      const newComment = await communityAdminService.postComment(targetPostId, {
        authorName,
        authorEmail,
        content: quickReplyText.trim()
      });

      setComments(prev => [newComment, ...prev]);
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === targetPostId
            ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
            : p
        )
      );

      if (selectedPostDetails?.id === targetPostId) {
        setPostComments(prev => [...prev, newComment]);
      }

      setQuickReplyComment(null);
      setQuickReplyText('');
    } catch (err) {
      alert(err.message || 'Failed to submit reply.');
    } finally {
      setIsSubmittingQuickReply(false);
    }
  };

  // Post Actions
  const handleTogglePin = async (post) => {
    try {
      await communityAdminService.togglePin(post.id, !post.isPinned);
      loadData();
    } catch (err) {
      alert(err.message || 'Error updating pin status.');
    }
  };

  const handleDeletePost = async () => {
    if (!deleteModalPost) return;
    try {
      await communityAdminService.deletePost(deleteModalPost.id);
      setDeleteModalPost(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Error deleting post.');
    }
  };

  // Comment Actions
  const handleUpdateCommentStatus = async (commentId, newStatus) => {
    try {
      await communityAdminService.updateCommentStatus(commentId, newStatus);
      loadData();
    } catch (err) {
      alert(err.message || 'Error updating comment status.');
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteModalComment) return;
    try {
      await communityAdminService.deleteComment(deleteModalComment.id);
      setDeleteModalComment(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Error deleting comment.');
    }
  };

  // Filtered Posts
  const filteredPosts = posts.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.content.toLowerCase().includes(postSearch.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.categoryId === categoryFilter || p.categoryName === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pinned' ? p.isPinned : p.status === statusFilter);
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Filtered Comments
  const filteredComments = comments.filter(c => {
    return commentStatusFilter === 'all' || c.status === commentStatusFilter;
  });

  // Metrics
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
  const totalComments = comments.length;

  return (
    <AdminLayout
      title="Feed Management & Discussions"
      subtitle="Manage feed posts, scheduled reflections, announcements, and comment moderation"
      action={
        <button
          type="button"
          onClick={() => navigate('/admin/feed/new')}
          className="admin-btn admin-btn--primary"
        >
          <Plus size={18} /> Author New Post
        </button>
      }
    >
      {/* 4 Summary Metric Cards */}
      <div className="admin-grid admin-grid--4" style={{ marginBottom: '24px' }}>
        <StatCard title="Total Posts" value={totalPosts} icon={MessageSquareShare} color="blue" />
        <StatCard title="Published Live" value={publishedPosts} icon={CheckCircle2} color="green" />
        <StatCard title="Scheduled Posts" value={scheduledPosts} icon={Clock} color="amber" />
        <StatCard title="Total Comments" value={totalComments} icon={MessageSquare} color="purple" />
      </div>

      {/* Primary Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            background: 'none',
            color: activeTab === 'posts' ? '#CA8A38' : '#64748B',
            borderBottom: activeTab === 'posts' ? '2px solid #CA8A38' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <MessageSquareShare size={16} />
          <span>Community Posts ({posts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comments')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            background: 'none',
            color: activeTab === 'comments' ? '#CA8A38' : '#64748B',
            borderBottom: activeTab === 'comments' ? '2px solid #CA8A38' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <MessageSquare size={16} />
          <span>Comment Moderation Queue ({comments.length})</span>
        </button>
      </div>

      {/* TAB 1: COMMUNITY POSTS */}
      {activeTab === 'posts' && (
        <div className="admin-card">
          {/* Controls & Filters Bar */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="text"
                placeholder="Search posts by title or text..."
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                className="admin-input"
                style={{ paddingLeft: '38px' }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="admin-input"
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="all">All Channels</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-input"
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
              <option value="pinned">Pinned Only</option>
            </select>
          </div>

          {/* Posts Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Pin</th>
                  <th>Title &amp; Narrative</th>
                  <th>Channel</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Engagement</th>
                  <th>Publish Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                      No community posts match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map(post => {
                    const isVid = post.postType === 'video';
                    const isAud = post.postType === 'audio';
                    const isGall = post.postType === 'gallery';
                    const isImg = post.postType === 'single_image';

                    return (
                      <tr key={post.id}>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleTogglePin(post)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: post.isPinned ? '#CA8A38' : '#CBD5E1'
                            }}
                            title={post.isPinned ? 'Unpin announcement' : 'Pin to top of feed'}
                          >
                            <Pin size={17} style={{ fill: post.isPinned ? '#CA8A38' : 'none' }} />
                          </button>
                        </td>
                        <td>
                          <div
                            onClick={() => handleOpenPostComments(post)}
                            style={{
                              fontWeight: '600',
                              color: '#1E293B',
                              fontSize: '14px',
                              marginBottom: '4px',
                              cursor: 'pointer'
                            }}
                            title="Click to view post details & comments"
                          >
                            {post.title}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#64748B',
                            maxWidth: '360px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {post.content}
                          </div>
                        </td>
                        <td>
                          <span style={{
                            fontSize: '12px',
                            background: '#F1F5F9',
                            color: '#475569',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: '500'
                          }}>
                            {post.categoryName || 'General'}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#64748B'
                          }}>
                            {isVid ? <Video size={14} color="#DC2626" /> :
                             isAud ? <Music size={14} color="#2563EB" /> :
                             isGall ? <ImageIcon size={14} color="#CA8A38" /> :
                             isImg ? <ImageIcon size={14} color="#059669" /> :
                             <FileText size={14} color="#64748B" />}
                            <span>{post.postType}</span>
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={post.status} />
                          {post.status === 'scheduled' && post.scheduledFor && (
                            <div style={{ fontSize: '11px', color: '#D97706', marginTop: '3px' }}>
                              ⏱ {new Date(post.scheduledFor).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#64748B', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ThumbsUp size={13} /> {post.likesCount || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenPostComments(post)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#EFF6FF',
                                color: '#2563EB',
                                border: '1px solid #DBEAFE',
                                borderRadius: '12px',
                                padding: '2px 8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                              title="View & moderate comments for this post"
                            >
                              <MessageSquare size={13} /> {post.commentsCount || 0}
                            </button>
                          </div>
                        </td>
                        <td style={{ fontSize: '12px', color: '#64748B' }}>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenPostComments(post)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#2563EB',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                              title="View Post Details & Comments"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/feed/${post.id}/edit`)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#2563EB',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                              title="Edit Post"
                            >
                              <Edit size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModalPost(post)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#EF4444',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                              title="Delete Post"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COMMENT MODERATION QUEUE */}
      {activeTab === 'comments' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', margin: 0 }}>
              Visitor Comments &amp; Moderation
            </h3>
            <select
              value={commentStatusFilter}
              onChange={(e) => setCommentStatusFilter(e.target.value)}
              className="admin-input"
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="all">All Comments</option>
              <option value="approved">Approved</option>
              <option value="hidden">Hidden / Flagged</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Comment Content</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th style={{ textAlign: 'right' }}>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                      No comments to review.
                    </td>
                  </tr>
                ) : (
                  filteredComments.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '13px' }}>
                          {c.authorName}
                        </div>
                        {c.authorEmail && (
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{c.authorEmail}</div>
                        )}
                      </td>
                      <td style={{ maxWidth: '420px', fontSize: '13px', color: '#334155' }}>
                        {c.content}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: c.status === 'approved' ? '#ECFDF5' : '#FEF2F2',
                          color: c.status === 'approved' ? '#059669' : '#DC2626'
                        }}>
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: '#64748B' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenReplyModal(c)}
                            style={{
                              background: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              color: '#2563EB',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Reply to this comment as Admin"
                          >
                            <Reply size={13} />
                            Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModalComment(c)}
                            style={{
                              background: '#FEF2F2',
                              border: '1px solid #FECACA',
                              color: '#DC2626',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DELETE POST CONFIRMATION MODAL */}
      {deleteModalPost && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#DC2626' }}>
              <AlertTriangle size={24} />
              <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '700' }}>Confirm Delete Post</h4>
            </div>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Are you sure you want to permanently delete <strong>"{deleteModalPost.title}"</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteModalPost(null)}
                className="admin-btn"
                style={{ background: '#F1F5F9', border: 'none', color: '#475569' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                className="admin-btn"
                style={{ background: '#DC2626', color: '#FFFFFF', border: 'none' }}
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE COMMENT CONFIRMATION MODAL */}
      {deleteModalComment && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px'
          }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '700', color: '#DC2626' }}>
              Delete Comment?
            </h4>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 18px 0' }}>
              Are you sure you want to permanently delete this comment by <strong>{deleteModalComment.authorName}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteModalComment(null)}
                className="admin-btn"
                style={{ background: '#F1F5F9', border: 'none' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteComment}
                className="admin-btn"
                style={{ background: '#DC2626', color: '#FFFFFF', border: 'none' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK COMMENT REPLY MODAL */}
      {quickReplyComment && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '540px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Reply size={18} color="#2563EB" />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
                  Reply to Comment
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setQuickReplyComment(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitQuickReply} style={{ padding: '20px' }}>
              {/* Target comment preview */}
              <div style={{
                background: '#F1F5F9',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '16px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#CBD5E1',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '11px'
                    }}>
                      {quickReplyComment.authorName ? quickReplyComment.authorName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: '#1E293B' }}>
                        {quickReplyComment.authorName}
                      </span>
                      {quickReplyComment.authorEmail && (
                        <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>
                          ({quickReplyComment.authorEmail})
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {new Date(quickReplyComment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#334155', fontStyle: 'italic', paddingLeft: '36px' }}>
                  "{quickReplyComment.content}"
                </div>
              </div>

              {/* Reply composer */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Your Reply:
                </label>
                <textarea
                  autoFocus
                  value={quickReplyText}
                  onChange={(e) => setQuickReplyText(e.target.value)}
                  placeholder={`Write reply as Dr. Naveen Ellangala...`}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
                  Posting publicly as <strong>{adminUser?.name || 'Dr. Naveen Ellangala'}</strong> (Admin)
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setQuickReplyComment(null)}
                  className="admin-btn"
                  style={{ background: '#F1F5F9', border: 'none', color: '#475569' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuickReply || !quickReplyText.trim()}
                  className="admin-btn admin-btn--primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: (isSubmittingQuickReply || !quickReplyText.trim()) ? 0.6 : 1,
                    cursor: (isSubmittingQuickReply || !quickReplyText.trim()) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={14} />
                  <span>{isSubmittingQuickReply ? 'Posting...' : 'Send Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST DETAILS & COMMENTS MANAGEMENT MODAL */}
      {selectedPostDetails && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '760px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 22px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {selectedPostDetails.categoryName || 'Feed Post'}
                </span>
                <StatusBadge status={selectedPostDetails.status} />
                {selectedPostDetails.isPinned && (
                  <span style={{ fontSize: '11px', color: '#CA8A38', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Pin size={12} style={{ fill: '#CA8A38' }} /> Pinned
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPostDetails(null);
                  setReplyingToComment(null);
                  setAdminReplyText('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content: Post Narrative + Comments */}
            <div style={{ padding: '22px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Post Narrative Card */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '16px 18px',
                border: '1px solid #E2E8F0'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: '700', color: '#0F172A' }}>
                  {selectedPostDetails.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#334155',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  margin: '0 0 12px 0'
                }}>
                  {selectedPostDetails.content}
                </p>

                {selectedPostDetails.mediaUrls?.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    {selectedPostDetails.postType === 'video' ? (
                      <video
                        src={selectedPostDetails.mediaUrls[0].mediaUrl}
                        controls
                        style={{ width: '100%', maxHeight: '280px', borderRadius: '8px', objectFit: 'contain', background: '#000' }}
                      />
                    ) : selectedPostDetails.postType === 'audio' ? (
                      <audio
                        src={selectedPostDetails.mediaUrls[0].mediaUrl}
                        controls
                        style={{ width: '100%', marginTop: '6px' }}
                      />
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: selectedPostDetails.mediaUrls.length > 1 ? 'repeat(auto-fit, minmax(180px, 1fr))' : '1fr',
                        gap: '8px'
                      }}>
                        {selectedPostDetails.mediaUrls.map((m, idx) => (
                          <img
                            key={idx}
                            src={m.mediaUrl}
                            alt=""
                            style={{
                              width: '100%',
                              maxHeight: '220px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid #E2E8F0',
                  fontSize: '12px',
                  color: '#64748B'
                }}>
                  <span>👍 {selectedPostDetails.likesCount || 0} Likes</span>
                  <span>💬 {selectedPostDetails.commentsCount || postComments.length} Comments</span>
                  {selectedPostDetails.publishedAt && (
                    <span>Published: {new Date(selectedPostDetails.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={17} color="#2563EB" />
                    <span>Comments on this Post ({postComments.length})</span>
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Moderation & direct admin reply
                  </span>
                </div>

                {loadingPostComments ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontSize: '14px' }}>
                    Loading comments for this post...
                  </div>
                ) : postComments.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px dashed #CBD5E1',
                    color: '#64748B',
                    fontSize: '14px'
                  }}>
                    <MessageSquare size={28} style={{ color: '#94A3B8', marginBottom: '8px' }} />
                    <p style={{ margin: 0 }}>No comments have been posted to this feed post yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {postComments.map(comment => {
                      const isAdmin = comment.authorName?.toLowerCase().includes('ellangala') ||
                                      comment.authorName?.toLowerCase().includes('admin');
                      return (
                        <div
                          key={comment.id}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: isAdmin ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                            background: isAdmin ? '#F0F7FF' : '#FFFFFF',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: isAdmin ? '#2563EB' : '#E2E8F0',
                                color: isAdmin ? '#FFFFFF' : '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '12px'
                              }}>
                                {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: '600', fontSize: '13px', color: '#0F172A' }}>
                                    {comment.authorName || 'Anonymous Member'}
                                  </span>
                                  {isAdmin && (
                                    <span style={{
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      background: '#2563EB',
                                      color: '#FFFFFF',
                                      padding: '2px 6px',
                                      borderRadius: '4px'
                                    }}>
                                      ADMIN / AUTHOR
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently'}
                                </div>
                              </div>
                            </div>

                            {/* Actions for this comment */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingToComment(comment);
                                  const mention = `@${comment.authorName} `;
                                  setAdminReplyText(prev => prev.includes(mention) ? prev : `${mention}${prev}`);
                                  if (replyInputRef.current) replyInputRef.current.focus();
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#EFF6FF',
                                  color: '#2563EB',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '5px 10px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                                title="Reply to this comment"
                              >
                                <Reply size={13} />
                                <span>Reply</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePostComment(comment.id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#FEE2E2',
                                  color: '#DC2626',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '5px 10px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                                title="Delete this comment"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>

                          <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap', paddingLeft: '42px' }}>
                            {comment.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Reply Composer Form */}
            <div style={{
              padding: '14px 22px',
              borderTop: '1px solid #E2E8F0',
              background: '#F8FAFC'
            }}>
              {replySuccessMsg && (
                <div style={{
                  marginBottom: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Check size={16} />
                  <span>{replySuccessMsg}</span>
                </div>
              )}

              {replyingToComment && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  background: '#EFF6FF',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#1D4ED8'
                }}>
                  <span>Replying to <strong>@{replyingToComment.authorName}</strong></span>
                  <button
                    type="button"
                    onClick={() => setReplyingToComment(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <form onSubmit={handlePostAdminReply}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <textarea
                    ref={replyInputRef}
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder={`Reply as Dr. Naveen Ellangala...`}
                    rows={2}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !adminReplyText.trim()}
                    className="admin-btn admin-btn--primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '44px',
                      padding: '0 16px',
                      whiteSpace: 'nowrap',
                      opacity: (isSubmittingReply || !adminReplyText.trim()) ? 0.6 : 1,
                      cursor: (isSubmittingReply || !adminReplyText.trim()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Send size={15} />
                    <span>{isSubmittingReply ? 'Posting...' : 'Post Reply'}</span>
                  </button>
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
                  Posting as <strong>{adminUser?.name || 'Dr. Naveen Ellangala'}</strong> (Admin)
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
