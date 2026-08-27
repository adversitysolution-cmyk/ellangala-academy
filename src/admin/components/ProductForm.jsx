import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { uploadService } from '../services/uploadService';

export default function ProductForm({ initialData, onSubmit, isEditing = false }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'BOOKS');
  const [author, setAuthor] = useState(initialData?.author || 'Dr. Naveen Ellangala');
  const [type, setType] = useState(initialData?.type || 'Workbook');
  const [theme, setTheme] = useState(initialData?.theme || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [discount, setDiscount] = useState(initialData?.discount || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [alt, setAlt] = useState(initialData?.alt || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [sale, setSale] = useState(Boolean(initialData?.sale));
  const [status, setStatus] = useState(initialData?.status || 'published');

  const [highlightInput, setHighlightInput] = useState('');
  const [highlights, setHighlights] = useState(initialData?.highlights || []);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (item) => {
    setHighlights(highlights.filter((h) => h !== item));
  };

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

  const handleSave = (targetStatus) => {
    const payload = {
      title,
      category,
      author,
      type,
      theme,
      price,
      discount,
      image,
      alt: alt || title,
      description,
      highlights,
      sale,
      status: targetStatus || status
    };

    onSubmit(payload);
    setToastMessage('Product saved successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      {toastMessage && (
        <div
          style={{
            position: 'fixed', top: '84px', right: '32px', backgroundColor: '#047857', color: '#FFFFFF',
            padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 99999,
            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary-outline">
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn-secondary-outline" onClick={() => handleSave('draft')}>
            Save as Draft
          </button>
          <button type="button" className="btn-primary-gold" onClick={() => handleSave('published')}>
            <Save size={16} />
            <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Product Details</h3>
        </div>
        <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="row g-3">
            <div className="col-md-8">
              <div className="admin-form-group">
                <label className="admin-label">Product Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" placeholder="e.g. Be Positive" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-select">
                  <option value="BOOKS">Books</option>
                  <option value="WORKBOOKS">Workbooks</option>
                  <option value="RESOURCES">Resources</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Author</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="admin-input" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Type</label>
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="admin-input" placeholder="e.g. Workbook" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="admin-form-group">
                <label className="admin-label">Theme</label>
                <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} className="admin-input" placeholder="e.g. Positive Mindset · Growth" />
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="admin-textarea" placeholder="What this book covers, who it's for..." />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Pricing</h3>
        </div>
        <div className="admin-card__body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="admin-form-group">
                <label className="admin-label">Price *</label>
                <input type="text" required value={price} onChange={(e) => setPrice(e.target.value)} className="admin-input" placeholder="e.g. ₹150–₹200" />
                <span style={{ fontSize: '12px', color: '#667085', marginTop: '4px', display: 'block' }}>
                  The first number is used as the actual cart price.
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="admin-form-group">
                <label className="admin-label">Discount Label (Optional)</label>
                <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} className="admin-input" placeholder="e.g. 40% OFF" />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
            <input type="checkbox" id="product-sale" checked={sale} onChange={(e) => setSale(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            <label htmlFor="product-sale" style={{ fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer', margin: 0 }}>
              Show "On Sale" badge
            </label>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Cover Image</h3>
        </div>
        <div className="admin-card__body">
          <div className="row g-3 items-center">
            <div className="col-md-7">
              <div className="admin-form-group">
                <label className="admin-label">Image URL / Asset Path</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="admin-input" style={{ flex: 1 }} placeholder="/assets/images/books/..." />
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageFileChange} style={{ display: 'none' }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploadingImage} className="btn-secondary-outline" style={{ whiteSpace: 'nowrap' }}>
                    <Upload size={14} /> {isUploadingImage ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                {uploadError && <div style={{ fontSize: '11px', color: '#EF4444', marginBottom: '8px' }}>{uploadError}</div>}
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label className="admin-label">Image Alt Text</label>
                  <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} className="admin-input" placeholder="Defaults to product title" />
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div style={{ width: '100%', height: '160px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#0A2347', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {image ? (
                  <img src={image} alt="Preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>No Cover Image</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Highlights</h3>
        </div>
        <div className="admin-card__body">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="e.g. Build healthier thinking habits"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              className="admin-input"
              style={{ flex: 1 }}
            />
            <button type="button" onClick={handleAddHighlight} className="btn-secondary-outline">Add</button>
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

      <div
        style={{
          position: 'fixed', bottom: 0, left: 'var(--admin-sidebar-width)', right: 0, backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E7EB', padding: '16px 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', zIndex: 90, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
        }}
      >
        <button type="button" className="btn-secondary-outline" onClick={() => navigate('/admin/products')}>Cancel</button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn-secondary-outline" onClick={() => handleSave('draft')}>Save Draft</button>
          <button type="button" className="btn-primary-gold" onClick={() => handleSave('published')}>
            <Save size={16} />
            <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
