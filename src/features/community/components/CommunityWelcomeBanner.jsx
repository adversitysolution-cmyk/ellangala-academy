import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';
import founderHeroBg from '../../../Images/Founder PAge Hero.png';
import { communityService } from '../services/communityService';
import { useAdminAuth } from '../../../admin/context/AdminAuthContext';

export function hexToRgb(hex = '#FFFDF8') {
  let c = String(hex || '#FFFDF8').replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return { r: 255, g: 253, b: 248, isDark: false };
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // Perceived luminance formula (ITU-R BT.709)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return { r, g, b, isDark: luminance < 140 };
}

export default function CommunityWelcomeBanner() {
  const { isAuthenticated: isAdmin } = useAdminAuth();

  const [banner, setBanner] = useState({
    heading: "Welcome to the\nEllangala Feed",
    subheading: "Learn, reflect, and grow with Dr. Naveen Ellangala.",
    imageUrl: "/assets/images/community/founder-feed-hero.png",
    gradientColor: "#FFFDF8",
    textColorMode: "auto"
  });

  const [resolvedImage, setResolvedImage] = useState("/assets/images/community/founder-feed-hero.png");

  useEffect(() => {
    communityService.getHeroBanner()
      .then((data) => {
        if (data && data.heading) {
          setBanner(data);
          const targetUrl = data.imageUrl || "/assets/images/community/founder-feed-hero.png";
          // Preload and test image before setting as background to guarantee it never fails or shows blank
          const testImg = new Image();
          testImg.onload = () => setResolvedImage(targetUrl);
          testImg.onerror = () => {
            // Fall back to reliable static asset or bundled import
            setResolvedImage(founderHeroBg || "/assets/images/community/founder-feed-hero.png");
          };
          testImg.src = targetUrl;
        }
      })
      .catch(() => {
        setResolvedImage(founderHeroBg || "/assets/images/community/founder-feed-hero.png");
      });
  }, []);

  const rgb = hexToRgb(banner.gradientColor || '#FFFDF8');
  const isDarkText = banner.textColorMode === 'dark'
    ? true
    : banner.textColorMode === 'light'
      ? false
      : !rgb.isDark;

  const gradientOverlay = `linear-gradient(90deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.96) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.90) 45%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35) 68%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 100%)`;
  const bgImage = resolvedImage || founderHeroBg || "/assets/images/community/founder-feed-hero.png";

  return (
    <div
      className="community-welcome-banner-mock"
      style={{
        backgroundImage: `${gradientOverlay}, url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Admin Quick Edit Button (Visible to logged-in Admin only) */}
      {isAdmin && (
        <Link
          to="/admin/feed?tab=hero-banner"
          className="community-hero-edit-btn"
          title="Edit Feed Hero Banner (Admin)"
        >
          <Edit size={13} />
          <span>Edit Hero Banner</span>
        </Link>
      )}

      <div className="community-wb-left-content">
        <h2
          className="community-wb-heading"
          style={{
            color: isDarkText ? '#0F172A' : '#FFFFFF',
            textShadow: isDarkText
              ? '0 1px 2px rgba(255, 255, 255, 0.9)'
              : '0 2px 4px rgba(0, 0, 0, 0.45)',
            whiteSpace: 'pre-line'
          }}
        >
          {banner.heading || "Welcome to the\nEllangala Feed"}
        </h2>
        <p
          className="community-wb-subheading"
          style={{
            color: isDarkText ? '#334155' : '#E2E8F0',
            textShadow: isDarkText
              ? '0 1px 2px rgba(255, 255, 255, 0.8)'
              : '0 1px 3px rgba(0, 0, 0, 0.4)',
            marginBottom: 0
          }}
        >
          {banner.subheading || "Learn, reflect, and grow with Dr. Naveen Ellangala."}
        </p>
      </div>
    </div>
  );
}
