import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Check, AlertCircle, Upload, User, Shield, Sparkles, Trash2, Mail } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminProfileModal({ isOpen, onClose }) {
  const { currentUser, updateProfile, uploadAvatar, deleteAvatar } = useAdminAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(currentUser?.name || 'Academy Administrator');
  const [role, setRole] = useState(currentUser?.role || 'Administrator');
  const [email, setEmail] = useState(currentUser?.email || 'admin@ellangala.com');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(currentUser?.name || 'Academy Administrator');
      setRole(currentUser?.role || 'Administrator');
      setEmail(currentUser?.email || 'admin@ellangala.com');
      setAvatarPreview(currentUser?.avatar || '');
      setSelectedFile(null);
      setIsAvatarRemoved(false);
      setError('');
      setSuccess('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    // Check 2MB maximum limit
    const MAX_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setError(`Selected image exceeds 2MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a file up to 2MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP, or GIF).');
      return;
    }

    setSelectedFile(file);
    setIsAvatarRemoved(false);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setAvatarPreview('');
    setIsAvatarRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          const TARGET = 360;
          canvas.width = TARGET;
          canvas.height = TARGET;
          const ctx = canvas.getContext('2d');
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, TARGET, TARGET);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        };
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (isAvatarRemoved) {
        try {
          if (deleteAvatar) await deleteAvatar();
        } catch (_) {
          await updateProfile({ avatar: '' });
        }
      } else if (selectedFile) {
        try {
          await uploadAvatar(selectedFile);
        } catch (uploadErr) {
          // If server upload had an issue (e.g. network), save compressed avatar locally
          const fallbackDataUrl = await compressImage(selectedFile);
          if (fallbackDataUrl) {
            await updateProfile({
              name: name.trim(),
              role: role.trim(),
              email: email.trim().toLowerCase(),
              avatar: fallbackDataUrl
            });
            setSuccess('Profile photo updated successfully!');
            setTimeout(() => onClose(), 1200);
            return;
          }
          throw uploadErr;
        }
      }

      await updateProfile({
        name: name.trim(),
        role: role.trim(),
        email: email.trim().toLowerCase()
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = (name || 'Admin')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AA';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 35, 71, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 24px 48px -12px rgba(8, 35, 73, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E5E7EB'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #FAF8F3 0%, #FFFFFF 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#FFF7E8',
                color: '#CA8A38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0A2347' }}>
                Admin Profile &amp; Avatar
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                Update your administrative photo and credentials
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          {error && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                color: '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                marginBottom: '18px'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '8px',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                marginBottom: '18px'
              }}
            >
              <Check size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Profile Avatar Centerpiece */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <div
              style={{
                position: 'relative',
                width: '104px',
                height: '104px',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
              title="Click to choose a new photo"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Admin avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #CA8A38',
                    boxShadow: '0 8px 16px rgba(8, 35, 73, 0.12)'
                  }}
                  onError={() => setAvatarPreview('')}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#082349',
                    color: '#CA8A38',
                    fontSize: '32px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #CA8A38',
                    boxShadow: '0 8px 16px rgba(8, 35, 73, 0.12)'
                  }}
                >
                  {initials}
                </div>
              )}

              {/* Camera Icon Overlay Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#CA8A38',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                <Camera size={16} />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: '#FFF7E8',
                    border: '1px solid #F3E5CA',
                    color: '#CA8A38',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Upload size={14} />
                  <span>{avatarPreview ? 'Change Photo' : 'Upload Profile Photo'}</span>
                </button>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      color: '#DC2626',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    title="Remove profile picture"
                  >
                    <Trash2 size={14} />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                JPEG, PNG, WebP or GIF (Max 2MB)
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} />
                <span>Admin Display Name</span>
              </label>
              <input
                type="text"
                required
                className="admin-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Naveen Ellangala"
              />
            </div>

            <div>
              <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} />
                <span>Administrative Role / Title</span>
              </label>
              <input
                type="text"
                className="admin-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Founder & Positive Psychologist"
              />
            </div>

            <div>
              <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} />
                <span>Account Email</span>
              </label>
              <input
                type="email"
                required
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ellangala.com"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-gold"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
