import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Pin,
  Upload,
  X,
  Plus,
  Eye,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Link as LinkIcon,
  ArrowLeft
} from 'lucide-react';
import { communityAdminService } from '../services/communityAdminService';
import { useAdminAuth } from '../context/AdminAuthContext';

const aspectRatioOptions = [
  { value: '16:9', label: '16:9 (Landscape)', desc: 'Standard widescreen video & horizontal photos' },
  { value: '1:1', label: '1:1 (Square)', desc: 'Classic Instagram square for posters & quotes' },
  { value: '4:5', label: '4:5 (Portrait)', desc: 'Instagram portrait feed standard (phone photos)' },
  { value: '9:16', label: '9:16 (Reel / Vertical)', desc: 'Full vertical phone video (safely clamped)' },
  { value: 'auto', label: 'Auto (Original)', desc: 'Natural size with 520px height cap' }
];

export default function CommunityPostForm({ initialData = null, onSubmit, isSubmitting = false }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { currentUser } = useAdminAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    categoryName: '',
    authorName: initialData?.authorName || currentUser?.name || 'Dr. Naveen Ellangala',
    authorRole: initialData?.authorRole || currentUser?.role || 'Founder & Positive Psychologist',
    authorAvatar: initialData?.authorAvatar !== undefined ? initialData.authorAvatar : (currentUser?.avatar || ''),
    postType: 'text',
    aspectRatio: '16:9',
    mediaUrls: [],
    externalMediaUrl: '',
    relatedCourseSlug: '',
    relatedCourseTitle: '',
    relatedEventId: '',
    relatedEventTitle: '',
    status: 'published',
    isPinned: false,
    scheduledFor: ''
  });

  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    // Load categories and link options
    communityAdminService.getCategories().then(cats => {
      setCategories(cats || []);
      if (!initialData && cats && cats.length > 0) {
        setFormData(prev => ({
          ...prev,
          categoryId: cats[0].id,
          categoryName: cats[0].name
        }));
      }
    }).catch(() => {});

    communityAdminService.getAvailableLinkOptions().then(({ courses, events }) => {
      setCourses(courses || []);
      setEvents(events || []);
    }).catch(() => {});

    if (initialData) {
      let sched = '';
      if (initialData.scheduledFor) {
        try {
          const d = new Date(initialData.scheduledFor);
          sched = d.toISOString().slice(0, 16);
        } catch (_) {}
      }

      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        categoryId: initialData.categoryId || '',
        categoryName: initialData.categoryName || '',
        authorName: initialData.authorName || currentUser?.name || 'Dr. Naveen Ellangala',
        authorRole: initialData.authorRole || currentUser?.role || 'Founder & Positive Psychologist',
        authorAvatar: initialData.authorAvatar !== undefined ? initialData.authorAvatar : (currentUser?.avatar || ''),
        postType: initialData.postType || 'text',
        aspectRatio: initialData.aspectRatio || '16:9',
        mediaUrls: Array.isArray(initialData.mediaUrls) ? initialData.mediaUrls : [],
        externalMediaUrl: initialData.externalMediaUrl || '',
        relatedCourseSlug: initialData.relatedCourseSlug || '',
        relatedCourseTitle: initialData.relatedCourseTitle || '',
        relatedEventId: initialData.relatedEventId || '',
        relatedEventTitle: initialData.relatedEventTitle || '',
        status: initialData.status || 'published',
        isPinned: Boolean(initialData.isPinned),
        scheduledFor: sched
      });
    }
  }, [initialData]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 2MB maximum file limit check (2 * 1024 * 1024 bytes)
    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    const oversizedFiles = files.filter(f => f.size > MAX_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      const oversizedInfo = oversizedFiles.map(f => `"${f.name}" (${(f.size / (1024 * 1024)).toFixed(2)}MB)`).join(', ');
      setUploadError(`Maximum allowed file size is 2MB. The following file(s) exceed 2MB: ${oversizedInfo}. Please select files up to 2MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const uploadResults = await communityAdminService.uploadMediaFiles(files);

      setFormData(prev => {
        const nextMedia = [...prev.mediaUrls, ...uploadResults];
        let nextType = prev.postType;
        if (nextMedia.length > 1) nextType = 'gallery';
        else if (nextMedia.length === 1) nextType = nextMedia[0].mediaType === 'audio' ? 'audio' : (nextMedia[0].mediaType === 'video' ? 'video' : 'single_image');
        return {
          ...prev,
          mediaUrls: nextMedia,
          postType: nextType,
          aspectRatio: prev.aspectRatio || '16:9'
        };
      });
    } catch (err) {
      setUploadError(err.message || 'File upload failed. Maximum size is 2MB per file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = (idxToRemove) => {
    setFormData(prev => {
      const nextMedia = prev.mediaUrls.filter((_, idx) => idx !== idxToRemove);
      let nextType = nextMedia.length === 0 ? 'text' : (nextMedia.length === 1 ? 'single_image' : 'gallery');
      return {
        ...prev,
        mediaUrls: nextMedia,
        postType: nextType
      };
    });
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const catObj = categories.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      categoryId: catId,
      categoryName: catObj ? catObj.name : ''
    }));
  };

  const handleCourseChange = (e) => {
    const slug = e.target.value;
    const courseObj = courses.find(c => c.slug === slug);
    setFormData(prev => ({
      ...prev,
      relatedCourseSlug: slug,
      relatedCourseTitle: courseObj ? courseObj.title : ''
    }));
  };

  const handleEventChange = (e) => {
    const evtId = e.target.value;
    const evtObj = events.find(ev => ev.id === evtId);
    setFormData(prev => ({
      ...prev,
      relatedEventId: evtId,
      relatedEventTitle: evtObj ? evtObj.title : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.title.trim()) {
      setValidationError('Please provide a post title.');
      return;
    }
    if (!formData.content.trim()) {
      setValidationError('Please provide post narrative content.');
      return;
    }
    if (formData.status === 'scheduled' && !formData.scheduledFor) {
      setValidationError('Please choose a scheduled date and time for scheduled publication.');
      return;
    }

    let finalMedia = [...formData.mediaUrls];
    if (formData.externalMediaUrl.trim() && (formData.postType === 'video' || formData.postType === 'audio')) {
      finalMedia.unshift({
        id: `ext-${Date.now()}`,
        mediaType: formData.postType,
        mediaUrl: formData.externalMediaUrl.trim(),
        caption: formData.title
      });
    }

    const hasMedia = finalMedia.length > 0 ||
                     Boolean(formData.externalMediaUrl.trim()) ||
                     formData.postType !== 'text';

    if (hasMedia && !formData.aspectRatio) {
      setValidationError('Please select a required aspect ratio (e.g. 16:9, 1:1, 4:5, or 9:16) for your uploaded media.');
      return;
    }

    const payload = {
      ...formData,
      mediaUrls: finalMedia,
      aspectRatio: formData.aspectRatio || '16:9',
      scheduledFor: formData.status === 'scheduled' && formData.scheduledFor
        ? new Date(formData.scheduledFor).toISOString()
        : null
    };

    onSubmit(payload);
  };

  const postTypeOptions = [
    { type: 'text', label: 'Text Only', icon: FileText },
    { type: 'single_image', label: 'Single Poster', icon: ImageIcon },
    { type: 'gallery', label: 'Photo Gallery', icon: Plus },
    { type: 'video', label: 'Video', icon: Video },
    { type: 'audio', label: 'Audio Reflection', icon: Music }
  ];

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Top Header Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/admin/feed')}
          className="btn-secondary-outline"
        >
          <ArrowLeft size={16} /> Back to Feed Posts
        </button>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/feed')}
            className="btn-secondary-outline"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="btn-secondary-outline"
          >
            <Eye size={16} /> Preview Card
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary-gold"
          >
            <Check size={16} />
            <span>{isSubmitting ? 'Saving...' : (initialData ? 'Update Post' : 'Publish Post')}</span>
          </button>
        </div>
      </div>

      {validationError && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          color: '#B91C1C',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN: Main Editorial Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Article Main Info */}
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <div className="admin-card__title">Post Content &amp; Guidance</div>
                <div className="admin-card__sub">Title, author attribution, and reflection narrative</div>
              </div>
            </div>

            <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="admin-label">
                  Post Title <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Strengthening Mental Fitness: The Science of Mind Training"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Author Name</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="Dr. Naveen Ellangala"
                  className="admin-input"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Post Narrative / Reflections <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Supports line breaks</span>
                </div>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share thoughtful positive psychology wisdom, quotes, or community announcements..."
                  className="admin-input"
                  style={{ lineHeight: '1.6', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Media & Visual Attachments */}
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <div className="admin-card__title">Media &amp; Visual Attachments</div>
                <div className="admin-card__sub">Attach posters, photo carousels, guided audio, or video embeds</div>
              </div>
            </div>

            <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Format Type Selector Pills */}
              <div>
                <label className="admin-label">Content Format</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {postTypeOptions.map(item => {
                    const Icon = item.icon;
                    const active = formData.postType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          postType: item.type,
                          aspectRatio: prev.aspectRatio || '16:9'
                        }))}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          fontSize: '12.5px',
                          fontWeight: active ? '700' : '500',
                          background: active ? '#FFF7E8' : '#F8FAFC',
                          color: active ? '#CA8A38' : '#475569',
                          border: `1px solid ${active ? '#FDE68A' : '#E2E8F0'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Icon size={14} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Video / Audio External Link Input */}
              {(formData.postType === 'video' || formData.postType === 'audio') && (
                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LinkIcon size={14} />
                    External {formData.postType === 'video' ? 'Video' : 'Audio'} Embed or Streaming URL
                  </label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder={formData.postType === 'video' ? 'https://www.youtube.com/watch?v=... or Vimeo link' : 'https://example.com/audio.mp3'}
                    value={formData.externalMediaUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, externalMediaUrl: e.target.value }))}
                    style={{ marginTop: '6px' }}
                  />
                </div>
              )}

              {/* Media Display Aspect Ratio Selector (REQUIRED FOR MEDIA) */}
              <div style={{ background: '#FFFDF9', border: '1px solid #F3E8D6', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', color: '#1E293B' }}>Media Aspect Ratio</span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#B91C1C',
                      background: '#FEE2E2',
                      border: '1px solid #FECACA',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      letterSpacing: '0.02em'
                    }}>
                      * Required for Upload
                    </span>
                  </label>
                  <span style={{ fontSize: '12px', color: '#B87B28', fontWeight: '700' }}>
                    Active: {formData.aspectRatio || '16:9'}
                  </span>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '11.5px', color: '#64748B' }}>
                  Select the required frame ratio (like Instagram 1:1, 16:9 widescreen, or 4:5 portrait) to ensure your media fits gracefully in the feed without overflowing.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {aspectRatioOptions.map(opt => {
                    const active = (formData.aspectRatio || '16:9') === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            aspectRatio: opt.value,
                            postType: prev.postType === 'text' ? 'single_image' : prev.postType
                          }));
                          setValidationError('');
                        }}
                        style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          borderRadius: '8px',
                          border: `2px solid ${active ? '#CA8A38' : '#E2E8F0'}`,
                          backgroundColor: active ? '#FFFBF2' : '#FFFFFF',
                          boxShadow: active ? '0 2px 6px rgba(202, 138, 56, 0.2)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: active ? '700' : '600', color: active ? '#9A5B0B' : '#1E293B' }}>
                            {opt.label}
                          </span>
                          {active && (
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CA8A38' }} />
                          )}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '3px', lineHeight: '1.3' }}>
                          {opt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Upload Files</label>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#B91C1C',
                    background: '#FEE2E2',
                    border: '1px solid #FECACA',
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}>
                    Max 2MB per file
                  </span>
                </div>
                <div
                  style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '10px',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#FAF8F5',
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/mp4,audio/mp3,audio/wav"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#FFF7E8',
                    color: '#CA8A38',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <Upload size={20} />
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '13.5px', fontWeight: '700', color: '#1E293B' }}>
                    {isUploading ? 'Uploading files...' : 'Click or Drag files to attach media'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                    Supports JPEG, PNG, WEBP, MP4, and MP3 (Max 2MB per file)
                  </p>
                  <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#9A5B0B', background: '#FFF7E8', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' }}>
                    Enforced Frame Ratio: <strong>{formData.aspectRatio || '16:9'}</strong>
                  </div>
                </div>

                {uploadError && (
                  <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '8px', marginBottom: 0, fontWeight: '600' }}>
                    {uploadError}
                  </p>
                )}
              </div>

              {/* Attached Media Grid */}
              {formData.mediaUrls.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', margin: 0 }}>
                      Attached Media ({formData.mediaUrls.length})
                    </h5>
                    <span style={{ fontSize: '11.5px', color: '#CA8A38', fontWeight: '700' }}>
                      Ratio: {formData.aspectRatio || '16:9'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                    {formData.mediaUrls.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          aspectRatio: '1'
                        }}
                      >
                        {item.mediaType === 'video' ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#FFFFFF' }}>
                            <Video size={24} />
                          </div>
                        ) : item.mediaType === 'audio' ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', color: '#2563EB' }}>
                            <Music size={24} />
                          </div>
                        ) : (
                          <img
                            src={item.mediaUrl}
                            alt="Upload preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                        <span style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '4px',
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}>
                          {formData.aspectRatio || '16:9'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMedia(idx);
                          }}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'rgba(15, 23, 42, 0.75)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          title="Remove item"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings, Channels & Associations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 3: Publishing Settings */}
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <div className="admin-card__title">Publishing Settings</div>
                <div className="admin-card__sub">Status, scheduling, and pinned priority</div>
              </div>
            </div>

            <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Post Status</label>
                <select
                  className="admin-input"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="published">Publish Immediately</option>
                  <option value="draft">Save as Draft</option>
                  <option value="scheduled">Schedule Publication</option>
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <div style={{
                  padding: '12px',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '8px'
                }}>
                  <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400E', fontWeight: '700' }}>
                    <Clock size={14} />
                    Scheduled Date &amp; Time (IST)
                  </label>
                  <input
                    type="datetime-local"
                    className="admin-input"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                    style={{ marginTop: '6px', background: '#FFFFFF' }}
                    required
                  />
                  <span style={{ fontSize: '11px', color: '#B45309', display: 'block', marginTop: '4px' }}>
                    Automatically publishes on this date (IST).
                  </span>
                </div>
              )}

              {/* Pin to Top Checkbox */}
              <div style={{
                padding: '12px 14px',
                background: formData.isPinned ? '#FFF7E8' : '#F8FAFC',
                border: `1px solid ${formData.isPinned ? '#FDE68A' : '#E2E8F0'}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Pin size={18} color={formData.isPinned ? '#CA8A38' : '#94A3B8'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>
                      Pin to Top
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Sticky announcement badge at top of feed
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#CA8A38' }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Category Channel */}
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <div className="admin-card__title">Category Channel</div>
                <div className="admin-card__sub">Organize by community focus topic</div>
              </div>
            </div>

            <div className="admin-card__body">
              <label className="admin-label">
                Select Channel <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                className="admin-input"
                value={formData.categoryId}
                onChange={handleCategoryChange}
                required
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Card 5: Curriculum & Event Association */}
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <div className="admin-card__title">Curriculum &amp; Event Links</div>
                <div className="admin-card__sub">Optional academy workshop and course cross-linking</div>
              </div>
            </div>

            <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Related Course Program</label>
                <select
                  className="admin-input"
                  value={formData.relatedCourseSlug}
                  onChange={handleCourseChange}
                >
                  <option value="">— None (General Post) —</option>
                  {courses.map(c => (
                    <option key={c.slug} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-label">Related Scheduled Workshop</label>
                <select
                  className="admin-input"
                  value={formData.relatedEventId}
                  onChange={handleEventChange}
                >
                  <option value="">— None (No Event Link) —</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} {ev.date ? `(${ev.date})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE PREVIEW MODAL */}
      {showPreviewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#CA8A38" />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Live Feed Card Preview</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <article style={{ background: '#FFFFFF', border: '1px solid #ECE7DE', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {formData.authorAvatar ? (
                  <img
                    src={formData.authorAvatar}
                    alt={formData.authorName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#082349',
                      color: '#CA8A38',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: '1.5px solid #CA8A38',
                      flexShrink: 0
                    }}
                  >
                    {((formData.authorName || 'Admin').split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('') || 'AA').toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E1A16' }}>{formData.authorName || 'Dr. Naveen Ellangala'}</span>
                    {formData.isPinned && (
                      <span style={{ fontSize: '11px', background: '#FCF8EE', color: '#B87B28', border: '1px solid #F3E5CA', padding: '1px 7px', borderRadius: '12px', fontWeight: '700' }}>
                        📌 Pinned
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: '#78716C' }}>Just now • {formData.categoryName || 'Announcement'}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1A16', margin: 0 }}>
                {formData.title || 'Untitled Discussion'}
              </h3>
              <p style={{ fontSize: '14px', color: '#44403C', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                {formData.content || 'Content will appear here...'}
              </p>

              {formData.mediaUrls.length > 0 && (
                <div
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #EAE5DC',
                    aspectRatio: formData.aspectRatio === '1:1' ? '1 / 1' : (formData.aspectRatio === '4:5' ? '4 / 5' : (formData.aspectRatio === '9:16' ? '9 / 16' : '16 / 9')),
                    maxWidth: formData.aspectRatio === '9:16' ? '240px' : (formData.aspectRatio === '4:5' ? '320px' : (formData.aspectRatio === '1:1' ? '360px' : '100%')),
                    margin: '0 auto',
                    background: '#0B0F19'
                  }}
                >
                  {formData.postType === 'video' || formData.mediaUrls[0]?.mediaType === 'video' ? (
                    <video
                      controls
                      src={formData.mediaUrls[0]?.mediaUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    />
                  ) : (
                    <img
                      src={formData.mediaUrls[0]?.mediaUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                </div>
              )}
            </article>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="btn-primary-gold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
