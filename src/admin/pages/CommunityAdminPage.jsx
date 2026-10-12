import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { communityAdminService } from '../services/communityAdminService';
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
  ShieldAlert
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
  const [previewPost, setPreviewPost] = useState(null);

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
      title="Community Feed & Discussions"
      subtitle="Manage community posts, scheduled reflections, announcements, and comment moderation"
      action={
        <button
          type="button"
          onClick={() => navigate('/admin/community/new')}
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
                          <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '14px', marginBottom: '4px' }}>
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
                          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748B' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ThumbsUp size={13} /> {post.likesCount || 0}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MessageSquare size={13} /> {post.commentsCount || 0}
                            </span>
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
                              onClick={() => setPreviewPost(post)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748B',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                              title="Preview"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/community/${post.id}/edit`)}
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
                          {c.status === 'hidden' ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateCommentStatus(c.id, 'approved')}
                              style={{
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#059669',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateCommentStatus(c.id, 'hidden')}
                              style={{
                                background: '#FFFBEB',
                                border: '1px solid #FDE68A',
                                color: '#D97706',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Hide
                            </button>
                          )}
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

      {/* QUICK PREVIEW MODAL */}
      {previewPost && (
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
            borderRadius: '16px',
            maxWidth: '580px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Post Preview</h4>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{previewPost.title}</h3>
            <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {previewPost.content}
            </p>
            {previewPost.mediaUrls?.length > 0 && (
              <img
                src={previewPost.mediaUrls[0].mediaUrl}
                alt="Post preview"
                style={{ width: '100%', borderRadius: '8px', maxHeight: '300px', objectFit: 'cover', marginTop: '12px' }}
              />
            )}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="admin-btn admin-btn--primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
