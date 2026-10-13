import React from 'react';
import { Users, BookOpen, Sparkles } from 'lucide-react';
import founderHeroBg from '../../../Images/Founder PAge Hero.png';

export default function CommunityWelcomeBanner() {
  return (
    <div
      className="community-welcome-banner-mock"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(255, 253, 248, 0.96) 0%, rgba(255, 253, 248, 0.90) 45%, rgba(255, 253, 248, 0.35) 68%, rgba(255, 253, 248, 0) 100%), url(${founderHeroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="community-wb-left-content">
        <h2 className="community-wb-heading">
          Welcome to the<br />Ellangala Feed
        </h2>
        <p className="community-wb-subheading">
          Learn, reflect, and grow with Dr. Naveen Ellangala.
        </p>

        <div className="community-wb-features-row">
          <div className="community-wb-feature-item">
            <Users size={11} className="community-wb-feature-icon" />
            <span>Meaningful Discussions</span>
          </div>

          <div className="community-wb-feature-item">
            <BookOpen size={11} className="community-wb-feature-icon" />
            <span>Practical Wisdom</span>
          </div>

          <div className="community-wb-feature-item">
            <Sparkles size={11} className="community-wb-feature-icon" />
            <span>Supportive Community</span>
          </div>
        </div>
      </div>
    </div>
  );
}
