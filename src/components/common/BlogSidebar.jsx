import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogContent } from '../../contents/blog.content';
import { blogService } from '../../admin/services/blogService';

function formatDate(dateStr) {
  if (!dateStr) return 'Nov 15, 2024';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function BlogSidebar({ currentSlug, currentId, currentCategory }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fallbackPosts = blogContent.list?.posts || [];

    blogService
      .getPublishedBlogs()
      .then((data) => {
        const pool = Array.isArray(data) && data.length > 0 ? data : fallbackPosts;
        processSuggestions(pool);
      })
      .catch(() => {
        processSuggestions(fallbackPosts);
      });
  }, [currentSlug, currentId, currentCategory]);

  const processSuggestions = (allPosts) => {
    // Exclude currently viewed post
    const others = allPosts.filter(
      (p) =>
        p.id !== currentId &&
        p.slug !== currentSlug &&
        String(p.id) !== String(currentId) &&
        String(p.slug) !== String(currentSlug)
    );

    if (others.length === 0) {
      setSuggestions([]);
      return;
    }

    // Deterministic pseudo-shuffle based on current identifier so it changes per blog page
    const seed = String(currentSlug || currentId || 'blog')
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const shuffled = [...others].sort((a, b) => {
      const hashA = (a.id || a.title || '').length + seed;
      const hashB = (b.id || b.title || '').length + seed;
      return (hashA % 7) - (hashB % 7);
    });

    // Take top 4 suggestions
    setSuggestions(shuffled.slice(0, 4));
  };

  const resolveBlogImg = (item) => {
    if (!item) return '/assets/images/blog/blog-mind-gym.jpg';
    const match = (blogContent.list?.posts || []).find(
      (b) => b.id === item.id || b.slug === item.slug || (b.title && item.title && b.title.trim().toLowerCase() === item.title.trim().toLowerCase())
    );
    if (match && (match.image || match.img)) {
      return match.image || match.img;
    }
    if (item.image && typeof item.image === 'string' && item.image.trim()) return item.image;
    if (item.img && typeof item.img === 'string' && item.img.trim()) return item.img;
    return '/assets/images/blog/blog-mind-gym.jpg';
  };

  return (
    <div className="col-xl-4">
      <div className="sidebar">
        {/* Suggested / Recent Posts */}
        <div className="sidebar__single sidebar__post wow animated fadeInUp" data-wow-delay="0.1s">
          <div className="title-box">
            <h2>Suggested Posts</h2>
          </div>
          <ul className="sidebar__post-list list-unstyled">
            {suggestions.map((post, idx) => {
              const detailUrl = `/insights/${post.slug || post.id}`;
              const postImg = resolveBlogImg(post);
              const postDate = formatDate(post.publishedAt || post.date || post.createdAt);

              return (
                <li key={post.id || idx}>
                  <div
                    className="sidebar__post-image"
                    style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}
                  >
                    <img
                      src={postImg}
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/blog/blog-mind-gym.jpg';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="sidebar__post-content">
                    <h3>
                      <Link to={detailUrl}>{post.title}</Link>
                    </h3>
                    <span className="sidebar__post-date">{postDate}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
