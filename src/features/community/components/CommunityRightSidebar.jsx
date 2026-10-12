import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Star,
  ArrowRight
} from 'lucide-react';
import { useCommunityAuth } from '../context/CommunityAuthContext';
import { getRecommendedBooks } from '../data/communityBooks';

export default function CommunityRightSidebar({ sidebarData, selectedCategory = 'all' }) {
  const { user } = useCommunityAuth();

  const featuredCourse = sidebarData?.featuredCourse || {
    title: 'Bhagavad Gita for Modern Life',
    description: 'Timeless wisdom for a calmer, clearer and more purposeful life.',
    image: '/assets/images/community/featured-bhagavad-gita.png',
    badge: 'FEATURED',
    lessons: '12 Lessons',
    rating: '4.9 (1.2k students)',
    slug: 'bhagavad-gita-life'
  };

  const userTopics = Array.isArray(user?.topics) ? user.topics : [];

  const recommendedBooks = useMemo(() => {
    return getRecommendedBooks({
      userTopics,
      selectedCategory,
      limit: 3
    });
  }, [userTopics, selectedCategory]);

  const recommendedCourses = sidebarData?.recommendedCourses?.length ? sidebarData.recommendedCourses : [
    {
      id: 'rec-1',
      title: 'The Science of Mindfulness',
      subtitle: 'A practical course for modern life.',
      image: '/assets/images/community/science-of-mindfulness-thumb.jpg',
      lessons: '8 Lessons',
      rating: '4.8',
      slug: 'mindfulness'
    },
    {
      id: 'rec-2',
      title: 'Personal Growth Blueprint',
      subtitle: 'Tools for a more intentional life.',
      image: '/assets/images/community/personal-growth-thumb.jpg',
      lessons: '10 Lessons',
      rating: '4.7',
      slug: 'positive-psychology'
    }
  ];

  return (
    <aside className="community-right-sidebar community-sidebar-sticky">
      {/* 1. Featured Course Card */}
      <div className="community-mock-card">
        <div className="community-card-head-row">
          <h4 className="community-card-title">Featured Course</h4>
          <Link to="/positive-workshops" className="community-card-link">
            <span>View all</span>
            <span>→</span>
          </Link>
        </div>

        <div className="community-fc-banner-wrap">
          <img
            src={featuredCourse.image || '/assets/images/community/featured-bhagavad-gita.png'}
            alt={featuredCourse.title}
            className="community-fc-img"
          />
          <span className="community-fc-badge-tag">
            {featuredCourse.badge || 'FEATURED'}
          </span>
        </div>

        <h3 className="community-fc-heading">{featuredCourse.title}</h3>
        <p className="community-fc-subtext">{featuredCourse.description}</p>

        <div className="community-fc-meta-row">
          <div className="community-meta-stat">
            <BookOpen size={13} className="community-meta-icon" />
            <span>{featuredCourse.lessons || '12 Lessons'}</span>
          </div>
          <div className="community-meta-stat">
            <Star size={13} className="community-meta-icon star" />
            <span>{featuredCourse.rating || '4.9 (1.2k students)'}</span>
          </div>
        </div>

        <Link to={`/programs/${featuredCourse.slug || 'bhagavad-gita-life'}`} className="community-fc-action-btn">
          <span>Continue Learning</span>
          <span>→</span>
        </Link>
      </div>

      {/* 2. Recommended Books Card (Based on User's Interested Topics) */}
      <div className="community-mock-card">
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

        <div className="community-books-list">
          {recommendedBooks.map((book) => (
            <Link
              key={book.id}
              to={`/shop/${book.id}`}
              className="community-book-item-link"
              title={`View ${book.title} in Bookstore`}
            >
              <div className="community-book-cover-frame">
                <img
                  src={book.image}
                  alt={book.title}
                  className="community-book-cover-thumb"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/books/Bhagavadgeetha for Meaningful Life.png';
                  }}
                />
              </div>
              <div className="community-book-info">
                <div className="community-book-badge-row">
                  <span className="community-book-topic-pill">
                    {book.matchedTag || book.badge}
                  </span>
                </div>
                <h5 className="community-book-title">{book.title}</h5>
                <div className="community-book-meta-line">
                  <span className="community-book-author">Dr. Naveen Ellangala</span>
                  {book.price && (
                    <>
                      <span className="community-dot-sep">·</span>
                      <span className="community-book-price-tag">{book.price}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Recommended for You Card */}
      <div className="community-mock-card">
        <div className="community-card-head-row">
          <h4 className="community-card-title">Recommended for You</h4>
          <Link to="/positive-workshops" className="community-card-link">
            <span>See all</span>
            <span>→</span>
          </Link>
        </div>

        <div className="community-rec-list">
          {recommendedCourses.map((rc, i) => (
            <Link
              key={rc.id || i}
              to={`/programs/${rc.slug || 'positive-psychology'}`}
              className="community-rec-item-link"
            >
              <img
                src={rc.image}
                alt={rc.title}
                className="community-rec-thumb"
              />
              <div className="community-rec-info">
                <h5 className="community-rec-title">{rc.title}</h5>
                <p className="community-rec-subtitle">{rc.subtitle || rc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
