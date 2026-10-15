import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Star,
  Play,
  ExternalLink
} from 'lucide-react';
import { useCommunityAuth } from '../context/CommunityAuthContext';
import { getRecommendedBooks } from '../data/communityBooks';
import { getRecommendedWorkshops } from '../data/communityWorkshops';

const FREE_RESOURCES = [
  {
    id: 'QBDnfvPzp9Q',
    title: 'Therapy Skills to Stop Overthinking',
    subtitle: 'Evidence-based tools to calm mental noise, overcome worry, and build resilience.',
    url: 'https://www.youtube.com/watch?v=QBDnfvPzp9Q',
    thumbnail: 'https://img.youtube.com/vi/QBDnfvPzp9Q/hqdefault.jpg',
    badge: 'FREE VIDEO',
    speaker: 'Dr. Naveen Ellangala'
  },
  {
    id: 'xLyaMchs6P0',
    title: 'ಬದುಕನ್ನು ಸವಿಯೊ... ಸವೆಯಬೇಡ | MindGym Song',
    subtitle: 'Kannada motivational wisdom on cultivating an uplifting positive mindset.',
    url: 'https://www.youtube.com/watch?v=xLyaMchs6P0',
    thumbnail: 'https://img.youtube.com/vi/xLyaMchs6P0/hqdefault.jpg',
    badge: 'MOTIVATION',
    speaker: 'Dr. Naveen Ellangala'
  },
  {
    id: 'smb1UusRZ98',
    title: 'ಮನಸು ಎಲ್ಲೆಲ್ಲೋ ಓಡುವುದು ಯಾಕೆ? | Mental Health Talk',
    subtitle: 'Understanding the wandering mind and training attention towards calm.',
    url: 'https://www.youtube.com/watch?v=smb1UusRZ98',
    thumbnail: 'https://img.youtube.com/vi/smb1UusRZ98/hqdefault.jpg',
    badge: 'MIND TRAINING',
    speaker: 'Dr. Naveen Ellangala'
  }
];

