-- ============================================================================
-- Ellangala's Academy — Community Feed Schema
-- Compatible with MySQL (active pool) and PostgreSQL
-- All migrations are strictly additive with CREATE TABLE IF NOT EXISTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS community_categories (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description VARCHAR(255),
  icon VARCHAR(64) DEFAULT 'Hash',
  sortOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME
);

CREATE TABLE IF NOT EXISTS community_posts (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(64) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  categoryId VARCHAR(64),
  categoryName VARCHAR(120) DEFAULT 'General',
  authorName VARCHAR(120) DEFAULT 'Dr. Naveen Ellangala',
  authorRole VARCHAR(120) DEFAULT 'Founder & Positive Psychologist',
  authorAvatar VARCHAR(500) DEFAULT '/assets/images/resources/founder-avatar.png',
  postType VARCHAR(32) DEFAULT 'text',
  mediaUrls JSON,
  relatedCourseSlug VARCHAR(120),
  relatedCourseTitle VARCHAR(255),
  relatedEventId VARCHAR(191),
  relatedEventTitle VARCHAR(255),
  status VARCHAR(20) DEFAULT 'published',
  isPinned BOOLEAN DEFAULT FALSE,
  pinnedAt DATETIME,
  scheduledFor DATETIME,
  publishedAt DATETIME,
  likesCount INT DEFAULT 0,
  commentsCount INT DEFAULT 0,
  sharesCount INT DEFAULT 0,
  createdAt DATETIME,
  updatedAt DATETIME,
  INDEX idx_cp_status (status),
  INDEX idx_cp_pinned (isPinned),
  INDEX idx_cp_category (categoryId),
  INDEX idx_cp_event (relatedEventId),
  INDEX idx_cp_published (publishedAt)
);

CREATE TABLE IF NOT EXISTS community_post_media (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(64) UNIQUE NOT NULL,
  postId VARCHAR(64) NOT NULL,
  mediaType VARCHAR(20) NOT NULL,
  mediaUrl VARCHAR(500) NOT NULL,
  thumbnailUrl VARCHAR(500),
  caption VARCHAR(255),
  displayOrder INT DEFAULT 0,
  createdAt DATETIME,
  INDEX idx_cpm_post (postId)
);

CREATE TABLE IF NOT EXISTS community_likes (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(64) UNIQUE NOT NULL,
  postId VARCHAR(64) NOT NULL,
  visitorId VARCHAR(120) NOT NULL,
  createdAt DATETIME,
  UNIQUE KEY uniq_post_visitor_like (postId, visitorId),
  INDEX idx_cl_post (postId),
  INDEX idx_cl_visitor (visitorId)
);

CREATE TABLE IF NOT EXISTS community_saved_posts (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(64) UNIQUE NOT NULL,
  postId VARCHAR(64) NOT NULL,
  visitorId VARCHAR(120) NOT NULL,
  createdAt DATETIME,
  UNIQUE KEY uniq_post_visitor_save (postId, visitorId),
  INDEX idx_csp_visitor (visitorId),
  INDEX idx_csp_post (postId)
);

CREATE TABLE IF NOT EXISTS community_comments (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(64) UNIQUE NOT NULL,
  postId VARCHAR(64) NOT NULL,
  authorName VARCHAR(120) NOT NULL,
  authorEmail VARCHAR(180),
  authorAvatar VARCHAR(500),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'approved',
  visitorId VARCHAR(120),
  createdAt DATETIME,
  updatedAt DATETIME,
  INDEX idx_cc_post (postId),
  INDEX idx_cc_status (status)
);

CREATE TABLE IF NOT EXISTS community_users (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(180),
  passwordHash VARCHAR(255) NOT NULL,
  avatarUrl VARCHAR(500),
  topics JSON,
  token VARCHAR(255),
  tokenExpiresAt DATETIME,
  enrolledEvents JSON,
  enrolledCourses JSON,
  createdAt DATETIME,
  updatedAt DATETIME,
  INDEX idx_cu_phone (phone),
  INDEX idx_cu_name (name),
  INDEX idx_cu_token (token)
);
