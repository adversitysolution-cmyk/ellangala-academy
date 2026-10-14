import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  User,
  Sparkles,
  Upload,
  RefreshCw,
  CheckCircle,
  Layout,
  Palette,
  BookOpen,
  Users,
  Compass,
  Heart,
  Award,
  Star,
  Shield,
  GraduationCap
} from 'lucide-react';
import { hexToRgb } from '../../features/community/components/CommunityWelcomeBanner';

export default function CommunityAdminPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') === 'quote-card'
    ? 'quote-card'
    : searchParams.get('tab') === 'hero-banner'
      ? 'hero-banner'
      : 'posts';
  const [activeTab, setActiveTab] = useState(initialTab); // 'posts' | 'comments' | 'quote-card' | 'hero-banner'

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab === 'quote-card') {
      setActiveTab('quote-card');
    } else if (tab === 'hero-banner') {
      setActiveTab('hero-banner');
    }
  }, [location.search]);

  // Quote Poster Card state & handlers
  const [quoteCardData, setQuoteCardData] = useState({
    quote: 'A calmer mind creates a brighter life.',
    author: 'DR. NAVEEN ELLANGALA',
    imageUrl: '/assets/images/community/mountain-quote-bg.jpg'
  });
  const [quoteCardLoading, setQuoteCardLoading] = useState(false);
  const [quoteCardSaving, setQuoteCardSaving] = useState(false);
  const [quoteCardSuccess, setQuoteCardSuccess] = useState('');
  const [quoteCardError, setQuoteCardError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const quoteImageInputRef = useRef(null);

  const loadQuoteCard = async () => {
    try {
      setQuoteCardLoading(true);
      const data = await communityAdminService.getQuoteCard();
      if (data) {
        setQuoteCardData({
          quote: data.quote || 'A calmer mind creates a brighter life.',
          author: data.author || 'DR. NAVEEN ELLANGALA',
          imageUrl: data.imageUrl || '/assets/images/community/mountain-quote-bg.jpg'
        });
      }
    } catch (err) {
      console.error('Error loading quote card:', err);
    } finally {
      setQuoteCardLoading(false);
    }
  };

  useEffect(() => {
    loadQuoteCard();
  }, []);

  const handleSaveQuoteCard = async (e) => {
    if (e) e.preventDefault();
    try {
      setQuoteCardSaving(true);
      setQuoteCardError('');
      setQuoteCardSuccess('');
      const res = await communityAdminService.updateQuoteCard({
        quote: quoteCardData.quote,
        author: quoteCardData.author,
        imageUrl: quoteCardData.imageUrl
      });
      if (res?.quoteCard) {
        setQuoteCardData(res.quoteCard);
      }
      setQuoteCardSuccess('Inspirational Poster Card updated successfully! Constant 3:4 dimensions applied.');
      setTimeout(() => setQuoteCardSuccess(''), 4000);
    } catch (err) {
      setQuoteCardError(err.message || 'Failed to save quote card.');
    } finally {
      setQuoteCardSaving(false);
    }
  };

  const handleQuoteImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      setQuoteCardError('');
      const uploadedUrl = await communityAdminService.uploadQuoteCardImage(file);
      setQuoteCardData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      setQuoteCardSuccess('New image uploaded! Click "Save Poster Changes" below to apply permanently.');
      setTimeout(() => setQuoteCardSuccess(''), 4000);
    } catch (err) {
      setQuoteCardError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
      if (quoteImageInputRef.current) quoteImageInputRef.current.value = '';
    }
  };

  const handleResetQuoteCardDefault = () => {
    if (window.confirm('Reset this poster card to the default mountain artwork and Dr. Naveen Ellangala quote?')) {
      setQuoteCardData({
        quote: 'A calmer mind creates a brighter life.',
        author: 'DR. NAVEEN ELLANGALA',
        imageUrl: '/assets/images/community/mountain-quote-bg.jpg'
      });
      setQuoteCardSuccess('Reset to default values. Click "Save Poster Changes" to persist.');
    }
  };

  // Feed Hero Banner CMS state & handlers
  const [heroBannerData, setHeroBannerData] = useState({
    heading: "Welcome to the\nEllangala Feed",
    subheading: "Learn, reflect, and grow with Dr. Naveen Ellangala.",
    imageUrl: "/assets/images/community/founder-feed-hero.png",
    gradientColor: "#FFFDF8",
    textColorMode: "auto",
    badge1: { text: "Meaningful Discussions", icon: "users" },
    badge2: { text: "Practical Wisdom", icon: "book" },
    badge3: { text: "Supportive Community", icon: "sparkles" }
  });
  const [heroBannerLoading, setHeroBannerLoading] = useState(false);
  const [heroBannerSaving, setHeroBannerSaving] = useState(false);
  const [heroBannerSuccess, setHeroBannerSuccess] = useState('');
  const [heroBannerError, setHeroBannerError] = useState('');
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const heroImageInputRef = useRef(null);

  const loadHeroBanner = async () => {
    try {
      setHeroBannerLoading(true);
      const data = await communityAdminService.getHeroBanner();
      if (data) {
        setHeroBannerData({
          heading: data.heading || "Welcome to the\nEllangala Feed",
          subheading: data.subheading || "Learn, reflect, and grow with Dr. Naveen Ellangala.",
          imageUrl: data.imageUrl || "/assets/images/community/founder-feed-hero.png",
          gradientColor: data.gradientColor || "#FFFDF8",
          textColorMode: data.textColorMode || "auto",
          badge1: {
            text: data.badge1?.text || "Meaningful Discussions",
            icon: data.badge1?.icon || "users"
          },
          badge2: {
            text: data.badge2?.text || "Practical Wisdom",
            icon: data.badge2?.icon || "book"
          },
          badge3: {
            text: data.badge3?.text || "Supportive Community",
            icon: data.badge3?.icon || "sparkles"
          }
        });
      }
    } catch (err) {
      console.error('Error loading hero banner:', err);
    } finally {
      setHeroBannerLoading(false);
    }
  };

  useEffect(() => {
    loadHeroBanner();
  }, []);

  const handleSaveHeroBanner = async (e) => {
    if (e) e.preventDefault();
    try {
      setHeroBannerSaving(true);
      setHeroBannerError('');
      setHeroBannerSuccess('');
      const res = await communityAdminService.updateHeroBanner(heroBannerData);
      if (res?.heroBanner) {
        setHeroBannerData(res.heroBanner);
      }
      setHeroBannerSuccess('Feed Hero Banner updated successfully! Changes are live on the feed.');
      setTimeout(() => setHeroBannerSuccess(''), 4500);
    } catch (err) {
      setHeroBannerError(err.message || 'Failed to save hero banner.');
    } finally {
      setHeroBannerSaving(false);
    }
  };

  const handleHeroImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingHeroImage(true);
      setHeroBannerError('');
      const uploadedUrl = await communityAdminService.uploadHeroBannerImage(file);
      setHeroBannerData(prev => ({ ...prev, imageUrl: uploadedUrl }));
      setHeroBannerSuccess('New hero image uploaded! Click "Save Banner Changes" below to apply live.');
      setTimeout(() => setHeroBannerSuccess(''), 4500);
    } catch (err) {
      setHeroBannerError(err.message || 'Hero image upload failed.');
    } finally {
      setUploadingHeroImage(false);
      if (heroImageInputRef.current) heroImageInputRef.current.value = '';
    }
  };

  const handleResetHeroBannerDefault = () => {
    if (window.confirm('Reset the feed hero banner to original defaults (Founder photograph, default text & Warm Sand gradient)?')) {
      setHeroBannerData({
        heading: "Welcome to the\nEllangala Feed",
        subheading: "Learn, reflect, and grow with Dr. Naveen Ellangala.",
        imageUrl: "/assets/images/community/founder-feed-hero.png",
        gradientColor: "#FFFDF8",
        textColorMode: "auto",
        badge1: { text: "Meaningful Discussions", icon: "users" },
        badge2: { text: "Practical Wisdom", icon: "book" },
        badge3: { text: "Supportive Community", icon: "sparkles" }
      });
      setHeroBannerSuccess('Reset to defaults. Click "Save Banner Changes" to persist.');
    }
  };

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
      <div
        className="admin-grid admin-grid--4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <StatCard title="Total Posts" value={totalPosts} icon={MessageSquareShare} color="#2563EB" bgColor="#EFF6FF" />
        <StatCard title="Published Live" value={publishedPosts} icon={CheckCircle2} color="#059669" bgColor="#ECFDF5" />
        <StatCard title="Scheduled Posts" value={scheduledPosts} icon={Clock} color="#D97706" bgColor="#FFFBEB" />
        <StatCard title="Total Comments" value={totalComments} icon={MessageSquare} color="#8B5CF6" bgColor="#F3E8FF" />
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

        <button
          type="button"
          onClick={() => {
            setActiveTab('quote-card');
            navigate('/admin/feed?tab=quote-card', { replace: true });
          }}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            background: 'none',
            color: activeTab === 'quote-card' ? '#CA8A38' : '#64748B',
            borderBottom: activeTab === 'quote-card' ? '2px solid #CA8A38' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} />
          <span>Sidebar Quote Poster Card</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'quote-card' ? '#FEF3C7' : '#F1F5F9',
              color: activeTab === 'quote-card' ? '#92400E' : '#64748B'
            }}
          >
            Fixed 3:4 Ratio
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('hero-banner');
            navigate('/admin/feed?tab=hero-banner', { replace: true });
          }}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            background: 'none',
            color: activeTab === 'hero-banner' ? '#CA8A38' : '#64748B',
            borderBottom: activeTab === 'hero-banner' ? '2px solid #CA8A38' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Layout size={16} />
          <span>Feed Hero Banner</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'hero-banner' ? '#FEF3C7' : '#F1F5F9',
              color: activeTab === 'hero-banner' ? '#92400E' : '#64748B'
            }}
          >
            Banner CMS
          </span>
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
                            <div style={{ fontSize: '11px', color: '#D97706', marginTop: '3px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                              ⏱ {new Date(post.scheduledFor).toLocaleString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
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
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenPostComments(post)}
                              className="admin-action-btn admin-action-btn--primary"
                              title="View Post Details & Comments"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/feed/${post.id}/edit`)}
                              className="admin-action-btn admin-action-btn--gold"
                              title="Edit Post"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModalPost(post)}
                              className="admin-action-btn admin-action-btn--danger"
                              title="Delete Post"
                            >
                              <Trash2 size={16} />
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
                            className="admin-btn admin-btn--sm admin-btn--secondary"
                            title="Reply to this comment as Admin"
                          >
                            <Reply size={13} />
                            Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModalComment(c)}
                            className="admin-btn admin-btn--sm admin-btn--danger"
                            title="Delete comment"
                          >
                            <Trash2 size={13} />
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

      {/* TAB 3: SIDEBAR QUOTE POSTER CARD */}
      {activeTab === 'quote-card' && (
        <div className="admin-card" style={{ padding: '24px' }}>
          {/* Section Heading Banner */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              paddingBottom: '20px',
              borderBottom: '1px solid #E2E8F0',
              marginBottom: '24px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#082349', margin: 0 }}>
                  Sidebar Inspiration Quote Poster
                </h3>
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    letterSpacing: '0.4px'
                  }}
                >
                  PERMANENT 3:4 RATIO (COVER FIT)
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                This vertical poster is displayed on the left sidebar of the community feed. Its dimensions and aspect ratio are permanently locked.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href="/feed"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                View on Live Feed ↗
              </a>
              <button
                type="button"
                onClick={handleSaveQuoteCard}
                disabled={quoteCardSaving}
                className="admin-btn admin-btn--primary"
                style={{
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(202, 138, 56, 0.3)'
                }}
              >
                <Check size={16} />
                {quoteCardSaving ? 'Saving Changes…' : 'Save Poster Changes'}
              </button>
            </div>
          </div>

          {/* Alerts */}
          {quoteCardSuccess && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600'
              }}
            >
              <CheckCircle size={18} color="#059669" />
              <span>{quoteCardSuccess}</span>
            </div>
          )}

          {quoteCardError && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600'
              }}
            >
              <AlertTriangle size={18} color="#DC2626" />
              <span>{quoteCardError}</span>
            </div>
          )}

          {/* Two-Column Editor Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'start' }}>
            {/* LEFT COLUMN: Editing Controls */}
            <form onSubmit={handleSaveQuoteCard} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Quote Content Field */}
              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                  Inspirational Quote Text:
                </label>
                <textarea
                  rows={4}
                  value={quoteCardData.quote}
                  onChange={(e) => setQuoteCardData({ ...quoteCardData, quote: e.target.value })}
                  placeholder="e.g. A calmer mind creates a brighter life."
                  className="admin-input"
                  style={{
                    width: '100%',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    padding: '12px',
                    borderRadius: '8px',
                    resize: 'vertical'
                  }}
                />
                <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px', display: 'block' }}>
                  The quote is displayed in Playfair Display serif italic with soft text-shadow for optimal contrast.
                </span>
              </div>

              {/* Author / Attribution Field */}
              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                  Author Attribution:
                </label>
                <input
                  type="text"
                  value={quoteCardData.author}
                  onChange={(e) => setQuoteCardData({ ...quoteCardData, author: e.target.value })}
                  placeholder="e.g. DR. NAVEEN ELLANGALA"
                  className="admin-input"
                  style={{
                    width: '100%',
                    fontWeight: '700',
                    fontSize: '13.5px',
                    letterSpacing: '0.05em'
                  }}
                />
                <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px', display: 'block' }}>
                  Appears in uppercase spaced typography beneath the quote.
                </span>
              </div>

              {/* Background Artwork Image Controls */}
              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', margin: 0 }}>
                    Poster Background Artwork:
                  </label>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                    Auto-Fit Cover Mode Active
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={quoteImageInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleQuoteImageFileSelect}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => quoteImageInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="admin-btn"
                    style={{
                      backgroundColor: '#082349',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: '700',
                      padding: '9px 18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Upload size={16} />
                    {uploadingImage ? 'Uploading Image…' : 'Upload Any Image File'}
                  </button>

                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Upload any image format or ratio (Max 5MB)
                  </span>
                </div>

                {/* Direct Image URL input */}
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
                    Or use image path / URL:
                  </label>
                  <input
                    type="text"
                    value={quoteCardData.imageUrl}
                    onChange={(e) => setQuoteCardData({ ...quoteCardData, imageUrl: e.target.value })}
                    placeholder="/assets/images/community/mountain-quote-bg.jpg"
                    className="admin-input"
                    style={{ width: '100%', fontSize: '12.5px', fontFamily: 'monospace' }}
                  />
                </div>

                {/* Constant Dimension Guarantee Note */}
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#1E40AF',
                    lineHeight: '1.5'
                  }}
                >
                  <strong>🔒 Constant Permanent Dimensions:</strong> You can upload any image shape (landscape 16:9, square 1:1, or tall portrait). The card silhouette is permanently locked to <strong>325px × 435px (3:4 ratio)</strong>. Every image is rendered with <code>object-fit: cover</code> centered, guaranteeing 100% distortion-free presentation without changing the card size.
                </div>
              </div>

              {/* Bottom Form Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  type="submit"
                  disabled={quoteCardSaving || uploadingImage}
                  className="admin-btn admin-btn--primary"
                  style={{ fontWeight: '700', padding: '12px 24px', fontSize: '14px' }}
                >
                  {quoteCardSaving ? 'Saving Changes…' : 'Save Poster Changes'}
                </button>

                <button
                  type="button"
                  onClick={handleResetQuoteCardDefault}
                  className="admin-btn"
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  <RefreshCw size={14} style={{ marginRight: '6px' }} />
                  Reset to Default
                </button>
              </div>
            </form>

            {/* RIGHT COLUMN: Live Interactive Preview */}
            <div>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  position: 'sticky',
                  top: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#082349', margin: 0 }}>
                      Live Preview
                    </h4>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      Exact scale as displayed on the live Community Sidebar
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      color: '#082349',
                      border: '1px solid #CBD5E1'
                    }}
                  >
                    325 × 435 px (Fixed Ratio)
                  </span>
                </div>

                {/* The Exact Constant Card */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    className="community-mountain-quote-card"
                    style={{
                      width: '325px',
                      height: '435px',
                      minHeight: '435px',
                      maxHeight: '435px',
                      aspectRatio: '896 / 1200',
                      position: 'relative',
                      boxShadow: '0 12px 32px rgba(8, 35, 73, 0.12)'
                    }}
                  >
                    <img
                      src={quoteCardData.imageUrl || '/assets/images/community/mountain-quote-bg.jpg'}
                      alt="Quote Poster Preview"
                      className="community-mountain-quote-bg-img"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/community/mountain-quote-bg.jpg';
                      }}
                    />
                    <div className="community-mountain-quote-overlay">
                      <blockquote className="community-mountain-quote-text">
                        “{quoteCardData.quote || 'A calmer mind creates a brighter life.'}”
                      </blockquote>
                      <cite className="community-mountain-quote-author">
                        {quoteCardData.author
                          ? (quoteCardData.author.startsWith('—') ? quoteCardData.author : `— ${quoteCardData.author}`)
                          : '— DR. NAVEEN ELLANGALA'}
                      </cite>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
                  Updates in real time as you edit the text or upload an image.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEED HERO BANNER CMS (Live Customizer) */}
      {activeTab === 'hero-banner' && (
        <div className="admin-card" style={{ padding: '24px' }}>
          {/* Section Heading Banner */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              paddingBottom: '20px',
              borderBottom: '1px solid #E2E8F0',
              marginBottom: '24px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#082349', margin: 0 }}>
                  Main Feed Page Hero Banner
                </h3>
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    letterSpacing: '0.4px'
                  }}
                >
                  LIVE CMS (IMAGE + TEXT + 3 BARS + GRADIENT)
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                This is the wide welcoming banner at the top of the community feed. Edit the background image, headings, 3 feature pill bars, and overlay gradient color.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href="/feed"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                View Live Feed ↗
              </a>
              <button
                type="button"
                onClick={handleSaveHeroBanner}
                disabled={heroBannerSaving}
                className="admin-btn admin-btn--primary"
                style={{
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(202, 138, 56, 0.3)'
                }}
              >
                <Check size={16} />
                {heroBannerSaving ? 'Saving Changes…' : 'Save Banner Changes'}
              </button>
            </div>
          </div>

          {/* Alerts */}
          {heroBannerSuccess && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <CheckCircle size={18} />
              <span>{heroBannerSuccess}</span>
            </div>
          )}

          {heroBannerError && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <AlertTriangle size={18} />
              <span>{heroBannerError}</span>
            </div>
          )}

          {/* 2-Column Responsive Layout: Editor Form + Real-Time Live Preview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '30px',
              alignItems: 'start'
            }}
          >
            {/* COLUMN 1: EDIT CONTROLS */}
            <form onSubmit={handleSaveHeroBanner} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* CARD 1: Background Photograph */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={16} color="#CA8A38" />
                    <span>Background Photograph</span>
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                    Fixed Aspect Ratio (Cover)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                  <img
                    src={heroBannerData.imageUrl || '/assets/images/community/founder-feed-hero.png'}
                    alt="Current Banner Thumbnail"
                    style={{
                      width: '120px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/community/founder-feed-hero.png';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <input
                      ref={heroImageInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      style={{ display: 'none' }}
                      onChange={handleHeroImageFileSelect}
                    />
                    <button
                      type="button"
                      onClick={() => heroImageInputRef.current?.click()}
                      disabled={uploadingHeroImage}
                      className="admin-btn"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #CA8A38',
                        color: '#B45309',
                        fontWeight: '700',
                        fontSize: '12.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                    >
                      <Upload size={14} />
                      {uploadingHeroImage ? 'Uploading Image…' : 'Upload New Hero Photo'}
                    </button>
                    <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#64748B' }}>
                      PNG, JPG, or WEBP up to 5MB. Photo fits right-side cover permanently.
                    </p>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                    Or Custom Image URL
                  </label>
                  <input
                    type="text"
                    value={heroBannerData.imageUrl}
                    onChange={(e) => setHeroBannerData({ ...heroBannerData, imageUrl: e.target.value })}
                    placeholder="/assets/images/community/founder-feed-hero.png or https://..."
                    className="admin-input"
                    style={{ fontSize: '12.5px', padding: '8px 12px' }}
                  />
                </div>
              </div>

              {/* CARD 2: Heading & Subheading Content */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <label style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <FileText size={16} color="#CA8A38" />
                  <span>Banner Title &amp; Description</span>
                </label>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                    Main Heading (Supports line breaks)
                  </label>
                  <textarea
                    rows={2}
                    value={heroBannerData.heading}
                    onChange={(e) => setHeroBannerData({ ...heroBannerData, heading: e.target.value })}
                    placeholder="Welcome to the&#10;Ellangala Feed"
                    className="admin-input"
                    style={{ fontSize: '14px', fontWeight: '600', resize: 'vertical' }}
                  />
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Tip: Press Enter to create a new line in the heading.
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                    Subheading / Supporting Description
                  </label>
                  <input
                    type="text"
                    value={heroBannerData.subheading}
                    onChange={(e) => setHeroBannerData({ ...heroBannerData, subheading: e.target.value })}
                    placeholder="Learn, reflect, and grow with Dr. Naveen Ellangala."
                    className="admin-input"
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* CARD 3: 3 Small Bar / Badge Contents */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="#CA8A38" />
                    <span>3 Feature Pill Bars</span>
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                    Text &amp; Icon for Each Pill
                  </span>
                </div>

                {/* Badge 1 */}
                <div style={{ marginBottom: '12px', padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#92400E', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Bar / Pill 1
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
                    <input
                      type="text"
                      value={heroBannerData.badge1?.text || ''}
                      onChange={(e) => setHeroBannerData({
                        ...heroBannerData,
                        badge1: { ...heroBannerData.badge1, text: e.target.value }
                      })}
                      placeholder="Meaningful Discussions"
                      className="admin-input"
                      style={{ fontSize: '12.5px', padding: '6px 10px' }}
                    />
                    <select
                      value={heroBannerData.badge1?.icon || 'users'}
                      onChange={(e) => setHeroBannerData({
                        ...heroBannerData,
                        badge1: { ...heroBannerData.badge1, icon: e.target.value }
                      })}
                      className="admin-input"
                      style={{ fontSize: '12px', padding: '6px 8px' }}
                    >
                      <option value="users">Icon: Users</option>
                      <option value="messagesquare">Icon: Discussion</option>
                      <option value="heart">Icon: Heart</option>
                      <option value="compass">Icon: Compass</option>
                      <option value="award">Icon: Award</option>
                    </select>
                  </div>
                </div>

                {/* Badge 2 */}
                <div style={{ marginBottom: '12px', padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#92400E', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Bar / Pill 2
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
                    <input
                      type="text"
                      value={heroBannerData.badge2?.text || ''}
                      onChange={(e) => setHeroBannerData({
                        ...heroBannerData,
                        badge2: { ...heroBannerData.badge2, text: e.target.value }
                      })}
                      placeholder="Practical Wisdom"
                      className="admin-input"
                      style={{ fontSize: '12.5px', padding: '6px 10px' }}
                    />
                    <select
                      value={heroBannerData.badge2?.icon || 'book'}
                      onChange={(e) => setHeroBannerData({
                        ...heroBannerData,
                        badge2: { ...heroBannerData.badge2, icon: e.target.value }
                      })}
                      className="admin-input"
                      style={{ fontSize: '12px', padding: '6px 8px' }}
                    >
                      <option value="book">Icon: BookOpen</option>
                      <option value="graduationcap">Icon: Learning</option>
                      <option value="award">Icon: Award</option>
                      <option value="star">Icon: Star</option>
                    </select>
                  </div>
                </div>

                {/* Badge 3 */}
                <div style={{ padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#92400E', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Bar / Pill 3
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
                    <input
                      type="text"
                      value={heroBannerData.badge3?.text || ''}
                      onChange={(e) => setHeroBannerData({
                        ...heroBannerData,
                        badge3: { ...heroBannerData.badge3, text: e.target.value }
                      })}
                      placeholder="Supportive Community"
                      className="admin-input"
                      style={{ fontSize: '12.5px', padding: '6px 10px' }}
                    />
                    <select
                      value={heroBannerData.badge3?.icon || 'sparkles'}
                      onChange={(e) => setHeroBannerData({
                        ...heroBannerData,
                        badge3: { ...heroBannerData.badge3, icon: e.target.value }
                      })}
                      className="admin-input"
                      style={{ fontSize: '12px', padding: '6px 8px' }}
                    >
                      <option value="sparkles">Icon: Sparkles</option>
                      <option value="shield">Icon: Shield</option>
                      <option value="heart">Icon: Heart</option>
                      <option value="star">Icon: Star</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CARD 4: Gradient Color & Contrast Options */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <label style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <Palette size={16} color="#CA8A38" />
                  <span>Overlay Gradient Color &amp; Tone</span>
                </label>

                {/* Color Swatches */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Preset Curated Themes
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {[
                      { name: 'Warm Sand', color: '#FFFDF8', border: '#ECE7DE' },
                      { name: 'Pure White', color: '#FFFFFF', border: '#E2E8F0' },
                      { name: 'Ivory Cream', color: '#FAF5EB', border: '#EFE7DA' },
                      { name: 'Sunrise Amber', color: '#FEF3C7', border: '#FDE68A' },
                      { name: 'Academy Navy', color: '#082349', border: '#1E3A8A' },
                      { name: 'Slate Midnight', color: '#0F172A', border: '#334155' },
                      { name: 'Forest Sage', color: '#F0FDF4', border: '#DCFCE7' },
                      { name: 'Warm Peach', color: '#FFF7ED', border: '#FFEDD5' }
                    ].map((swatch) => {
                      const isSelected = heroBannerData.gradientColor?.toUpperCase() === swatch.color.toUpperCase();
                      return (
                        <button
                          key={swatch.color}
                          type="button"
                          onClick={() => setHeroBannerData({ ...heroBannerData, gradientColor: swatch.color })}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 10px',
                            backgroundColor: '#FFFFFF',
                            border: isSelected ? '2px solid #CA8A38' : '1px solid #E2E8F0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            boxShadow: isSelected ? '0 0 0 2px rgba(202, 138, 56, 0.2)' : 'none'
                          }}
                        >
                          <span
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              backgroundColor: swatch.color,
                              border: `1px solid ${swatch.border}`,
                              flexShrink: 0
                            }}
                          />
                          <span style={{ fontSize: '11px', fontWeight: isSelected ? '700' : '500', color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {swatch.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Picker & Hex */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                      Custom Color Picker
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={heroBannerData.gradientColor || '#FFFDF8'}
                        onChange={(e) => setHeroBannerData({ ...heroBannerData, gradientColor: e.target.value })}
                        style={{
                          width: '42px',
                          height: '36px',
                          padding: 0,
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      />
                      <input
                        type="text"
                        value={heroBannerData.gradientColor || '#FFFDF8'}
                        onChange={(e) => setHeroBannerData({ ...heroBannerData, gradientColor: e.target.value })}
                        placeholder="#FFFDF8"
                        className="admin-input"
                        style={{ fontSize: '13px', padding: '6px 10px', textTransform: 'uppercase' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
                      Text Contrast Mode
                    </label>
                    <select
                      value={heroBannerData.textColorMode || 'auto'}
                      onChange={(e) => setHeroBannerData({ ...heroBannerData, textColorMode: e.target.value })}
                      className="admin-input"
                      style={{ fontSize: '12.5px', padding: '7px 10px' }}
                    >
                      <option value="auto">Auto Contrast (Recommended)</option>
                      <option value="dark">Dark Text (For light colors)</option>
                      <option value="light">Light Text (For dark navy/black)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  type="submit"
                  disabled={heroBannerSaving}
                  className="admin-btn admin-btn--primary"
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(202, 138, 56, 0.25)'
                  }}
                >
                  <Check size={16} />
                  {heroBannerSaving ? 'Saving Changes…' : 'Save Banner Changes Permanently'}
                </button>
                <button
                  type="button"
                  onClick={handleResetHeroBannerDefault}
                  className="admin-btn"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#64748B',
                    padding: '12px 16px',
                    fontWeight: '600'
                  }}
                  title="Reset to default banner configuration"
                >
                  <RefreshCw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </form>

            {/* COLUMN 2: REAL-TIME LIVE PREVIEW */}
            <div
              style={{
                position: 'sticky',
                top: '20px',
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={16} color="#CA8A38" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#082349' }}>
                    REAL-TIME LIVE FEED PREVIEW
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    color: '#082349',
                    border: '1px solid #CBD5E1'
                  }}
                >
                  Exact 1:1 Rendering
                </span>
              </div>

              {/* Live Preview Container */}
              {(() => {
                const rgb = hexToRgb(heroBannerData.gradientColor || '#FFFDF8');
                const isDark = heroBannerData.textColorMode === 'dark'
                  ? true
                  : heroBannerData.textColorMode === 'light'
                    ? false
                    : !rgb.isDark;

                const previewGradient = `linear-gradient(90deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.96) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.90) 45%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35) 68%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 100%)`;

                const getPreviewIcon = (iconName, fallback) => {
                  switch ((iconName || '').toLowerCase()) {
                    case 'users': return Users;
                    case 'book': return BookOpen;
                    case 'sparkles': return Sparkles;
                    case 'heart': return Heart;
                    case 'compass': return Compass;
                    case 'award': return Award;
                    case 'star': return Star;
                    case 'shield': return Shield;
                    case 'graduationcap': return GraduationCap;
                    default: return fallback;
                  }
                };

                const PreviewIcon1 = getPreviewIcon(heroBannerData.badge1?.icon, Users);
                const PreviewIcon2 = getPreviewIcon(heroBannerData.badge2?.icon, BookOpen);
                const PreviewIcon3 = getPreviewIcon(heroBannerData.badge3?.icon, Sparkles);

                return (
                  <div
                    className="community-welcome-banner-mock"
                    style={{
                      backgroundImage: `${previewGradient}, url(${heroBannerData.imageUrl || '/assets/images/community/founder-feed-hero.png'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'right center',
                      backgroundRepeat: 'no-repeat',
                      minHeight: '360px',
                      padding: '40px 24px',
                      borderRadius: '16px',
                      border: '1px solid #EBE2D3',
                      boxShadow: '0 8px 24px rgba(8, 35, 73, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <div style={{ maxWidth: '65%', zIndex: 2 }}>
                      <h2
                        className="community-wb-heading"
                        style={{
                          color: isDark ? '#0F172A' : '#FFFFFF',
                          textShadow: isDark
                            ? '0 1px 2px rgba(255, 255, 255, 0.9)'
                            : '0 2px 4px rgba(0, 0, 0, 0.45)',
                          fontSize: '26px',
                          lineHeight: '1.25',
                          whiteSpace: 'pre-line',
                          margin: '0 0 12px 0'
                        }}
                      >
                        {heroBannerData.heading || "Welcome to the\nEllangala Feed"}
                      </h2>
                      <p
                        className="community-wb-subheading"
                        style={{
                          color: isDark ? '#334155' : '#E2E8F0',
                          textShadow: isDark
                            ? '0 1px 2px rgba(255, 255, 255, 0.8)'
                            : '0 1px 3px rgba(0, 0, 0, 0.4)',
                          fontSize: '13.5px',
                          margin: '0 0 20px 0'
                        }}
                      >
                        {heroBannerData.subheading || "Learn, reflect, and grow with Dr. Naveen Ellangala."}
                      </p>

                      <div className="community-wb-features-row" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {heroBannerData.badge1?.text && (
                          <div
                            className="community-wb-feature-item"
                            style={{
                              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.18)',
                              color: isDark ? '#0F172A' : '#FFFFFF',
                              borderColor: isDark ? 'rgba(220, 205, 185, 0.7)' : 'rgba(255, 255, 255, 0.35)',
                              fontSize: '9.5px',
                              padding: '3px 8px'
                            }}
                          >
                            <PreviewIcon1 size={10} className="community-wb-feature-icon" />
                            <span>{heroBannerData.badge1.text}</span>
                          </div>
                        )}

                        {heroBannerData.badge2?.text && (
                          <div
                            className="community-wb-feature-item"
                            style={{
                              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.18)',
                              color: isDark ? '#0F172A' : '#FFFFFF',
                              borderColor: isDark ? 'rgba(220, 205, 185, 0.7)' : 'rgba(255, 255, 255, 0.35)',
                              fontSize: '9.5px',
                              padding: '3px 8px'
                            }}
                          >
                            <PreviewIcon2 size={10} className="community-wb-feature-icon" />
                            <span>{heroBannerData.badge2.text}</span>
                          </div>
                        )}

                        {heroBannerData.badge3?.text && (
                          <div
                            className="community-wb-feature-item"
                            style={{
                              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.18)',
                              color: isDark ? '#0F172A' : '#FFFFFF',
                              borderColor: isDark ? 'rgba(220, 205, 185, 0.7)' : 'rgba(255, 255, 255, 0.35)',
                              fontSize: '9.5px',
                              padding: '3px 8px'
                            }}
                          >
                            <PreviewIcon3 size={10} className="community-wb-feature-icon" />
                            <span>{heroBannerData.badge3.text}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
                Updates in real time as you edit the text, change colors, or upload an image.
              </div>
            </div>
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
                className="admin-btn admin-btn--secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                className="admin-btn admin-btn--danger"
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
                className="admin-btn admin-btn--secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteComment}
                className="admin-btn admin-btn--danger"
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
                  className="admin-btn admin-btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuickReply || !quickReplyText.trim()}
                  className="admin-btn admin-btn--primary"
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
