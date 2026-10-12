import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MoreVertical, X } from 'lucide-react';

export default function CommunityPostMedia({ postType, mediaUrls = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1055); // 17:35 default if not loaded
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Fallback simulated playing if audio src is placeholder
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
    // Waveform bar heights mimicking realistic sound wave
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
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Circular Gold Play Button */}
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

        {/* Waveform Visualization Bars */}
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

        {/* Timestamp */}
        <div className="community-audio-timestamp">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Volume & Options */}
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

  // 2. Video Post
  if (postType === 'video') {
    const videoItem = mediaUrls[0];
    return (
      <div className="community-post-media-wrap">
        <div className="community-media-video-wrap">
          <video controls src={videoItem.mediaUrl} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
        </div>
      </div>
    );
  }

  // 3. Single Panoramic / Featured Image Post
  const singleItem = mediaUrls[0];
  return (
    <>
      <div className="community-post-media-wrap">
        <img
          src={singleItem.mediaUrl}
          alt={singleItem.caption || 'Community Post'}
          className="community-post-single-image"
          loading="lazy"
          onClick={() => setLightboxIndex(0)}
          style={{ cursor: 'pointer' }}
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
