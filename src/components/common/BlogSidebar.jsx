import React from 'react';
import { Link } from 'react-router-dom';
import { commonContent } from '../../contents/common.content';

export default function BlogSidebar() {
  const { blogSidebar } = commonContent;

  return (
    <div className="col-xl-4">
      <div className="sidebar">
        {/* Latest Posts */}
        <div className="sidebar__single sidebar__post wow animated fadeInUp" data-wow-delay="0.1s">
          <div className="title-box">
            <h2>{blogSidebar.recentPostsTitle}</h2>
          </div>
          <ul className="sidebar__post-list list-unstyled">
            {blogSidebar.recentPosts.map((post, idx) => (
              <li key={idx}>
                <div className="sidebar__post-image" style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="sidebar__post-content">
                  <h3>
                    <Link to={post.path}>{post.title}</Link>
                  </h3>
                  <span className="sidebar__post-date">{post.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
