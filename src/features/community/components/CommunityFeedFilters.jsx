import React from 'react';

export default function CommunityFeedFilters({ activeFilter, onSelectFilter, totalPosts = 0 }) {
  return (
    <div className="community-feed-header-bar-mock">
      <h3 className="community-feed-heading-mock">
        Feed
      </h3>

      <div className="community-filter-tabs-mock">
        <button
          type="button"
          className={`community-tab-mock ${activeFilter === 'latest' ? 'active' : ''}`}
          onClick={() => onSelectFilter('latest')}
        >
          Latest
        </button>

        <button
          type="button"
          className={`community-tab-mock ${activeFilter === 'popular' ? 'active' : ''}`}
          onClick={() => onSelectFilter('popular')}
        >
          Popular
        </button>
      </div>
    </div>
  );
}
