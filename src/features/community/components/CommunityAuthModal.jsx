import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  Camera,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  UploadCloud,
  AlertCircle
} from 'lucide-react';
import { useCommunityAuth } from '../context/CommunityAuthContext';
import { communityService } from '../services/communityService';

const AVAILABLE_TOPICS = [
  { id: 'psychology', label: 'Positive Psychology' },
  { id: 'mindfulness', label: 'Mindfulness & Meditation' },
  { id: 'bhagavad-gita', label: 'Bhagavad Gita Wisdom' },
  { id: 'workshops', label: 'Workshops & Retreats' },
  { id: 'personal-growth', label: 'Personal Growth' },
  { id: 'leadership', label: 'Mindful Leadership' },
  { id: 'mental-wellbeing', label: 'Emotional Wellbeing' },
  { id: 'life-purpose', label: 'Purpose & Meaning' }
];

function compressImageToDataUrl(file, maxWidth = 300, maxHeight = 300, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export default function CommunityAuthModal() {
  const {
    isAuthModalOpen,
    authModalInitialTab,
    authModalNotice,
    closeAuthModal,
    login,
    signup
  } = useCommunityAuth();

  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [signupStep, setSignupStep] = useState(1); // 1: Info, 2: Photo, 3: Topics

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login identifier state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState(null);
  const [fallbackDataUrl, setFallbackDataUrl] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Topics state
  const [selectedTopics, setSelectedTopics] = useState([
    'Positive Psychology',
    'Bhagavad Gita Wisdom',
    'Mindfulness & Meditation'
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync initial tab when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setTab(authModalInitialTab || 'login');
      setSignupStep(1);
      setError('');
    }
  }, [isAuthModalOpen, authModalInitialTab]);

  if (!isAuthModalOpen) return null;

  const handleToggleTopic = (topicLabel) => {
    if (selectedTopics.includes(topicLabel)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter(t => t !== topicLabel));
      }
    } else {
      setSelectedTopics([...selectedTopics, topicLabel]);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be under 10MB.');
      return;
    }

    setError('');
    setAvatarFile(file);
    setAvatarUploading(true);
    setAvatarUploadSuccess(false);

    try {
      // 1. Immediately compress & show local preview
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrl) {
        setAvatarPreview(dataUrl);
        setFallbackDataUrl(dataUrl);
      }

      // 2. Upload to server
      const serverUrl = await communityService.uploadAvatar(file);
      if (serverUrl) {
        setUploadedAvatarUrl(serverUrl);
        setAvatarUploadSuccess(true);
      }
    } catch (uploadErr) {
      console.warn('Avatar upload endpoint issue, using high-quality local image:', uploadErr);
      setAvatarUploadSuccess(true);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setError('Please enter your mobile number or name.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login({
        identifier: loginIdentifier.trim(),
        password: loginPassword
      });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setError('Please enter a valid mobile number (at least 8 digits).');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setError('');
    setSignupStep(2); // Go to avatar upload step
  };

  const handleCompleteSignup = async (skipPhoto = false) => {
    setError('');
    setLoading(true);

    try {
      let finalAvatarUrl = null;

      if (!skipPhoto) {
        finalAvatarUrl = uploadedAvatarUrl || fallbackDataUrl || null;

        if (!finalAvatarUrl && avatarFile) {
          setAvatarUploading(true);
          try {
            finalAvatarUrl = await communityService.uploadAvatar(avatarFile);
          } catch (_) {
            finalAvatarUrl = fallbackDataUrl || null;
          } finally {
            setAvatarUploading(false);
          }
        }
      }

      await signup({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        password,
        avatarUrl: skipPhoto ? null : finalAvatarUrl,
        topics: selectedTopics
      });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="community-auth-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="community-auth-modal">
        {/* Modal Close Button */}
        <button
          type="button"
          className="community-auth-close-btn"
          onClick={closeAuthModal}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="community-auth-header">
          <div className="community-auth-icon-badge">
            <Sparkles size={22} color="#CA8A38" />
          </div>
          <h3 className="community-auth-title">
            {tab === 'login' ? 'Welcome Back to Community' : 'Join Ellangala Community'}
          </h3>
          <p className="community-auth-subtitle">
            {tab === 'login'
              ? 'Sign in to access your registered workshops, discussions, and learning journey.'
              : 'A mindful space for wisdom, personal growth, and reflective living.'}
          </p>

          {/* Optional context notice */}
          {authModalNotice && (
            <div className="community-auth-context-notice">
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{authModalNotice}</span>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="community-auth-tabs">
          <button
            type="button"
            className={`community-auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login');
              setError('');
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`community-auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setTab('signup');
              setSignupStep(1);
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="community-auth-error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: SIGN IN */}
        {/* ============================================================== */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="community-auth-form">
            <div className="community-auth-input-group">
              <label>Mobile Number or Name <span className="req">*</span></label>
              <div className="community-auth-input-wrap">
                <Phone size={17} className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter your registered mobile or name"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="community-auth-input-group">
              <label>Password <span className="req">*</span></label>
              <div className="community-auth-input-wrap">
                <Lock size={17} className="input-icon" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-eye-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 30-day session notice */}
            <div className="community-auth-session-guarantee">
              <ShieldCheck size={16} color="#CA8A38" style={{ flexShrink: 0 }} />
              <span>
                <strong>Persistent 30-Day Session:</strong> You will remain logged in on this browser across restarts for 30 days.
              </span>
            </div>

            <button
              type="submit"
              className="community-auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner-wrap">
                  <span className="btn-spinner" />
                  <span>Logging In...</span>
                </span>
              ) : (
                <>
                  <span>Login to Community</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <div className="community-auth-footer-prompt">
              <span>Don't have an account yet? </span>
              <button
                type="button"
                className="link-switch"
                onClick={() => {
                  setTab('signup');
                  setSignupStep(1);
                  setError('');
                }}
              >
                Create Account here
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SIGN UP */}
        {/* ============================================================== */}
        {tab === 'signup' && (
          <div className="community-auth-signup-flow">
            {/* Step Progress Bar */}
            <div className="community-auth-step-dots">
              <div className={`step-dot ${signupStep >= 1 ? 'active' : ''}`}>
                <span>1</span>
                <label>Account</label>
              </div>
              <div className={`step-line ${signupStep >= 2 ? 'active' : ''}`} />
              <div className={`step-dot ${signupStep >= 2 ? 'active' : ''}`}>
                <span>2</span>
                <label>Photo</label>
              </div>
              <div className={`step-line ${signupStep >= 3 ? 'active' : ''}`} />
              <div className={`step-dot ${signupStep >= 3 ? 'active' : ''}`}>
                <span>3</span>
                <label>Interests</label>
              </div>
            </div>

            {/* STEP 1: Basic Information */}
            {signupStep === 1 && (
              <form onSubmit={handleStep1Submit} className="community-auth-form">
                <div className="community-auth-input-group">
                  <label>Full Name <span className="req">*</span></label>
                  <div className="community-auth-input-wrap">
                    <User size={17} className="input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. Arjun Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="community-auth-input-group">
                  <label>Mobile Number <span className="req">* (Used for Login)</span></label>
                  <div className="community-auth-input-wrap">
                    <Phone size={17} className="input-icon" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="community-auth-input-group">
                  <label>Email Address <span className="optional">(Optional)</span></label>
                  <div className="community-auth-input-wrap">
                    <Mail size={17} className="input-icon" />
                    <input
                      type="email"
                      placeholder="e.g. arjun@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="community-auth-input-group">
                  <label>Password <span className="req">*</span></label>
                  <div className="community-auth-input-wrap">
                    <Lock size={17} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create your account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={4}
                    />
                    <button
                      type="button"
                      className="input-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="community-auth-submit-btn">
                  <span>Continue to Profile Photo</span>
                  <ArrowRight size={17} />
                </button>
              </form>
            )}

            {/* STEP 2: Profile Photo (Optional / Skip) */}
            {signupStep === 2 && (
              <div className="community-auth-step2">
                <div className="community-avatar-upload-box">
                  <div className="community-avatar-preview-circle">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" />
                    ) : (
                      <div className="community-empty-silhouette">
                        <User size={54} color="#94A3B8" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="community-avatar-camera-btn"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload photo"
                    >
                      <Camera size={18} />
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />

                  <h4 className="community-upload-prompt-title">Add your profile picture</h4>
                  <p className="community-upload-prompt-sub">
                    Personalize how other seekers see you in discussions and workshop circles.
                  </p>

                  <div className="community-avatar-buttons">
                    <button
                      type="button"
                      className="btn-select-photo"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                    >
                      <UploadCloud size={16} />
                      <span>{avatarPreview ? 'Change Photo' : 'Upload from Device'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn-skip-photo"
                      onClick={() => {
                        setError('');
                        setSignupStep(3);
                      }}
                      disabled={avatarUploading}
                    >
                      {avatarPreview ? 'Use this photo & Continue' : 'Skip for now'}
                    </button>
                  </div>

                  {/* Status Indicator */}
                  {avatarUploading && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px', fontSize: '13px', color: '#CA8A38' }}>
                      <span className="btn-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                      <span>Optimizing & uploading photo...</span>
                    </div>
                  )}
                  {!avatarUploading && avatarUploadSuccess && avatarPreview && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
                      <Check size={16} />
                      <span>Profile photo ready!</span>
                    </div>
                  )}
                </div>

                <div className="community-step-actions-nav">
                  <button
                    type="button"
                    className="btn-back-step"
                    onClick={() => {
                      setError('');
                      setSignupStep(1);
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      className="btn-next-step"
                      onClick={() => {
                        setError('');
                        setSignupStep(3);
                      }}
                    >
                      <span>Next: Topics</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Topics & Interests */}
            {signupStep === 3 && (
              <div className="community-auth-step3">
                <div className="community-topics-prompt">
                  <h4 className="community-topics-title">What are you most interested in?</h4>
                  <p className="community-topics-desc">
                    Choose the topics you'd like to explore in the community. You can change these anytime.
                  </p>
                </div>

                <div className="community-auth-topics-grid">
                  {AVAILABLE_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.label);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        className={`community-auth-topic-pill ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleToggleTopic(topic.label)}
                      >
                        {isSelected && <Check size={14} className="pill-check-icon" />}
                        <span>{topic.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 30-day session guarantee */}
                <div className="community-auth-session-guarantee" style={{ marginTop: '16px' }}>
                  <ShieldCheck size={16} color="#CA8A38" style={{ flexShrink: 0 }} />
                  <span>
                    Your session will stay active for <strong>30 days</strong> on this device so you won't need to log in every time.
                  </span>
                </div>

                <div className="community-step-actions-nav" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn-back-step"
                    onClick={() => {
                      setError('');
                      setSignupStep(2);
                    }}
                    disabled={loading}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    className="community-auth-submit-btn"
                    onClick={() => handleCompleteSignup(false)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    {loading ? (
                      <span className="btn-spinner-wrap">
                        <span className="btn-spinner" />
                        <span>Creating Your Community Profile...</span>
                      </span>
                    ) : (
                      <>
                        <span>Complete Sign Up</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="community-auth-footer-prompt" style={{ marginTop: '16px' }}>
              <span>Already have an account? </span>
              <button
                type="button"
                className="link-switch"
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
