import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Smartphone,
  ExternalLink,
  MessageCircle,
  Send,
  Info
} from 'lucide-react';

export default function CommunityShareModal({ post, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInstagram, setCopiedInstagram] = useState(false);
  const [showInstagramHelp, setShowInstagramHelp] = useState(false);

  if (!post) return null;

  // Canonical share URL for this specific post
  const shareUrl = `${window.location.origin}/feed/posts/${post.id}`;
  const shareTitle = post.title;
  const shareExcerpt = post.content ? post.content.slice(0, 140) + '...' : '';

  // 1. Native Mobile / Web Share API (supports ShareChat, Koo, WhatsApp, Telegram, etc. on device)
  const canNativeShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `${shareTitle} | Ellangala Community`,
        text: `Thoughtful reflection by ${post.authorName || 'Dr. Naveen Ellangala'}:\n${shareTitle}\n\n`,
        url: shareUrl
      });
    } catch (err) {
      // User cancelled or aborted share
      if (err.name !== 'AbortError') {
        handleCopyLink();
      }
    }
  };

  // 2. Safe Clipboard Copy with fallback
  const copyToClipboard = (text, onSuccess) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
    } else {
      fallbackCopy(text, onSuccess);
    }
  };

  const fallbackCopy = (text, onSuccess) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (_) {}
    document.body.removeChild(textArea);
  };

  const handleCopyLink = () => {
    copyToClipboard(shareUrl, () => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleCopyInstagramCaption = () => {
    const igText = `"${shareTitle}" by Dr. Naveen Ellangala (@ellangalasacademy)\n\n${shareExcerpt}\n\nRead the complete discussion on our community feed: ${shareUrl}`;
    copyToClipboard(igText, () => {
      setCopiedInstagram(true);
      setTimeout(() => setCopiedInstagram(false), 3000);
    });
  };

  // Formatted URLs for each platform
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `*${shareTitle}*\n\nRead this positive psychology reflection by Dr. Naveen Ellangala on Ellangala's Academy Community:\n${shareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
    `*${shareTitle}* — ${shareExcerpt}`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${shareTitle}" by Dr. Naveen Ellangala\n\nRead the discussion on Ellangala Community:`
  )}&url=${encodeURIComponent(shareUrl)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} color="#CA8A38" />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
              Share Discussion
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Post Summary Preview */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '18px'
        }}>
          <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', margin: '0 0 4px 0' }}>
            {shareTitle}
          </h5>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shareExcerpt}
          </p>
        </div>

        {/* Native Mobile Share Button (if supported) */}
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            style={{
              width: '100%',
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px',
              transition: 'background 0.2s'
            }}
          >
            <Smartphone size={17} />
            <span>Share via Device Apps (WhatsApp, ShareChat, etc.)</span>
          </button>
        )}

        {/* Platform Share Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#25D366',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#229ED9',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <Send size={15} />
            <span>Telegram</span>
          </a>

          {/* X (Twitter) */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#000000',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <span>𝕏 (Twitter)</span>
          </a>

          {/* Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#1877F2',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <span>Facebook</span>
          </a>

          {/* LinkedIn */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#0A66C2',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <span>LinkedIn</span>
          </a>

          {/* Instagram Info / Copy Tab */}
          <button
            type="button"
            onClick={() => setShowInstagramHelp(!showInstagramHelp)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <span>Instagram (Copy)</span>
          </button>
        </div>

        {/* Instagram Transparency Panel */}
        {showInstagramHelp && (
          <div style={{
            background: '#FDF2F8',
            border: '1px solid #FBCFE8',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#831843',
            lineHeight: '1.45'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', marginBottom: '4px' }}>
              <Info size={14} />
              <span>Instagram Sharing Note</span>
            </div>
            <p style={{ margin: '0 0 8px 0' }}>
              Web browsers cannot post directly to Instagram feed or stories. You can copy the prepared link &amp; caption below to paste into your Instagram Bio, Story Link Sticker, or Direct Message.
            </p>
            <button
              type="button"
              onClick={handleCopyInstagramCaption}
              style={{
                background: '#BE185D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {copiedInstagram ? 'Caption Copied!' : 'Copy Instagram Caption & Link'}
            </button>
          </div>
        )}

        {/* Copy Direct Public Post URL */}
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
          Permanent Public Post Link
        </label>
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '6px 8px'
        }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              fontSize: '12px',
              color: '#334155',
              outline: 'none'
            }}
          />
          <button
            type="button"
            onClick={handleCopyLink}
            style={{
              background: copiedLink ? '#059669' : '#CA8A38',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {copiedLink ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
