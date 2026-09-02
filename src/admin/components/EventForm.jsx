import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENT_CATEGORIES } from '../../features/events/data/eventSeedData';
import { Save, Plus, X, ArrowLeft, Image as ImageIcon, Upload, CheckCircle2 } from 'lucide-react';
import { uploadService } from '../services/uploadService';

export default function EventForm({ initialData, onSubmit, isEditing = false }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || initialData?.series || '');
  const [language, setLanguage] = useState(initialData?.language || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [perspective, setPerspective] = useState(initialData?.perspective || '');
  const [aboutProgram, setAboutProgram] = useState(initialData?.aboutProgram || '');
  const [heroTagline, setHeroTagline] = useState(initialData?.heroTagline || '');
  const [category, setCategory] = useState(initialData?.category || EVENT_CATEGORIES[0]);
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState(initialData?.image || '/assets/images/blog/blog-positive-psychology.png');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setIsUploadingImage(true);
    try {
      const { url } = await uploadService.uploadImage(file);
      setImage(url);
    } catch (err) {
      setUploadError(err.message || 'Image upload failed.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '10:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '13:00');

  const [mode, setMode] = useState(initialData?.mode || 'Offline');
  const [venue, setVenue] = useState(initialData?.venue || 'Ellangala’s Academy');
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || 'Bengaluru');
  const [googleMeetLink, setGoogleMeetLink] = useState(initialData?.googleMeetLink || initialData?.meetingLink || '');

  const [organizer, setOrganizer] = useState(initialData?.organizer || 'Ellangala’s Academy');
  const [speaker, setSpeaker] = useState(initialData?.speaker || 'Dr. Naveen Ellangala');

  const [whoInput, setWhoInput] = useState('');
  const [whoIsItFor, setWhoIsItFor] = useState(initialData?.whoIsItFor || ['Parents', 'Educators']);

  const [highlightInput, setHighlightInput] = useState('');
  const [highlights, setHighlights] = useState(
    initialData?.highlights || ['Practical strategies for positive growth', 'Interactive Q&A session']
  );

  const [registrationOpen, setRegistrationOpen] = useState(
    initialData?.registrationOpen !== undefined ? initialData.registrationOpen : true
  );
  const [capacity, setCapacity] = useState(initialData?.capacity || '');
  const [priceType, setPriceType] = useState(initialData?.priceType || 'Free');
  const [price, setPrice] = useState(initialData?.price || '');
  const [razorpayLink, setRazorpayLink] = useState(initialData?.razorpayLink || initialData?.paymentLink || '');

  const [status, setStatus] = useState(initialData?.status || 'published');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [toastMessage, setToastMessage] = useState('');

  // SEO Fields State
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || '');
  const [seoImage, setSeoImage] = useState(initialData?.seo?.image || '');
  const [noindex, setNoindex] = useState(Boolean(initialData?.seo?.noindex));
  const [showSeoSection, setShowSeoSection] = useState(true);

  const handleAddWho = () => {
    if (whoInput.trim() && !whoIsItFor.includes(whoInput.trim())) {
      setWhoIsItFor([...whoIsItFor, whoInput.trim()]);
      setWhoInput('');
    }
  };

  const handleRemoveWho = (item) => {
    setWhoIsItFor(whoIsItFor.filter((w) => w !== item));
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (item) => {
    setHighlights(highlights.filter((h) => h !== item));
  };

  const handleSave = (targetStatus) => {
    const finalStatus = targetStatus || status;

    const payload = {
      ...(initialData || {}),
      title,
      subtitle: subtitle || null,
      series: subtitle || initialData?.series || null,
      language: language || null,
      duration: duration || null,
      perspective: perspective || null,
      aboutProgram: aboutProgram || null,
      heroTagline: heroTagline || null,
      category,
      shortDescription,
      description,
      image,
      date,
      endDate: endDate || null,
      startTime,
      endTime,
      mode,
      venue: mode === 'Online' ? 'Online' : venue,
      address: mode === 'Online' ? '' : address,
      city: mode === 'Online' ? 'Online' : city,
      googleMeetLink: (mode === 'Online' || mode === 'Hybrid') ? googleMeetLink : '',
      meetingLink: (mode === 'Online' || mode === 'Hybrid') ? googleMeetLink : '',
      organizer,
      speaker,
      whoIsItFor,
      highlights,
      registrationOpen,
      capacity: capacity ? Number(capacity) : null,
      priceType,
      price: priceType === 'Paid' ? Number(price) : null,
      razorpayLink,
      paymentLink: razorpayLink,
      status: finalStatus,
      featured,
      seo: {
        title: seoTitle,
        description: seoDescription,
        image: seoImage,
        noindex
      }
    };

    onSubmit(payload);

    setToastMessage('Event saved successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '32px',
            backgroundColor: '#047857',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '700',
            fontSize: '14px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/events')}
          className="btn-secondary-outline"
        >
          <ArrowLeft size={16} />
          <span>Back to Events</span>
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-secondary-outline"
            onClick={() => handleSave('draft')}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="btn-primary-gold"
            onClick={() => handleSave('published')}
          >
            <Save size={16} />
            <span>{isEditing ? 'Save Changes' : 'Publish Event'}</span>
          </button>
        </div>
      </div>

      {/* 1. Basic Information Card */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Basic Information</h3>
        </div>
        <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="row g-3">
            <div className="col-md-8">
              <div className="admin-form-group">
                <label className="admin-label">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhagavadgita for Meaningful Life"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="admin-select"
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="admin-form-group">
                <label className="admin-label">Subtitle / Series</label>
                <input
                  type="text"
                  placeholder="e.g. 5th Transformational Learning Series"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="admin-form-group">
                <label className="admin-label">Language</label>
                <input
                  type="text"
                  placeholder="e.g. Kannada / English"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="admin-form-group">
                <label className="admin-label">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 12 Days / 3 Hours"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Short Description *</label>
            <input
              type="text"
              required
              placeholder="Brief 1-2 sentence overview of the event..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Full Description</label>
            <textarea
              rows={5}
              placeholder="Detailed description of topics, schedule and takeaway learnings..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="admin-textarea"
            />
          </div>
        </div>
      </div>

      {/* 2. Date & Location Card */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Date &amp; Location</h3>
        </div>
        <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Event Start Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Event End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={date}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="admin-input"
                />
                <small style={{ color: '#667085', fontSize: '12px' }}>Leave blank for a single-day event. Used on certificates.</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Start Time *</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">End Time *</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Event Mode *</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="admin-select"
                >
                  <option value="Offline">Offline (In-Person)</option>
                  <option value="Online">Online (Virtual Live)</option>
                  <option value="Hybrid">Hybrid (In-Person + Online)</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">City *</label>
                <input
                  type="text"
                  placeholder="Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
            {mode !== 'Online' && (
              <div className="col-md-4">
                <div className="admin-form-group">
                  <label className="admin-label">Venue Name</label>
                  <input
                    type="text"
                    placeholder="Ellangala’s Academy Auditorium"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>
            )}
          </div>

          {(mode === 'Online' || mode === 'Hybrid') && (
            <div className="admin-form-group">
              <label className="admin-label">Google Meet / Live Session Link (Optional)</label>
              <input
                type="url"
                placeholder="e.g. https://meet.google.com/abc-defg-hij"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                className="admin-input"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Event Cover Image */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Event Cover Image</h3>
        </div>
        <div className="admin-card__body">
          <div className="row g-3 items-center">
            <div className="col-md-7">
              <div className="admin-form-group">
                <label className="admin-label">Image Path / URL *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    required
                    placeholder="/assets/images/blog/blog-positive-psychology.png"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="btn-secondary-outline"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <Upload size={14} /> {isUploadingImage ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                {uploadError && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '6px' }}>{uploadError}</div>}
                <span style={{ fontSize: '12px', color: '#667085', marginTop: '4px', display: 'block' }}>
                  Recommended resolution: 1200 × 675 pixels (16:9 ratio).
                </span>
              </div>
            </div>
            <div className="col-md-5">
              <div style={{ width: '100%', height: '120px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#0A2347', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={image}
                  alt="Preview"
                  onError={(e) => { e.currentTarget.src = '/assets/images/blog/blog-positive-psychology.png'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Audience & Highlights Card */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Audience &amp; Highlights</h3>
        </div>
        <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="admin-label" style={{ marginBottom: '8px' }}>Who Is This Event For?</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="e.g. Working Professionals"
                value={whoInput}
                onChange={(e) => setWhoInput(e.target.value)}
                className="admin-input"
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAddWho} className="btn-secondary-outline">Add Tag</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {whoIsItFor.map((item) => (
                <span key={item} style={{ backgroundColor: '#FAF8F3', color: '#0A2347', border: '1px solid #E5E7EB', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {item}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleRemoveWho(item)} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="admin-label" style={{ marginBottom: '8px' }}>Event Highlights</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="e.g. Guided Mind Gym Session"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                className="admin-input"
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAddHighlight} className="btn-secondary-outline">Add Highlight</button>
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', color: '#334155' }}>
              {highlights.map((h) => (
                <li key={h} style={{ marginBottom: '6px' }}>
                  <span>{h}</span>
                  <X size={14} style={{ cursor: 'pointer', marginLeft: '8px', color: '#EF4444' }} onClick={() => handleRemoveHighlight(h)} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Registration & Pricing Card */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Registration &amp; Pricing</h3>
        </div>
        <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Pricing Type *</label>
                <select
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                  className="admin-select"
                >
                  <option value="Free">Free Event</option>
                  <option value="Paid">Paid Event</option>
                  <option value="Enquiry Only">Enquiry Only</option>
                </select>
              </div>
            </div>
            {priceType === 'Paid' && (
              <div className="col-md-4">
                <div className="admin-form-group">
                  <label className="admin-label">Ticket Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>
            )}
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Seating Capacity (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Razorpay Payment Link / Custom Checkout URL (Optional)</label>
            <input
              type="url"
              placeholder="e.g. https://rzp.io/l/your-event-link"
              value={razorpayLink}
              onChange={(e) => setRazorpayLink(e.target.value)}
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* 6. Dynamic SEO & Metadata Card */}
      <div className="admin-card">
        <div
          className="admin-card__header"
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => setShowSeoSection(!showSeoSection)}
        >
          <div>
            <h3 className="admin-card__title">Search Engine Optimization (SEO)</h3>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              Custom SEO titles, meta descriptions, OpenGraph image & sitemap settings
            </div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#CA8A38' }}>
            {showSeoSection ? 'Hide SEO Settings' : 'Edit SEO Settings'}
          </span>
        </div>

        {showSeoSection && (
          <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Live Search Preview */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'arial, sans-serif'
              }}
            >
              <div style={{ fontSize: '12px', color: '#4D5156', marginBottom: '4px' }}>
                Google Search Preview
              </div>
              <div style={{ fontSize: '14px', color: '#202124' }}>
                https://ellangala.com › events › {title ? title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-') : 'event-slug'}
              </div>
              <div style={{ fontSize: '18px', color: '#1A0DAB', fontWeight: '500', margin: '4px 0', textDecoration: 'underline' }}>
                {seoTitle.trim() || (title ? `${title} | Ellangala’s Academy` : 'Event Title | Ellangala’s Academy')}
              </div>
              <div style={{ fontSize: '14px', color: '#4D5156' }}>
                {seoDescription.trim() || shortDescription || 'Explore positive psychology and mind training event details.'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="admin-label">Custom SEO Title (Optional)</label>
                <span style={{ fontSize: '11px', color: (seoTitle.trim() || title).length > 60 ? '#EF4444' : '#64748B' }}>
                  {(seoTitle.trim() || title).length} / 60 chars
                </span>
              </div>
              <input
                type="text"
                placeholder="Leave empty to use automatic event title format"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="admin-input"
              />
              {(seoTitle.trim() || title).length > 60 && (
                <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
                  ⚠️ SEO title may be truncated in search engine results.
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="admin-label">Custom Meta Description (Optional)</label>
                <span style={{ fontSize: '11px', color: (seoDescription.trim() || shortDescription).length > 160 ? '#EF4444' : '#64748B' }}>
                  {(seoDescription.trim() || shortDescription).length} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Leave empty to use short description..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="admin-textarea"
              />
              {(seoDescription.trim() || shortDescription).length > 160 && (
                <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
                  ⚠️ Meta description may be truncated by search engines.
                </div>
              )}
            </div>

            <div>
              <label className="admin-label">Custom Social / OpenGraph Image URL (Optional)</label>
              <input
                type="text"
                placeholder="Leave empty to use event cover image"
                value={seoImage}
                onChange={(e) => setSeoImage(e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#FFFBEB', borderRadius: '8px', border: '1px solid #FCD34D' }}>
              <input
                type="checkbox"
                id="event-noindex"
                checked={noindex}
                onChange={(e) => setNoindex(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="event-noindex" style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', cursor: 'pointer', margin: 0 }}>
                Exclude from search engines & dynamic sitemap (noindex, nofollow)
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 'var(--admin-sidebar-width)',
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 90,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
        }}
      >
        <button
          type="button"
          className="btn-secondary-outline"
          onClick={() => navigate('/admin/events')}
        >
          Cancel
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-secondary-outline"
            onClick={() => handleSave('draft')}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="btn-primary-gold"
            onClick={() => handleSave('published')}
          >
            <Save size={16} />
            <span>{isEditing ? 'Save Changes' : 'Publish Event'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
