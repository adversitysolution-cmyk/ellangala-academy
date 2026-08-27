import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  FileText,
  Globe,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  Check,
  Eye,
  Search,
  Upload,
  User,
  Clock,
  Tag
} from 'lucide-react';
import { siteConfig } from '../../seo/siteConfig';
import { uploadService } from '../services/uploadService';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean']
  ]
};

export default function BlogForm({ initialData = null, onSubmit, isSubmitting = false }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Positive Psychology',
    excerpt: '',
    content: '',
    image: '/assets/images/blog/blog-mind-gym.png',
    author: 'Dr. Naveen Ellangala',
    status: 'published',
    readTime: '8 Mins Read',
    seo: {
      title: '',
      description: '',
      image: '',
      noindex: false
    }
  });

  const [showSeoSection, setShowSeoSection] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        category: initialData.category || 'Positive Psychology',
        excerpt: initialData.excerpt || '',
        content: initialData.content || initialData.details?.text1 || '',
        image: initialData.image || '/assets/images/blog/blog-mind-gym.png',
        author: initialData.author || 'Dr. Naveen Ellangala',
        status: initialData.status || 'published',
        readTime: initialData.readTime || '8 Mins Read',
        seo: {
          title: initialData.seo?.title || '',
          description: initialData.seo?.description || '',
          image: initialData.seo?.image || '',
          noindex: Boolean(initialData.seo?.noindex)
        }
      });
    }
  }, [initialData]);

  // Handle title changes & auto-slug generation
  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    const newSlug = titleVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData(prev => ({
      ...prev,
      title: titleVal,
      slug: prev.slug === '' || prev.slug === newSlug.slice(0, -1) ? newSlug : prev.slug
    }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSeoChange = (seoField, value) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [seoField]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isContentEmpty = !formData.content || formData.content === '<p><br></p>';
    if (isContentEmpty) {
      setUploadError('');
      alert('Please write the article body before publishing.');
      return;
    }
    onSubmit(formData);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setIsUploadingImage(true);
    try {
      const { url } = await uploadService.uploadImage(file);
      handleChange('image', url);
    } catch (err) {
      setUploadError(err.message || 'Image upload failed.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // SEO Computed Preview Values
  const effectiveTitle = formData.seo.title.trim() || (formData.title ? `${formData.title} | ${siteConfig.name}` : siteConfig.defaultTitle);
  const effectiveDesc = formData.seo.description.trim() || formData.excerpt || siteConfig.defaultDescription;
  const effectiveSlug = formData.slug || 'article-slug';
  const effectiveUrl = `${siteConfig.url}/insights/${effectiveSlug}`;

  const titleOverLimit = effectiveTitle.length > 60;
  const descOverLimit = effectiveDesc.length > 160;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Header Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/admin/blogs')}
          className="admin-btn admin-btn--secondary"
        >
          <ArrowLeft size={16} /> Back to Blogs
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
            className="admin-btn admin-btn--secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-btn admin-btn--primary"
          >
            <Check size={16} /> {isSubmitting ? 'Saving...' : (initialData ? 'Update Article' : 'Publish Article')}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Content Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Article Main Info */}
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <div className="admin-card__title">Article Content</div>
                <div className="admin-card__subtitle">Title, excerpt, and main body text</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="admin-form-label required">Article Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Strengthening Mental Fitness: The Science of Positive Mind Gym"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-form-label required">URL Slug</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>
                    {siteConfig.url}/insights/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="article-url-slug"
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-form-label required">Short Excerpt / Summary</label>
                <textarea
                  required
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="A concise summary of the article displayed in listing cards and search previews..."
                  className="admin-textarea"
                />
              </div>

              <div>
                <label className="admin-form-label required">Full Content / Article Body</label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(html) => handleChange('content', html)}
                  modules={QUILL_MODULES}
                  placeholder="Write the full article body — insights, paragraphs, and takeaways..."
                  style={{ backgroundColor: '#fff' }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Dynamic SEO & Metadata Section */}
          <div className="admin-card">
            <div
              className="admin-card__header"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowSeoSection(!showSeoSection)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={20} color="#CA8A38" />
                <div>
                  <div className="admin-card__title">Search Engine Optimization (SEO)</div>
                  <div className="admin-card__subtitle">Customize SEO meta tags, OpenGraph preview & canonical settings</div>
                </div>
              </div>

              <span style={{ fontSize: '12px', fontWeight: '700', color: '#CA8A38' }}>
                {showSeoSection ? 'Hide SEO' : 'Edit SEO'}
              </span>
            </div>

            {showSeoSection && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '10px' }}>
                {/* Live Google Search Result Preview */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '16px',
                    fontFamily: 'arial, sans-serif'
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#4D5156', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Search size={13} color="#4D5156" /> Google Search Preview
                  </div>
                  <div style={{ fontSize: '14px', color: '#202124', lineHeight: '1.3' }}>
                    https://ellangala.com › insights › {effectiveSlug}
                  </div>
                  <div style={{ fontSize: '18px', color: '#1A0DAB', fontWeight: '500', margin: '4px 0', textDecoration: 'underline', cursor: 'pointer' }}>
                    {effectiveTitle}
                  </div>
                  <div style={{ fontSize: '14px', color: '#4D5156', lineHeight: '1.4' }}>
                    {effectiveDesc}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="admin-form-label">Custom SEO Title (Optional)</label>
                    <span style={{ fontSize: '11px', color: titleOverLimit ? '#EF4444' : '#64748B' }}>
                      {effectiveTitle.length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.seo.title}
                    onChange={(e) => handleSeoChange('title', e.target.value)}
                    placeholder="Leave empty to use automatic title format"
                    className="admin-input"
                  />
                  {titleOverLimit && (
                    <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={12} /> SEO title may be too long for search result displays.
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="admin-form-label">Custom Meta Description (Optional)</label>
                    <span style={{ fontSize: '11px', color: descOverLimit ? '#EF4444' : '#64748B' }}>
                      {effectiveDesc.length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.seo.description}
                    onChange={(e) => handleSeoChange('description', e.target.value)}
                    placeholder="Leave empty to use article excerpt as meta description..."
                    className="admin-textarea"
                  />
                  {descOverLimit && (
                    <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={12} /> SEO description may be truncated by search engines.
                    </div>
                  )}
                </div>

                <div>
                  <label className="admin-form-label">Custom Social / OG Image URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.seo.image}
                    onChange={(e) => handleSeoChange('image', e.target.value)}
                    placeholder="Leave empty to use default cover image"
                    className="admin-input"
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    backgroundColor: '#FFFBEB',
                    borderRadius: '8px',
                    border: '1px solid #FCD34D'
                  }}
                >
                  <input
                    type="checkbox"
                    id="noindex-check"
                    checked={formData.seo.noindex}
                    onChange={(e) => handleSeoChange('noindex', e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="noindex-check" style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', cursor: 'pointer', margin: 0 }}>
                    Hide from search engines & sitemap (noindex, nofollow)
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status & Publishing */}
          <div className="admin-card">
            <div className="admin-card__title" style={{ marginBottom: '16px' }}>Publishing Status</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-form-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="admin-select"
                >
                  <option value="published">Published (Live & Indexed)</option>
                  <option value="draft">Draft (Private / Unindexed)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="admin-form-label">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="admin-select"
                >
                  <option value="Positive Psychology">Positive Psychology</option>
                  <option value="Indian Culture & Wisdom">Indian Culture & Wisdom</option>
                  <option value="Positive Parenting">Positive Parenting</option>
                  <option value="Workplace Wellness">Workplace Wellness</option>
                  <option value="Mind Gym Exercises">Mind Gym Exercises</option>
                </select>
              </div>

              <div>
                <label className="admin-form-label">Author Name</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-form-label">Estimated Read Time</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => handleChange('readTime', e.target.value)}
                  placeholder="e.g. 8 Mins Read"
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Preview */}
          <div className="admin-card">
            <div className="admin-card__title" style={{ marginBottom: '16px' }}>Cover Image</div>

            <div>
              <label className="admin-form-label">Image URL / Asset Path</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="admin-input"
                  style={{ flex: 1 }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                  id="blog-cover-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="admin-btn admin-btn--secondary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Upload size={14} /> {isUploadingImage ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {uploadError && (
                <div style={{ fontSize: '11px', color: '#EF4444', marginBottom: '8px' }}>{uploadError}</div>
              )}

              <div
                style={{
                  width: '100%',
                  height: '160px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Cover preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/assets/images/blog/blog-mind-gym.png'; }}
                  />
                ) : (
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>No Cover Image</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