export default function CommunityRightSidebar({ sidebarData, selectedCategory = 'all' }) {
  const { user } = useCommunityAuth();

  const primaryFreeResource = FREE_RESOURCES[0];
  const moreFreeResources = FREE_RESOURCES.slice(1);

  const userTopics = Array.isArray(user?.topics) ? user.topics : [];

  const recommendedBooks = useMemo(() => {
    return getRecommendedBooks({
      userTopics,
      selectedCategory,
      limit: 4
    });
  }, [userTopics, selectedCategory]);

  const recommendedWorkshops = useMemo(() => {
    if (sidebarData?.recommendedWorkshops?.length) {
      return sidebarData.recommendedWorkshops;
    }
    if (sidebarData?.recommendedCourses?.length) {
      const isDemo = sidebarData.recommendedCourses.some(c =>
        c.title === 'The Science of Mindfulness' || c.title === 'Personal Growth Blueprint'
      );
      if (!isDemo) {
        return sidebarData.recommendedCourses;
      }
    }
    return getRecommendedWorkshops({
      userTopics,
      selectedCategory,
      limit: 2
    });
  }, [sidebarData?.recommendedWorkshops, sidebarData?.recommendedCourses, userTopics, selectedCategory]);

  return (
    <aside className="community-right-sidebar community-sidebar-sticky">
      {/* 1. Free Resources Card (Navigating into YouTube) */}
      <div className="community-mock-card community-fr-card">
        <div className="community-card-head-row">
          <div>
            <h4 className="community-card-title">Free Resources</h4>
            <span className="community-card-topic-subtitle">
              Video Masterclasses &amp; Talks
            </span>
          </div>
          <Link to="/free-resources" className="community-card-link">
            <span>View all</span>
            <span>→</span>
          </Link>
        </div>

        {/* Featured Video Banner */}
        <a
          href={primaryFreeResource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="community-fr-banner-link"
          title={`Watch "${primaryFreeResource.title}" on YouTube`}
        >
          <div className="community-fc-banner-wrap community-fr-banner-wrap">
            <img
              src={primaryFreeResource.thumbnail}
              alt={primaryFreeResource.title}
              className="community-fc-img"
            />
            <span className="community-fc-badge-tag community-fr-yt-badge">
              <i className="fab fa-youtube" style={{ marginRight: '4px', color: '#FF0000' }}></i>
              FREE VIDEO
            </span>
            <div className="community-fr-play-overlay">
              <div className="community-fr-play-btn">
                <Play size={18} fill="#FFFFFF" color="#FFFFFF" />
              </div>
            </div>
          </div>
        </a>

        <h3 className="community-fc-heading">
          <a
            href={primaryFreeResource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="community-fr-title-link"
          >
            {primaryFreeResource.title}
          </a>
        </h3>
        <p className="community-fc-subtext">{primaryFreeResource.subtitle}</p>

        <div className="community-fc-meta-row">
          <div className="community-meta-stat">
            <i className="fab fa-youtube" style={{ color: '#FF0000', fontSize: '13px' }}></i>
            <span>YouTube Lesson</span>
          </div>
          <div className="community-meta-stat">
            <span className="community-free-pill">100% Free</span>
          </div>
        </div>

        <a
          href={primaryFreeResource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="community-fc-action-btn community-yt-watch-btn"
        >
          <i className="fab fa-youtube" style={{ fontSize: '14px' }}></i>
          <span>Watch on YouTube</span>
          <ExternalLink size={13} />
        </a>

        {/* More Free Video Lessons */}
        <div className="community-fr-more-list">
          {moreFreeResources.map((res) => (
            <a
              key={res.id}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="community-fr-mini-item"
              title={`Watch "${res.title}" on YouTube`}
            >
              <div className="community-fr-mini-thumb-wrap">
                <img
                  src={res.thumbnail}
                  alt={res.title}
                  className="community-fr-mini-thumb"
                />
                <div className="community-fr-mini-play">
                  <Play size={10} fill="#FFFFFF" color="#FFFFFF" />
                </div>
              </div>
              <div className="community-fr-mini-info">
                <h5 className="community-fr-mini-title">{res.title}</h5>
                <span className="community-fr-mini-meta">
                  <i className="fab fa-youtube" style={{ color: '#FF0000', fontSize: '10px' }}></i>
                  <span>Watch on YouTube</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 2. Recommended Books Card (Based on User's Interested Topics) */}
      <div className="community-mock-card community-books-card">
        <div className="community-card-head-row">
          <div>
            <h4 className="community-card-title">Recommended Books</h4>
            <span className="community-card-topic-subtitle">
              {userTopics.length > 0 ? 'Matched to your topics' : 'By Dr. Naveen Ellangala'}
            </span>
          </div>
          <Link to="/shop" className="community-card-link">
            <span>Explore all</span>
            <span>→</span>
          </Link>
        </div>

        <div className="community-books-grid-2x2">
          {recommendedBooks.map((book) => (
            <Link
              key={book.id}
              to={`/shop/${book.id}`}
              className="community-book-grid-card"
              title={`View ${book.title} in Bookstore`}
            >
              <div className="community-book-sq-thumb-wrap">
                <img
                  src={book.image}
                  alt={book.title}
                  className="community-book-sq-thumb"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/books/Bhagavadgeetha for Meaningful Life.png';
                  }}
                />
              </div>
              <div className="community-book-sq-meta">
                <h5 className="community-book-sq-title" title={book.title}>
                  {book.title}
                </h5>
                <span className="community-book-sq-price">
                  {book.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Recommended for You Card */}
      <div className="community-mock-card community-rec-card">
        <div className="community-card-head-row">
          <h4 className="community-card-title">Recommended for You</h4>
          <Link to="/positive-workshops" className="community-card-link">
            <span>See all</span>
            <span>→</span>
          </Link>
        </div>

        <div className="community-rec-list">
          {recommendedWorkshops.map((ws, i) => (
            <Link
              key={ws.id || ws.slug || i}
              to={ws.link || `/programs/${ws.slug}`}
              className="community-rec-item-link"
              title={`Explore ${ws.title}`}
            >
              <img
                src={ws.image}
                alt={ws.title}
                className="community-rec-thumb"
                onError={(e) => {
                  e.currentTarget.src = '/assets/images/programs/the-art-of-mind-training.png';
                }}
              />
              <div className="community-rec-info">
                <h5 className="community-rec-title">{ws.title}</h5>
                <p className="community-rec-subtitle">{ws.subtitle || ws.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
