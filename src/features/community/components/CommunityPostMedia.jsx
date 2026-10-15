import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MoreVertical, X, ChevronLeft, ChevronRight } from 'lucide-react';

function getEmbedInfo(url) {
  if (!url) return null;
  const str = String(url).trim();
  const ytMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`
    };
  }
  const vimeoMatch = str.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }
  return null;
}

function getRatioContainerStyle(ratio) {
  switch (ratio) {
    case '1:1':
      return {
        aspectRatio: '1 / 1',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        alignSelf: 'center'
      };
    case '4:5':
      return {
        aspectRatio: '4 / 5',
        width: '100%',
        maxWidth: '430px',
        margin: '0 auto',
        alignSelf: 'center'
      };
    case '16:9':
      return {
        aspectRatio: '16 / 9',
        width: '100%',
        margin: '0 auto',
        alignSelf: 'center'
      };
    case '9:16':
      return {
        aspectRatio: '9 / 16',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto',
        alignSelf: 'center'
      };
    case 'auto':
    default:
      return {
        width: '100%',
        maxHeight: '520px',
        margin: '0 auto'
      };
  }
}

function GalleryCarousel({ mediaUrls, aspectRatio, onOpenLightbox }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const total = mediaUrls.length;

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev < total - 1 ? prev + 1 : prev));
  };

  // Touch swipe support (Mobile)
  const minSwipeDistance = 35;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const effectiveRatio = aspectRatio && aspectRatio !== 'auto' ? aspectRatio : '1:1';
  const ratioStyle = getRatioContainerStyle(effectiveRatio);

  return (
    <div
      className="community-gallery-slider-wrap"
      style={{ ...ratioStyle }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide Counter Pill (e.g. 1/5) */}
      <div className="community-gallery-counter-badge">
        <span>{currentIndex + 1}</span>
        <span style={{ opacity: 0.65 }}>/</span>
        <span>{total}</span>
      </div>

      {/* Horizontal Sliding Track */}
      <div
        className="community-gallery-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {mediaUrls.map((item, idx) => (
          <div
            key={item.id || idx}
            className="community-gallery-slide-item"
            onClick={() => onOpenLightbox(idx)}
            title="Click to view full screen"
          >
            <img
              src={item.mediaUrl}
              alt={item.caption || `Poster ${idx + 1}`}
              className="community-gallery-slide-img"
              loading="lazy"
              decoding="async"
              style={{
                objectFit: effectiveRatio === 'auto' ? 'contain' : 'cover'
              }}
            />
          </div>
        ))}
      </div>

      {/* Prev Navigation Arrow */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handlePrev}
          className="community-gallery-nav-arrow community-gallery-nav-prev"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Next Navigation Arrow */}
      {currentIndex < total - 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="community-gallery-nav-arrow community-gallery-nav-next"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Dot Indicators Bar */}
      {total > 1 && (
        <div className="community-gallery-dots-bar" onClick={(e) => e.stopPropagation()}>
          {mediaUrls.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`community-gallery-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommunityPostMedia({ postType, mediaUrls = [], aspectRatio = 'auto' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1055); // default
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        setIsPlaying(true);
      });
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  if (!mediaUrls || mediaUrls.length === 0) return null;

  // 1. Audio Post with custom waveform bar UI
  if (postType === 'audio') {
    const audioItem = mediaUrls[0];
    const waveBars = [
      14, 22, 16, 28, 36, 20, 26, 42, 30, 18, 34, 46, 32, 24, 38,
      28, 44, 36, 22, 30, 48, 38, 24, 32, 40, 26, 18, 30, 22, 16,
      28, 34, 20, 26, 38, 30, 18, 22, 16, 12, 18, 24, 20, 14, 10
    ];

    return (
      <div className="community-audio-player-mock">
        <audio
          ref={audioRef}
          src={audioItem.mediaUrl}
          preload="none"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        <button
          type="button"
          onClick={togglePlayAudio}
          className="community-audio-play-circle"
          title={isPlaying ? 'Pause Meditation' : 'Play Guided Meditation'}
        >
          {isPlaying ? (
            <Pause size={18} style={{ fill: '#FFFFFF', color: '#FFFFFF' }} />
          ) : (
            <Play size={18} style={{ fill: '#FFFFFF', color: '#FFFFFF', marginLeft: '2px' }} />
          )}
        </button>

        <div className="community-audio-waveform-wrap">
          {waveBars.map((height, idx) => {
            const progressRatio = duration > 0 ? currentTime / duration : 0;
            const barRatio = idx / waveBars.length;
            const isPlayed = barRatio <= progressRatio;

            return (
              <span
                key={idx}
                className={`community-wave-bar ${isPlayed ? 'is-played' : ''}`}
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>

        <div className="community-audio-timestamp">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="community-audio-controls-right">
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="community-audio-mini-btn"
            title="Volume"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            type="button"
            className="community-audio-mini-btn"
            title="Audio Options"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    );
  }

  // 2. Video Post (External YouTube/Vimeo Embed OR Uploaded MP4/WebM Video)
  const isVideo = postType === 'video' || (mediaUrls.length === 1 && (mediaUrls[0]?.mediaType === 'video' || String(mediaUrls[0]?.mediaUrl).match(/\.(mp4|webm|mov)(\?|$)/i)));
  if (isVideo) {
    const videoItem = mediaUrls[0];
    const embedInfo = getEmbedInfo(videoItem.mediaUrl);
    // Use the admin's exact chosen aspect ratio; default to 16:9 if unspecified
    const effectiveRatio = aspectRatio && aspectRatio !== 'auto' ? aspectRatio : '16:9';
    const ratioStyle = getRatioContainerStyle(effectiveRatio);

    return (
      <div className="community-post-media-wrap" style={{ ...ratioStyle, background: '#000000' }}>
        {embedInfo ? (
          <iframe
            src={embedInfo.embedUrl}
            title={videoItem.caption || 'Community Video'}
            className="community-media-video-frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            controls
            playsInline
            preload="none"
            src={videoItem.mediaUrl}
            className="community-media-video-element"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>
    );
  }

  // 3. Multi-Image Gallery (Instagram-style Horizontal Slides)
  if (postType === 'gallery' && mediaUrls.length > 1) {
    return (
      <>
        <GalleryCarousel
          mediaUrls={mediaUrls}
          aspectRatio={aspectRatio}
          onOpenLightbox={(idx) => setLightboxIndex(idx)}
        />

        {lightboxIndex !== null && (
          <div
            className="community-lightbox-backdrop"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="community-lightbox-close-btn"
              aria-label="Close"
            >
              <X size={26} />
            </button>

            <div className="community-lightbox-counter">
              {lightboxIndex + 1} / {mediaUrls.length}
            </div>

            {lightboxIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => prev - 1);
                }}
                className="community-lightbox-nav community-lightbox-prev"
                aria-label="Previous Image"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <img
              src={mediaUrls[lightboxIndex]?.mediaUrl}
              alt={mediaUrls[lightboxIndex]?.caption || `Full view ${lightboxIndex + 1}`}
              className="community-lightbox-img"
              onClick={(e) => e.stopPropagation()}
            />

            {lightboxIndex < mediaUrls.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => prev + 1);
                }}
                className="community-lightbox-nav community-lightbox-next"
                aria-label="Next Image"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>
        )}
      </>
    );
  }

  // 4. Single Panoramic / Featured Image Post
  const singleItem = mediaUrls[0];
  const effectiveRatio = aspectRatio || '16:9';
  const imgRatioStyle = getRatioContainerStyle(effectiveRatio);

  return (
    <>
      <div className="community-post-media-wrap" style={{ ...imgRatioStyle }}>
        <img
          src={singleItem.mediaUrl}
          alt={singleItem.caption || 'Community Post'}
          className="community-post-single-image"
          loading="lazy"
          decoding="async"
          onClick={() => setLightboxIndex(0)}
          style={{
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            objectFit: effectiveRatio === 'auto' ? 'contain' : 'cover'
          }}
        />
      </div>

      {lightboxIndex !== null && (
        <div
          className="community-lightbox-backdrop"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="community-lightbox-close-btn"
          >
            <X size={28} />
          </button>
          <img
            src={mediaUrls[lightboxIndex]?.mediaUrl}
            alt="Full view"
            className="community-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
