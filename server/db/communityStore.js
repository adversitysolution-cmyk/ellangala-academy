import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';
import { getDbEvents, getDbEnrollments } from './store.js';
import { programsData } from '../../src/contents/programsData.content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toDbDatetime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function parseJson(val, fallback = null) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

const USERS_DATA_FILE = path.join(__dirname, 'community-users.json');

function loadPersistentUsers() {
  const map = new Map();
  try {
    if (fs.existsSync(USERS_DATA_FILE)) {
      const list = JSON.parse(fs.readFileSync(USERS_DATA_FILE, 'utf-8'));
      if (Array.isArray(list)) {
        for (const u of list) {
          if (u.id) map.set(u.id, u);
        }
      }
    }
  } catch (err) {
    console.error('Error loading persistent community users:', err);
  }
  return map;
}

function savePersistentUsers(userMap) {
  try {
    const list = Array.from(userMap.values());
    fs.writeFileSync(USERS_DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving persistent community users:', err);
  }
}

const POSTS_DATA_FILE = path.join(__dirname, 'community-posts.json');
const BACKUPS_DIR = path.join(__dirname, 'backups');
const LATEST_BACKUP_FILE = path.join(BACKUPS_DIR, 'community-posts-latest-backup.json');
const DELETED_POSTS_FILE = path.join(BACKUPS_DIR, 'community-deleted-posts.json');

if (!fs.existsSync(BACKUPS_DIR)) {
  try { fs.mkdirSync(BACKUPS_DIR, { recursive: true }); } catch (_) { }
}

function archiveDeletedPost(post) {
  try {
    let list = [];
    if (fs.existsSync(DELETED_POSTS_FILE)) {
      try { list = JSON.parse(fs.readFileSync(DELETED_POSTS_FILE, 'utf-8')); } catch (_) { }
    }
    list.unshift({ ...post, _deletedAt: new Date().toISOString() });
    fs.writeFileSync(DELETED_POSTS_FILE, JSON.stringify(list.slice(0, 100), null, 2), 'utf-8');
  } catch (err) {
    console.warn('Warning: Could not archive deleted post:', err.message);
  }
}

function loadPersistentPosts() {
  try {
    if (fs.existsSync(POSTS_DATA_FILE)) {
      const raw = fs.readFileSync(POSTS_DATA_FILE, 'utf-8').trim();
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      }
    }
  } catch (err) {
    console.error('Error loading persistent community posts from primary file:', err.message);
  }

  // Fail-Safe Auto-Recovery from Master Backup
  try {
    if (fs.existsSync(LATEST_BACKUP_FILE)) {
      const raw = fs.readFileSync(LATEST_BACKUP_FILE, 'utf-8').trim();
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          console.warn('🛡️ Auto-Recovery: Successfully restored community posts from master backup!');
          try {
            fs.writeFileSync(POSTS_DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
          } catch (_) { }
          return list;
        }
      }
    }
  } catch (backupErr) {
    console.error('Error restoring from backup file:', backupErr.message);
  }

  return null;
}

function savePersistentPosts(posts = memoryStore?.posts, force = false) {
  try {
    const dataToSave = posts || (memoryStore && memoryStore.posts) || [];
    if (!Array.isArray(dataToSave)) return;

    // Safety Shield: Never overwrite an existing populated file with an empty list unless force=true
    if (!force && dataToSave.length === 0 && fs.existsSync(POSTS_DATA_FILE)) {
      try {
        const existing = JSON.parse(fs.readFileSync(POSTS_DATA_FILE, 'utf-8'));
        if (Array.isArray(existing) && existing.length > 0) {
          console.warn('🛡️ Safety Shield Active: Prevented overwriting existing posts with an empty array.');
          return;
        }
      } catch (_) { }
    }

    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }

    const jsonString = JSON.stringify(dataToSave, null, 2);

    // 1. Maintain Master Latest Backup
    try {
      fs.writeFileSync(LATEST_BACKUP_FILE, jsonString, 'utf-8');
    } catch (_) { }

    // 2. Rotate timestamped historical snapshots (keep latest 10)
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const snapshotFile = path.join(BACKUPS_DIR, `community-posts-${timestamp}.json`);
      fs.writeFileSync(snapshotFile, jsonString, 'utf-8');

      const files = fs.readdirSync(BACKUPS_DIR)
        .filter(f => f.startsWith('community-posts-20') && f.endsWith('.json'))
        .sort();
      while (files.length > 10) {
        const oldest = files.shift();
        fs.unlinkSync(path.join(BACKUPS_DIR, oldest));
      }
    } catch (_) { }

    // 3. Safe Atomic Write to primary file
    const tmpFile = path.join(__dirname, `community-posts.${Date.now()}.${Math.random().toString(36).slice(2, 6)}.tmp`);
    fs.writeFileSync(tmpFile, jsonString, 'utf-8');
    fs.renameSync(tmpFile, POSTS_DATA_FILE);
  } catch (err) {
    console.error('Error saving persistent community posts safely:', err);
  }
}

// In-memory fallback for local DB-free / demo mode
const memoryStore = {
  categories: [],
  posts: loadPersistentPosts() || [],
  likes: new Map(), // key: postId:visitorId
  saved: new Map(), // key: postId:visitorId
  comments: [],
  users: loadPersistentUsers(), // persistent from community-users.json
  events: []
};

// Initial default categories
const DEFAULT_CATEGORIES = [
  { id: 'cat-mindgym', name: 'Positive MindGym', slug: 'positive-mindgym', description: 'Practical everyday mental conditioning, focus, and emotional strength', icon: 'Brain', sortOrder: 1 },
  { id: 'cat-wisdom', name: 'Daily Positive Wisdom', slug: 'daily-wisdom', description: 'Core principles of Positive Psychology, PERMA model, and purposeful living', icon: 'Sparkles', sortOrder: 2 },
  { id: 'cat-workshops', name: 'Workshops & Events', slug: 'workshops-events', description: 'Live announcements, masterclasses, and interactive experiential sessions', icon: 'CalendarDays', sortOrder: 3 },
  { id: 'cat-research', name: 'Doctoral Insights', slug: 'doctoral-insights', description: 'Scientific research and practical applications by Dr. Naveen Ellangala', icon: 'BookOpen', sortOrder: 4 },
  { id: 'cat-wellness', name: 'Emotional Wellness', slug: 'emotional-wellness', description: 'Mindfulness, anxiety resilience, gratitude exercises, and mental health', icon: 'Heart', sortOrder: 5 }
];

// Initial seed posts authored by Dr. Naveen Ellangala
const SEED_POSTS = [
  {
    id: 'post-seed-001',
    title: 'Welcome to the Ellangala Community! 🙏',
    content: "Thank you for being a part of this journey. This community is a space to learn, reflect, ask questions, and support each other in living a more mindful and meaningful life.\n\nHere you'll find updates on upcoming workshops, insights from the Bhagavad Gita, practical tools for daily living, and a supportive community of seekers.",
    categoryId: 'cat-wisdom',
    categoryName: 'Community Announcement',
    authorName: 'Dr. Naveen Ellangala',
    authorRole: 'Founder & Positive Psychologist',
    authorAvatar: '/assets/images/team/naveen-ellangala.jpg',
    postType: 'text',
    mediaUrls: [],
    relatedCourseSlug: null,
    relatedCourseTitle: null,
    status: 'published',
    isPinned: true,
    pinnedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    scheduledFor: null,
    publishedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    likesCount: 212,
    commentsCount: 36,
    sharesCount: 15,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: 'post-seed-002',
    title: 'A Thought for Today',
    content: '"Peace is not the absence of activity, but the presence of clarity within activity."\n\nIn the Bhagavad Gita, Krishna reminds us that we can act fully in the world, yet remain inwardly steady. It is a practice — and a possibility for all of us.',
    categoryId: 'cat-mindgym',
    categoryName: 'Life Reflections',
    authorName: 'Dr. Naveen Ellangala',
    authorRole: 'Founder & Positive Psychologist',
    authorAvatar: '/assets/images/team/naveen-ellangala.jpg',
    postType: 'single_image',
    aspectRatio: '16:9',
    mediaUrls: [
      {
        id: 'media-002',
        mediaType: 'image',
        mediaUrl: '/assets/images/community/meditation-sunrise-panoramic.jpg',
        caption: 'Sunrise meditation overlooking the Himalayas',
        displayOrder: 1
      }
    ],
    relatedCourseSlug: 'the-art-of-mind-training',
    relatedCourseTitle: 'The Art of Mind Training',
    status: 'published',
    isPinned: false,
    pinnedAt: null,
    scheduledFor: null,
    publishedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    likesCount: 186,
    commentsCount: 24,
    sharesCount: 12,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'post-seed-003',
    title: 'Guided Meditation – Inner Stillness (17 mins)',
    content: 'A short guided meditation to help you relax, center yourself, and reconnect with your inner awareness.',
    categoryId: 'cat-wellness',
    categoryName: 'Guided Practice',
    authorName: 'Dr. Naveen Ellangala',
    authorRole: 'Founder & Positive Psychologist',
    authorAvatar: '/assets/images/team/naveen-ellangala.jpg',
    postType: 'audio',
    mediaUrls: [
      {
        id: 'media-003',
        mediaType: 'audio',
        mediaUrl: '/assets/audio/morning-reflection.mp3',
        caption: '17-minute guided meditation with Dr. Naveen Ellangala',
        displayOrder: 1
      }
    ],
    relatedCourseSlug: null,
    relatedCourseTitle: null,
    status: 'published',
    isPinned: false,
    pinnedAt: null,
    scheduledFor: null,
    publishedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    likesCount: 134,
    commentsCount: 18,
    sharesCount: 9,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 96).toISOString()
  }
];

// Initialize schema on server startup
export async function ensureCommunitySchema() {
  if (!pool) {
    console.log('ℹ️ Community Feed running in DB-free / static mode (using persistent memory store).');
    if (memoryStore.categories.length === 0) {
      memoryStore.categories = [...DEFAULT_CATEGORIES];
    }
    const persisted = loadPersistentPosts();
    if (persisted && persisted.length > 0) {
      memoryStore.posts = persisted;
    } else if (memoryStore.posts.length === 0) {
      memoryStore.posts = [...SEED_POSTS];
      savePersistentPosts(memoryStore.posts);
    }
    try {
      const adminProfileFile = path.join(__dirname, '..', 'uploads', 'admin-profile.json');
      if (fs.existsSync(adminProfileFile)) {
        const adminProfile = JSON.parse(fs.readFileSync(adminProfileFile, 'utf-8'));
        await syncAdminProfileToPosts(adminProfile);
      }
    } catch (_) { }
    return;
  }

  const schemaPath = path.join(__dirname, 'communitySchema.sql');
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, 'utf-8');
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await pool.query(stmt);
    }
  }

  // Seed default categories if empty
  const [[{ catCount }]] = await pool.query('SELECT COUNT(*) AS catCount FROM community_categories');
  if (Number(catCount) === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await pool.query(
        'INSERT INTO community_categories (id, name, slug, description, icon, sortOrder, isActive, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.sortOrder, true, toDbDatetime(new Date().toISOString())]
      );
    }
  }

  // Seed default posts if empty
  const [[{ postCount }]] = await pool.query('SELECT COUNT(*) AS postCount FROM community_posts');
  if (Number(postCount) === 0) {
    for (const p of SEED_POSTS) {
      await pool.query(
        `INSERT INTO community_posts (
          id, title, content, categoryId, categoryName, authorName, authorRole, authorAvatar,
          postType, mediaUrls, relatedCourseSlug, relatedCourseTitle, relatedEventId, relatedEventTitle,
          status, isPinned, pinnedAt, scheduledFor, publishedAt, likesCount, commentsCount, sharesCount,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id, p.title, p.content, p.categoryId, p.categoryName, p.authorName, p.authorRole, p.authorAvatar,
          p.postType, JSON.stringify(p.mediaUrls), p.relatedCourseSlug, p.relatedCourseTitle, null, null,
          p.status, p.isPinned, toDbDatetime(p.pinnedAt), toDbDatetime(p.scheduledFor), toDbDatetime(p.publishedAt),
          p.likesCount, p.commentsCount, p.sharesCount, toDbDatetime(p.createdAt), toDbDatetime(p.updatedAt)
        ]
      );
    }
  }

  try {
    const adminProfileFile = path.join(__dirname, '..', 'uploads', 'admin-profile.json');
    if (fs.existsSync(adminProfileFile)) {
      const adminProfile = JSON.parse(fs.readFileSync(adminProfileFile, 'utf-8'));
      await syncAdminProfileToPosts(adminProfile);
    }
  } catch (_) { }

  if (pool) {
    try {
      await pool.query("ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS aspectRatio VARCHAR(32) DEFAULT '16:9'");
    } catch (_) { }
  }

  console.log('✅ Community Feed schema verified and initialized.');

  // Auto-publish any scheduled posts periodically (every 15 seconds)
  setInterval(() => {
    try {
      autoPublishDueScheduledPosts();
    } catch (_) { }
  }, 15000);
}

function autoPublishDueScheduledPosts() {
  const nowMs = Date.now();
  let updated = false;
  for (const p of memoryStore.posts) {
    if (p.status === 'scheduled' && p.scheduledFor) {
      const schedMs = new Date(p.scheduledFor).getTime();
      if (!isNaN(schedMs) && schedMs <= nowMs) {
        p.status = 'published';
        p.publishedAt = p.publishedAt || p.scheduledFor;
        p.updatedAt = new Date().toISOString();
        updated = true;
      }
    }
  }
  if (updated) {
    savePersistentPosts();
  }
}

// ============================================================================
// CATEGORIES
// ============================================================================
export async function getCommunityCategories() {
  if (!pool) {
    return memoryStore.categories.filter(c => c.isActive !== false);
  }
  const [rows] = await pool.query('SELECT * FROM community_categories WHERE isActive = TRUE ORDER BY sortOrder ASC');
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    icon: r.icon,
    sortOrder: r.sortOrder
  }));
}

// ============================================================================
// POSTS
// ============================================================================
export async function getCommunityPosts({
  category = null,
  filter = 'latest', // 'latest', 'popular', 'pinned', 'saved'
  page = 1,
  limit = 10,
  search = '',
  status = 'published',
  includeDrafts = false,
  visitorId = null
} = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const offset = (pageNum - 1) * limitNum;
  const nowIso = new Date().toISOString();

  if (!pool) {
    autoPublishDueScheduledPosts();
    const nowMs = Date.now();
    let posts = [...memoryStore.posts];

    // Filter by visibility / status
    if (!includeDrafts) {
      posts = posts.filter(p => {
        if (p.status === 'published') return true;
        if (p.status === 'scheduled' && p.scheduledFor) {
          const schedMs = new Date(p.scheduledFor).getTime();
          return !isNaN(schedMs) && schedMs <= nowMs;
        }
        return false;
      });
    } else if (status && status !== 'all') {
      posts = posts.filter(p => p.status === status);
    }

    // Filter by category
    if (category && category !== 'all') {
      posts = posts.filter(p => p.categoryId === category || p.categoryName?.toLowerCase() === category.toLowerCase());
    }

    // Search query
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(p => p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q));
    }

    // Tab filter
    if (filter === 'pinned') {
      posts = posts.filter(p => Boolean(p.isPinned));
    } else if (filter === 'saved' && visitorId) {
      posts = posts.filter(p => memoryStore.saved.has(`${p.id}:${visitorId}`));
    }

    // Sort order
    if (filter === 'popular') {
      posts.sort((a, b) => (b.likesCount * 2 + b.commentsCount * 3) - (a.likesCount * 2 + a.commentsCount * 3));
    } else {
      posts.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
      });
    }

    const total = posts.length;
    const paginated = posts.slice(offset, offset + limitNum).map(p => ({
      ...p,
      aspectRatio: p.aspectRatio || (p.postType === 'video' ? '16:9' : (p.postType === 'single_image' ? '16:9' : 'auto')),
      hasLiked: visitorId ? memoryStore.likes.has(`${p.id}:${visitorId}`) : false,
      hasSaved: visitorId ? memoryStore.saved.has(`${p.id}:${visitorId}`) : false
    }));

    return {
      posts: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  }

  // MySQL Execution
  const conditions = [];
  const params = [];

  if (!includeDrafts) {
    conditions.push('(status = "published" OR (status = "scheduled" AND scheduledFor <= NOW()))');
  } else if (status && status !== 'all') {
    conditions.push('status = ?');
    params.push(status);
  }

  if (category && category !== 'all') {
    conditions.push('(categoryId = ? OR categoryName = ?)');
    params.push(category, category);
  }

  if (search) {
    conditions.push('(title LIKE ? OR content LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (filter === 'pinned') {
    conditions.push('isPinned = TRUE');
  } else if (filter === 'saved' && visitorId) {
    conditions.push('id IN (SELECT postId FROM community_saved_posts WHERE visitorId = ?)');
    params.push(visitorId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'isPinned DESC, publishedAt DESC, createdAt DESC';
  if (filter === 'popular') {
    orderBy = '(likesCount * 2 + commentsCount * 3) DESC, publishedAt DESC';
  }

  // Count total matching
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM community_posts ${whereClause}`, params);

  // Fetch paginated rows
  const query = `
    SELECT * FROM community_posts
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(query, [...params, limitNum, offset]);

  // Visitor interaction annotation
  let likedPostIds = new Set();
  let savedPostIds = new Set();
  if (visitorId && rows.length > 0) {
    const postIds = rows.map(r => r.id);
    const [likeRows] = await pool.query(
      `SELECT postId FROM community_likes WHERE visitorId = ? AND postId IN (${postIds.map(() => '?').join(',')})`,
      [visitorId, ...postIds]
    );
    likedPostIds = new Set(likeRows.map(r => r.postId));

    const [savedRows] = await pool.query(
      `SELECT postId FROM community_saved_posts WHERE visitorId = ? AND postId IN (${postIds.map(() => '?').join(',')})`,
      [visitorId, ...postIds]
    );
    savedPostIds = new Set(savedRows.map(r => r.postId));
  }

  const posts = rows.map(r => ({
    id: r.id,
    title: r.title,
    content: r.content,
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    authorName: r.authorName,
    authorRole: r.authorRole,
    authorAvatar: r.authorAvatar,
    postType: r.postType,
    aspectRatio: r.aspectRatio || (r.postType === 'video' ? '16:9' : (r.postType === 'single_image' ? '16:9' : 'auto')),
    mediaUrls: parseJson(r.mediaUrls, []),
    relatedCourseSlug: r.relatedCourseSlug,
    relatedCourseTitle: r.relatedCourseTitle,
    relatedEventId: r.relatedEventId,
    relatedEventTitle: r.relatedEventTitle,
    status: r.status,
    isPinned: Boolean(r.isPinned),
    pinnedAt: r.pinnedAt,
    scheduledFor: r.scheduledFor,
    publishedAt: r.publishedAt,
    likesCount: Number(r.likesCount) || 0,
    commentsCount: Number(r.commentsCount) || 0,
    sharesCount: Number(r.sharesCount) || 0,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    hasLiked: likedPostIds.has(r.id),
    hasSaved: savedPostIds.has(r.id)
  }));

  return {
    posts,
    pagination: {
      total: Number(total) || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
}

export async function getCommunityPostById(id, { includeDrafts = false, visitorId = null } = {}) {
  if (!id) return null;

  const seedMatch = String(id).match(/post-seed-\d+/i);
  const guidMatch = String(id).match(/POST-\d{4}-[A-Z0-9]+/i);
  const targetId = seedMatch ? seedMatch[0].toLowerCase() : (guidMatch ? guidMatch[0] : id);

  if (!pool) {
    let post = memoryStore.posts.find(p => p.id === targetId || p.id === id);
    if (!post) {
      post = memoryStore.posts.find(p => id.endsWith(p.id) || id.includes(p.id));
    }
    if (!post) return null;
    if (post.status === 'scheduled' && post.scheduledFor) {
      const schedMs = new Date(post.scheduledFor).getTime();
      if (!isNaN(schedMs) && schedMs <= Date.now()) {
        post.status = 'published';
        post.publishedAt = post.publishedAt || post.scheduledFor;
        post.updatedAt = new Date().toISOString();
        savePersistentPosts();
      }
    }
    if (!includeDrafts && post.status !== 'published') return null;
    return {
      ...post,
      hasLiked: visitorId ? memoryStore.likes.has(`${post.id}:${visitorId}`) : false,
      hasSaved: visitorId ? memoryStore.saved.has(`${post.id}:${visitorId}`) : false
    };
  }

  const [rows] = await pool.query(
    'SELECT * FROM community_posts WHERE id = ? OR id = ? OR id LIKE ? LIMIT 1',
    [targetId, id, `%${targetId}%`]
  );
  if (rows.length === 0) return null;

  const r = rows[0];
  const postId = r.id;
  if (!includeDrafts) {
    const isScheduledVisible = r.status === 'scheduled' && r.scheduledFor && new Date(r.scheduledFor) <= new Date();
    if (r.status !== 'published' && !isScheduledVisible) return null;
  }

  let hasLiked = false;
  let hasSaved = false;
  if (visitorId) {
    const [[likeRow]] = await pool.query('SELECT 1 FROM community_likes WHERE postId = ? AND visitorId = ? LIMIT 1', [postId, visitorId]);
    hasLiked = Boolean(likeRow);
    const [[savedRow]] = await pool.query('SELECT 1 FROM community_saved_posts WHERE postId = ? AND visitorId = ? LIMIT 1', [postId, visitorId]);
    hasSaved = Boolean(savedRow);
  }

  return {
    id: r.id,
    title: r.title,
    content: r.content,
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    authorName: r.authorName,
    authorRole: r.authorRole,
    authorAvatar: r.authorAvatar,
    postType: r.postType,
    aspectRatio: r.aspectRatio || 'auto',
    mediaUrls: parseJson(r.mediaUrls, []),
    relatedCourseSlug: r.relatedCourseSlug,
    relatedCourseTitle: r.relatedCourseTitle,
    relatedEventId: r.relatedEventId,
    relatedEventTitle: r.relatedEventTitle,
    status: r.status,
    isPinned: Boolean(r.isPinned),
    pinnedAt: r.pinnedAt,
    scheduledFor: r.scheduledFor,
    publishedAt: r.publishedAt,
    likesCount: Number(r.likesCount) || 0,
    commentsCount: Number(r.commentsCount) || 0,
    sharesCount: Number(r.sharesCount) || 0,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    hasLiked,
    hasSaved
  };
}

export async function saveCommunityPost(postData) {
  if (!postData.title?.trim()) throw new Error('Post title is required.');
  if (!postData.content?.trim()) throw new Error('Post content is required.');

  const nowIso = new Date().toISOString();
  const id = postData.id || `POST-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // Automatically lookup related course title if slug is provided
  let relatedCourseTitle = postData.relatedCourseTitle || null;
  if (postData.relatedCourseSlug && !relatedCourseTitle) {
    const program = programsData[postData.relatedCourseSlug];
    if (program) relatedCourseTitle = program.title;
  }

  // Lookup related event title if eventId is provided
  let relatedEventTitle = postData.relatedEventTitle || null;
  if (postData.relatedEventId && !relatedEventTitle && pool) {
    try {
      const [[eventRow]] = await pool.query('SELECT title FROM events WHERE id = ? OR slug = ? LIMIT 1', [postData.relatedEventId, postData.relatedEventId]);
      if (eventRow) relatedEventTitle = eventRow.title;
    } catch (_) { }
  }

  let defaultAuthorAvatar = '/assets/images/resources/founder-avatar.png';
  let defaultAuthorName = 'Dr. Naveen Ellangala';
  let defaultAuthorRole = 'Founder & Positive Psychologist';
  try {
    const adminProfileFile = path.join(__dirname, '..', 'uploads', 'admin-profile.json');
    if (fs.existsSync(adminProfileFile)) {
      const ap = JSON.parse(fs.readFileSync(adminProfileFile, 'utf-8'));
      if (ap.avatar !== undefined) defaultAuthorAvatar = ap.avatar || '';
      if (ap.name) defaultAuthorName = ap.name;
      if (ap.role) defaultAuthorRole = ap.role;
    }
  } catch (_) { }

  const postRecord = {
    id,
    title: postData.title.trim(),
    content: postData.content.trim(),
    categoryId: postData.categoryId || 'cat-mindgym',
    categoryName: postData.categoryName || 'Positive MindGym',
    authorName: postData.authorName || defaultAuthorName,
    authorRole: postData.authorRole || defaultAuthorRole,
    authorAvatar: postData.authorAvatar !== undefined ? postData.authorAvatar : defaultAuthorAvatar,
    postType: postData.postType || 'text',
    aspectRatio: postData.aspectRatio || 'auto',
    mediaUrls: Array.isArray(postData.mediaUrls) ? postData.mediaUrls : [],
    relatedCourseSlug: postData.relatedCourseSlug || null,
    relatedCourseTitle,
    relatedEventId: postData.relatedEventId || null,
    relatedEventTitle,
    status: postData.status || 'published',
    isPinned: Boolean(postData.isPinned),
    pinnedAt: postData.isPinned ? (postData.pinnedAt || nowIso) : null,
    scheduledFor: postData.scheduledFor || null,
    publishedAt: postData.status === 'published' ? (postData.publishedAt || nowIso) : null,
    likesCount: Number(postData.likesCount) || 0,
    commentsCount: Number(postData.commentsCount) || 0,
    sharesCount: Number(postData.sharesCount) || 0,
    createdAt: postData.createdAt || nowIso,
    updatedAt: nowIso
  };

  if (!pool) {
    const idx = memoryStore.posts.findIndex(p => p.id === id);
    if (idx >= 0) {
      memoryStore.posts[idx] = { ...memoryStore.posts[idx], ...postRecord };
    } else {
      memoryStore.posts.unshift(postRecord);
    }
    savePersistentPosts(memoryStore.posts);
    return postRecord;
  }

  const [existing] = await pool.query('SELECT id, createdAt, likesCount, commentsCount, sharesCount FROM community_posts WHERE id = ? LIMIT 1', [id]);
  if (existing.length > 0) {
    await pool.query(
      `UPDATE community_posts SET
        title = ?, content = ?, categoryId = ?, categoryName = ?,
        authorName = ?, authorRole = ?, authorAvatar = ?, postType = ?, aspectRatio = ?,
        mediaUrls = ?, relatedCourseSlug = ?, relatedCourseTitle = ?,
        relatedEventId = ?, relatedEventTitle = ?, status = ?, isPinned = ?,
        pinnedAt = ?, scheduledFor = ?, publishedAt = ?, updatedAt = ?
      WHERE id = ?`,
      [
        postRecord.title, postRecord.content, postRecord.categoryId, postRecord.categoryName,
        postRecord.authorName, postRecord.authorRole, postRecord.authorAvatar, postRecord.postType, postRecord.aspectRatio,
        JSON.stringify(postRecord.mediaUrls), postRecord.relatedCourseSlug, postRecord.relatedCourseTitle,
        postRecord.relatedEventId, postRecord.relatedEventTitle, postRecord.status, postRecord.isPinned,
        toDbDatetime(postRecord.pinnedAt), toDbDatetime(postRecord.scheduledFor), toDbDatetime(postRecord.publishedAt),
        toDbDatetime(postRecord.updatedAt), id
      ]
    );
  } else {
    await pool.query(
      `INSERT INTO community_posts (
        id, title, content, categoryId, categoryName, authorName, authorRole, authorAvatar,
        postType, aspectRatio, mediaUrls, relatedCourseSlug, relatedCourseTitle, relatedEventId, relatedEventTitle,
        status, isPinned, pinnedAt, scheduledFor, publishedAt, likesCount, commentsCount, sharesCount,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postRecord.id, postRecord.title, postRecord.content, postRecord.categoryId, postRecord.categoryName,
        postRecord.authorName, postRecord.authorRole, postRecord.authorAvatar, postRecord.postType, postRecord.aspectRatio,
        JSON.stringify(postRecord.mediaUrls), postRecord.relatedCourseSlug, postRecord.relatedCourseTitle,
        postRecord.relatedEventId, postRecord.relatedEventTitle, postRecord.status, postRecord.isPinned,
        toDbDatetime(postRecord.pinnedAt), toDbDatetime(postRecord.scheduledFor), toDbDatetime(postRecord.publishedAt),
        postRecord.likesCount, postRecord.commentsCount, postRecord.sharesCount,
        toDbDatetime(postRecord.createdAt), toDbDatetime(postRecord.updatedAt)
      ]
    );
  }

  return postRecord;
}

export async function syncAdminProfileToPosts({ name, role, avatar } = {}) {
  if (memoryStore.posts && Array.isArray(memoryStore.posts)) {
    for (const post of memoryStore.posts) {
      if (avatar !== undefined) {
        post.authorAvatar = avatar || '';
      }
      if (name) {
        post.authorName = name;
      }
      if (role) {
        post.authorRole = role;
      }
    }
    savePersistentPosts(memoryStore.posts);
  }

  if (pool) {
    try {
      const updates = [];
      const params = [];

      if (avatar !== undefined) {
        updates.push('authorAvatar = ?');
        params.push(avatar || '');
      }
      if (name) {
        updates.push('authorName = ?');
        params.push(name);
      }
      if (role) {
        updates.push('authorRole = ?');
        params.push(role);
      }

      if (updates.length > 0) {
        await pool.query(`UPDATE community_posts SET ${updates.join(', ')}`, params);
      }
    } catch (err) {
      console.error('Error syncing admin profile to community posts in SQL:', err.message);
    }
  }

  return true;
}

export async function deleteCommunityPost(id) {
  if (!id) return false;
  if (!pool) {
    const targetPost = memoryStore.posts.find(p => p.id === id);
    if (targetPost) archiveDeletedPost(targetPost);
    const initialLen = memoryStore.posts.length;
    memoryStore.posts = memoryStore.posts.filter(p => p.id !== id);
    const removed = memoryStore.posts.length < initialLen;
    if (removed) savePersistentPosts(memoryStore.posts, true);
    return removed;
  }
  const [[pRow]] = await pool.query('SELECT * FROM community_posts WHERE id = ? LIMIT 1', [id]);
  if (pRow) archiveDeletedPost(pRow);
  const [result] = await pool.query('DELETE FROM community_posts WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function togglePinCommunityPost(id, isPinned) {
  const post = await getCommunityPostById(id, { includeDrafts: true });
  if (!post) throw new Error('Post not found.');
  return saveCommunityPost({
    ...post,
    isPinned: Boolean(isPinned),
    pinnedAt: isPinned ? new Date().toISOString() : null
  });
}

// ============================================================================
// LIKES
// ============================================================================
export async function toggleCommunityLike(postId, visitorId) {
  if (!postId || !visitorId) throw new Error('postId and visitorId are required.');

  if (!pool) {
    const key = `${postId}:${visitorId}`;
    const post = memoryStore.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found.');

    if (memoryStore.likes.has(key)) {
      memoryStore.likes.delete(key);
      post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
      return { liked: false, likesCount: post.likesCount };
    } else {
      memoryStore.likes.set(key, new Date().toISOString());
      post.likesCount = (post.likesCount || 0) + 1;
      return { liked: true, likesCount: post.likesCount };
    }
  }

  // Atomically check and toggle
  const [[existing]] = await pool.query('SELECT id FROM community_likes WHERE postId = ? AND visitorId = ? LIMIT 1', [postId, visitorId]);
  if (existing) {
    await pool.query('DELETE FROM community_likes WHERE postId = ? AND visitorId = ?', [postId, visitorId]);
    await pool.query('UPDATE community_posts SET likesCount = GREATEST(0, likesCount - 1) WHERE id = ?', [postId]);
    const [[post]] = await pool.query('SELECT likesCount FROM community_posts WHERE id = ?', [postId]);
    return { liked: false, likesCount: Number(post?.likesCount) || 0 };
  } else {
    const likeId = `LIKE-${crypto.randomBytes(6).toString('hex')}`;
    await pool.query(
      'INSERT INTO community_likes (id, postId, visitorId, createdAt) VALUES (?, ?, ?, ?)',
      [likeId, postId, visitorId, toDbDatetime(new Date().toISOString())]
    );
    await pool.query('UPDATE community_posts SET likesCount = likesCount + 1 WHERE id = ?', [postId]);
    const [[post]] = await pool.query('SELECT likesCount FROM community_posts WHERE id = ?', [postId]);
    return { liked: true, likesCount: Number(post?.likesCount) || 0 };
  }
}

// ============================================================================
// SAVED / BOOKMARKS
// ============================================================================
export async function toggleCommunitySave(postId, visitorId) {
  if (!postId || !visitorId) throw new Error('postId and visitorId are required.');

  if (!pool) {
    const key = `${postId}:${visitorId}`;
    if (memoryStore.saved.has(key)) {
      memoryStore.saved.delete(key);
      return { saved: false };
    } else {
      memoryStore.saved.set(key, new Date().toISOString());
      return { saved: true };
    }
  }

  const [[existing]] = await pool.query('SELECT id FROM community_saved_posts WHERE postId = ? AND visitorId = ? LIMIT 1', [postId, visitorId]);
  if (existing) {
    await pool.query('DELETE FROM community_saved_posts WHERE postId = ? AND visitorId = ?', [postId, visitorId]);
    return { saved: false };
  } else {
    const saveId = `SAVE-${crypto.randomBytes(6).toString('hex')}`;
    await pool.query(
      'INSERT INTO community_saved_posts (id, postId, visitorId, createdAt) VALUES (?, ?, ?, ?)',
      [saveId, postId, visitorId, toDbDatetime(new Date().toISOString())]
    );
    return { saved: true };
  }
}

// ============================================================================
// COMMENTS & MODERATION
// ============================================================================
export async function getCommunityComments(postId, { page = 1, limit = 20, includeHidden = false } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  if (!pool) {
    let comments = memoryStore.comments.filter(c => c.postId === postId);
    if (!includeHidden) {
      comments = comments.filter(c => c.status === 'approved');
    }
    comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return {
      comments: comments.slice(offset, offset + limitNum),
      total: comments.length
    };
  }

  const statusClause = includeHidden ? '' : 'AND status = "approved"';
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM community_comments WHERE postId = ? ${statusClause}`, [postId]);

  const [rows] = await pool.query(
    `SELECT * FROM community_comments
     WHERE postId = ? ${statusClause}
     ORDER BY createdAt ASC
     LIMIT ? OFFSET ?`,
    [postId, limitNum, offset]
  );

  return {
    comments: rows.map(r => ({
      id: r.id,
      postId: r.postId,
      authorName: r.authorName,
      authorEmail: r.authorEmail,
      authorAvatar: r.authorAvatar,
      content: r.content,
      status: r.status,
      visitorId: r.visitorId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    })),
    total: Number(total) || 0
  };
}

export async function createCommunityComment({ postId, authorName, authorEmail = '', content, visitorId = null }) {
  if (!postId) throw new Error('postId is required.');
  if (!authorName?.trim()) throw new Error('Please enter your name.');
  if (!content?.trim()) throw new Error('Comment content cannot be empty.');

  const commentId = `CMT-${crypto.randomBytes(6).toString('hex')}`;
  const nowIso = new Date().toISOString();

  // Basic initials avatar
  const initials = authorName.trim().slice(0, 2).toUpperCase();
  const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=CA8A38&color=fff&size=100`;

  const record = {
    id: commentId,
    postId,
    authorName: authorName.trim(),
    authorEmail: (authorEmail || '').trim(),
    authorAvatar,
    content: content.trim(),
    status: 'approved', // auto-approved with immediate visibility, editable/deletable by admin
    visitorId,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  if (!pool) {
    memoryStore.comments.push(record);
    const post = memoryStore.posts.find(p => p.id === postId);
    if (post) post.commentsCount = (post.commentsCount || 0) + 1;
    return record;
  }

  await pool.query(
    `INSERT INTO community_comments (
      id, postId, authorName, authorEmail, authorAvatar, content, status, visitorId, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.id, record.postId, record.authorName, record.authorEmail, record.authorAvatar,
      record.content, record.status, record.visitorId, toDbDatetime(record.createdAt), toDbDatetime(record.updatedAt)
    ]
  );

  await pool.query('UPDATE community_posts SET commentsCount = commentsCount + 1 WHERE id = ?', [postId]);

  return record;
}

export async function getAdminCommunityComments({ postId = null, status = 'all', page = 1, limit = 50 } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const offset = (pageNum - 1) * limitNum;

  if (!pool) {
    let comments = [...memoryStore.comments];
    if (postId) comments = comments.filter(c => c.postId === postId);
    if (status !== 'all') comments = comments.filter(c => c.status === status);
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
      comments: comments.slice(offset, offset + limitNum),
      total: comments.length
    };
  }

  const conditions = [];
  const params = [];
  if (postId) {
    conditions.push('c.postId = ?');
    params.push(postId);
  }
  if (status !== 'all') {
    conditions.push('c.status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM community_comments c ${whereClause}`, params);
  const [rows] = await pool.query(
    `SELECT c.*, p.title AS postTitle
     FROM community_comments c
     LEFT JOIN community_posts p ON c.postId = p.id
     ${whereClause}
     ORDER BY c.createdAt DESC
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return {
    comments: rows,
    total: Number(total) || 0
  };
}

export async function updateCommunityCommentStatus(commentId, status) {
  const valid = ['approved', 'hidden', 'flagged'];
  if (!valid.includes(status)) throw new Error(`Invalid status: ${status}`);

  if (!pool) {
    const c = memoryStore.comments.find(cm => cm.id === commentId);
    if (!c) throw new Error('Comment not found.');
    c.status = status;
    return c;
  }

  await pool.query('UPDATE community_comments SET status = ?, updatedAt = ? WHERE id = ?', [
    status,
    toDbDatetime(new Date().toISOString()),
    commentId
  ]);
  const [[updated]] = await pool.query('SELECT * FROM community_comments WHERE id = ?', [commentId]);
  return updated;
}

export async function deleteCommunityComment(commentId) {
  if (!commentId) return false;

  if (!pool) {
    const idx = memoryStore.comments.findIndex(c => c.id === commentId);
    if (idx < 0) return false;
    const [deleted] = memoryStore.comments.splice(idx, 1);
    const post = memoryStore.posts.find(p => p.id === deleted.postId);
    if (post) post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1);
    return true;
  }

  const [[c]] = await pool.query('SELECT postId FROM community_comments WHERE id = ? LIMIT 1', [commentId]);
  if (!c) return false;

  await pool.query('DELETE FROM community_comments WHERE id = ?', [commentId]);
  await pool.query('UPDATE community_posts SET commentsCount = GREATEST(0, commentsCount - 1) WHERE id = ?', [c.postId]);
  return true;
}

// ============================================================================
// SIDEBAR WIDGETS DATA: Active workshops & Course Recommendations
// ============================================================================
const QUOTE_CARD_FILE = path.join(__dirname, 'community-quote-card.json');

const DEFAULT_QUOTE_CARD = {
  quote: "A calmer mind creates a brighter life.",
  author: "DR. NAVEEN ELLANGALA",
  imageUrl: "/assets/images/community/mountain-quote-bg.jpg"
};

export function getCommunityQuoteCard() {
  try {
    if (fs.existsSync(QUOTE_CARD_FILE)) {
      const data = JSON.parse(fs.readFileSync(QUOTE_CARD_FILE, 'utf-8'));
      if (data && typeof data === 'object') {
        return {
          quote: data.quote || DEFAULT_QUOTE_CARD.quote,
          author: data.author || DEFAULT_QUOTE_CARD.author,
          imageUrl: data.imageUrl || DEFAULT_QUOTE_CARD.imageUrl,
          updatedAt: data.updatedAt || new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.error('Error reading community quote card:', err);
  }
  return { ...DEFAULT_QUOTE_CARD, updatedAt: new Date().toISOString() };
}

export function updateCommunityQuoteCard({ quote, author, imageUrl }) {
  const current = getCommunityQuoteCard();
  const updated = {
    quote: quote !== undefined && String(quote).trim() ? String(quote).trim() : current.quote,
    author: author !== undefined && String(author).trim() ? String(author).trim() : current.author,
    imageUrl: imageUrl !== undefined && String(imageUrl).trim() ? String(imageUrl).trim() : current.imageUrl,
    updatedAt: new Date().toISOString()
  };
  try {
    fs.writeFileSync(QUOTE_CARD_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving community quote card:', err);
  }
  return updated;
}

const HERO_BANNER_FILE = path.join(__dirname, 'community-hero-banner.json');

const DEFAULT_HERO_BANNER = {
  heading: "Welcome to the\nEllangala Feed",
  subheading: "Learn, reflect, and grow with Dr. Naveen Ellangala.",
  imageUrl: "/assets/images/community/founder-feed-hero.png",
  gradientColor: "#FFFDF8",
  textColorMode: "auto"
};

export function getCommunityHeroBanner() {
  try {
    if (fs.existsSync(HERO_BANNER_FILE)) {
      const data = JSON.parse(fs.readFileSync(HERO_BANNER_FILE, 'utf-8'));
      if (data && typeof data === 'object') {
        let resolvedImageUrl = data.imageUrl || DEFAULT_HERO_BANNER.imageUrl;
        // Verify uploaded image exists on disk; if missing (e.g. deployed server), fall back to safe bundled asset
        if (resolvedImageUrl.startsWith('/uploads/')) {
          const diskFilename = resolvedImageUrl.replace('/uploads/', '');
          const diskPath = path.join(uploadsDir, diskFilename);
          if (!fs.existsSync(diskPath)) {
            resolvedImageUrl = DEFAULT_HERO_BANNER.imageUrl;
          }
        }

        return {
          heading: data.heading || DEFAULT_HERO_BANNER.heading,
          subheading: data.subheading || DEFAULT_HERO_BANNER.subheading,
          imageUrl: resolvedImageUrl,
          gradientColor: data.gradientColor || DEFAULT_HERO_BANNER.gradientColor,
          textColorMode: data.textColorMode || DEFAULT_HERO_BANNER.textColorMode,
          updatedAt: data.updatedAt || new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.error('Error reading community hero banner:', err);
  }
  return { ...DEFAULT_HERO_BANNER, updatedAt: new Date().toISOString() };
}

export function updateCommunityHeroBanner(payload = {}) {
  const current = getCommunityHeroBanner();
  const updated = {
    heading: payload.heading !== undefined && String(payload.heading).trim() ? String(payload.heading).trim() : current.heading,
    subheading: payload.subheading !== undefined && String(payload.subheading).trim() ? String(payload.subheading).trim() : current.subheading,
    imageUrl: payload.imageUrl !== undefined && String(payload.imageUrl).trim() ? String(payload.imageUrl).trim() : current.imageUrl,
    gradientColor: payload.gradientColor !== undefined && String(payload.gradientColor).trim() ? String(payload.gradientColor).trim() : current.gradientColor,
    textColorMode: payload.textColorMode !== undefined && String(payload.textColorMode).trim() ? String(payload.textColorMode).trim() : current.textColorMode,
    updatedAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(HERO_BANNER_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving community hero banner:', err);
  }
  return updated;
}

export async function getCommunitySidebarData(channelId = 'all') {
  let events = [];
  try {
    events = await getDbEvents();
  } catch (_) { }

  // Filter upcoming published events (date >= today, end time not passed) — never display completed/cancelled/draft
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const now = new Date();
  const isUpcoming = (e) => {
    if (!e || e.status === 'completed' || e.status === 'cancelled' || e.status === 'draft') return false;
    if (e.status && e.status !== 'published') return false;
    if (!e.date || e.date < today) return false;
    if (e.date === today && e.endTime) {
      const match = e.endTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3] ? match[3].toUpperCase() : null;
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const [y, mon, d] = e.date.split('-').map(Number);
        const endDt = new Date(y, mon - 1, d, h, m, 59);
        if (endDt.getTime() <= now.getTime()) return false;
      }
    }
    return true;
  };

  const upcomingEvents = (events || [])
    .filter(isUpcoming)
    .sort((a, b) => {
      const timeA = a.startTime ? `${a.date}T${a.startTime}` : a.date;
      const timeB = b.startTime ? `${b.date}T${b.startTime}` : b.date;
      return timeA.localeCompare(timeB);
    })
    .slice(0, 3)
    .map(e => {
      let dObj = null;
      try { dObj = e.date ? new Date(e.date) : null; } catch (_) { }
      const monthDisplay = e.monthDisplay || (dObj && !isNaN(dObj) ? dObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : '');
      const dayDisplay = e.dayDisplay || (dObj && !isNaN(dObj) ? String(dObj.getDate()).padStart(2, '0') : '');
      const dayOfWeek = e.dayOfWeek || (dObj && !isNaN(dObj) ? dObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase() : '');

      return {
        id: e.id,
        slug: e.slug || e.id,
        title: e.title,
        date: e.date,
        endDate: e.endDate,
        dayDisplay,
        monthDisplay,
        dayOfWeek,
        startTime: e.startTime || '18:30',
        endTime: e.endTime || '',
        timeDisplay: e.timeDisplay || (e.startTime ? `${e.startTime}${e.endTime ? ` – ${e.endTime}` : ''}` : '6:30 PM – 7:30 PM (IST)'),
        mode: e.mode || 'Online (Zoom)',
        venue: e.venue || 'Online (Zoom)',
        image: e.image || '/assets/images/services/Positive Workshop.png',
        registrationOpen: e.registrationOpen !== false,
        featured: Boolean(e.featured),
        description: e.shortDescription || e.description || '',
        subtitle: e.subtitle || e.series || e.category || 'Featured Event',
        category: e.category || 'Event'
      };
    });

  const featuredEvent = upcomingEvents[0] || null;

  const featuredCourse = {
    slug: 'positive-psychology-meaningful-life',
    title: 'Bhagavad Gita for Modern Life',
    subtitle: 'Timeless wisdom for a calmer, clearer and more purposeful life.',
    badge: 'FEATURED',
    description: 'Timeless wisdom for a calmer, clearer and more purposeful life.',
    image: '/assets/images/community/featured-bhagavad-gita.png',
    lessons: '12 Lessons',
    rating: '4.9 (1.2k students)',
    targetUrl: '/programs/positive-psychology-meaningful-life',
    buttonText: 'Continue Learning →'
  };

  let recommendedCourses = [
    {
      slug: 'the-art-of-mind-training',
      title: 'The Art of Mind Training',
      subtitle: 'Mastering mental discipline, focus & emotional resilience.',
      category: 'MIND TRAINING',
      lessons: '8 Modules',
      rating: '4.9',
      image: '/assets/images/programs/the-art-of-mind-training.png',
      link: '/programs/the-art-of-mind-training'
    },
    {
      slug: 'positive-psychology-meaningful-life',
      title: 'Positive Psychology for a Meaningful Life',
      subtitle: 'Flourishing, strengths & purpose for everyday living.',
      category: 'POSITIVE WORKSHOP',
      lessons: '10 Modules',
      rating: '4.9',
      image: '/assets/images/programs/positive-psychology-meaningful-life.png',
      link: '/programs/positive-psychology-meaningful-life'
    }
  ];

  if (channelId === 'spiritual-wisdom') {
    recommendedCourses = [
      {
        slug: 'spiritual-psychology-purposeful-life',
        title: 'Spiritual Psychology for Daily Life',
        subtitle: 'Ancient insight meets modern psychology.',
        category: 'WISDOM',
        lessons: '12 Modules',
        rating: '4.9',
        image: '/assets/images/programs/spiritual-psychology-purposeful-life.png',
        link: '/programs/spiritual-psychology-purposeful-life'
      },
      ...recommendedCourses
    ];
  }

  const quoteCard = getCommunityQuoteCard();
  const dailyQuote = {
    quote: quoteCard.quote,
    author: quoteCard.author
  };

  return {
    featuredEvent,
    featuredCourse,
    upcomingEvents,
    recommendedCourses,
    dailyQuote,
    quoteCard
  };
}

export function updateCommunityMockEvent(id, updates) {
  if (!memoryStore.events) return null;
  const evt = memoryStore.events.find(e => e.id === id || e.slug === id);
  if (evt) {
    Object.assign(evt, updates);
    return evt;
  }
  return null;
}

// ============================================================================
// COMMUNITY USER AUTHENTICATION & PROFILES (30-Day Persistent Sessions)
// ============================================================================

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const DEFAULT_USER_COURSES = [
  {
    id: 'course-bg-01',
    slug: 'positive-psychology-meaningful-life',
    title: 'Bhagavad Gita for Modern Life',
    subtitle: 'Timeless wisdom for a calmer, clearer and more purposeful life.',
    progress: 58,
    totalLessons: 12,
    completedLessons: 7,
    currentLesson: 'Lesson 8: The Equanimity of the Mind (Samatvam Yoga)',
    thumbnail: '/assets/images/community/featured-bhagavad-gita.png',
    targetUrl: '/programs/positive-psychology-meaningful-life',
    lastAccessed: new Date().toISOString()
  },
  {
    id: 'course-mind-02',
    slug: 'the-art-of-mind-training',
    title: 'The Art of Mind Training',
    subtitle: 'Evidence-based tools for mental resilience and emotional balance.',
    progress: 25,
    totalLessons: 8,
    completedLessons: 2,
    currentLesson: 'Lesson 3: Somatic Anchoring & Breath Regulation',
    thumbnail: '/assets/images/programs/the-art-of-mind-training.png',
    targetUrl: '/programs/the-art-of-mind-training',
    lastAccessed: new Date().toISOString()
  }
];

const DEFAULT_USER_WORKSHOPS = [
  {
    id: 'EVT-2026-0001',
    slug: 'yoganidra-for-deep-healing',
    title: 'Yoganidra for Deep Healing',
    category: 'Healing Workshop',
    date: '2026-10-21',
    dayDisplay: '21',
    monthDisplay: 'OCT',
    dayOfWeek: 'TUE',
    timeDisplay: '6:30 PM – 7:30 PM (IST)',
    mode: 'Online (Zoom)',
    venue: 'Online (Zoom)',
    zoomLink: 'https://zoom.us/j/ellangala-workshop-live',
    status: 'Confirmed',
    enrolledAt: new Date().toISOString()
  }
];

function hashCommunityPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(String(password), salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyCommunityPassword(password, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(String(password), salt, 1000, 64, 'sha512').toString('hex');
  return hash === verify;
}

function normalizePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/[^\d]/g, '').trim();
}

function phonesMatch(phone1, phone2) {
  const d1 = normalizePhone(phone1);
  const d2 = normalizePhone(phone2);
  if (!d1 || !d2) return false;
  if (d1 === d2) return true;
  if (d1.endsWith(d2) || d2.endsWith(d1)) {
    const minLen = Math.min(d1.length, d2.length);
    if (minLen >= 8) return true;
  }
  return false;
}

function sanitizeCommunityUser(u) {
  if (!u) return null;
  const isNew = u.createdAt ? (Date.now() - new Date(u.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000) : false;
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email || '',
    avatarUrl: u.avatarUrl || null,
    status: (u.status || 'active').toLowerCase(),
    isNew,
    topics: Array.isArray(u.topics) ? u.topics : parseJson(u.topics, []),
    token: u.token,
    tokenExpiresAt: u.tokenExpiresAt,
    enrolledCourses: Array.isArray(u.enrolledCourses) ? u.enrolledCourses : parseJson(u.enrolledCourses, DEFAULT_USER_COURSES),
    enrolledEvents: Array.isArray(u.enrolledEvents) ? u.enrolledEvents : parseJson(u.enrolledEvents, DEFAULT_USER_WORKSHOPS),
    createdAt: u.createdAt,
    updatedAt: u.updatedAt
  };
}

export async function createCommunityUser({ name, phone, email, password, avatarUrl, topics = [] }) {
  if (!name?.trim()) throw new Error('Full name is required.');
  const cleanPhone = normalizePhone(phone);
  if (!cleanPhone || cleanPhone.length < 7) throw new Error('Valid mobile number is required.');
  if (!password || String(password).length < 4) throw new Error('Password must be at least 4 characters.');

  const userId = `USR-${crypto.randomBytes(8).toString('hex')}`;
  const nowIso = new Date().toISOString();
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiresAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();
  const passwordHash = hashCommunityPassword(password);
  const userTopics = Array.isArray(topics) ? topics : [];

  if (!pool) {
    // Check uniqueness in memoryStore
    for (const u of memoryStore.users.values()) {
      if (normalizePhone(u.phone) === cleanPhone) {
        throw new Error('A community account with this mobile number already exists. Please sign in.');
      }
    }

    const newUser = {
      id: userId,
      name: name.trim(),
      phone: cleanPhone,
      email: email?.trim() || '',
      passwordHash,
      avatarUrl: avatarUrl?.trim() || null,
      status: 'active',
      topics: userTopics,
      token,
      tokenExpiresAt,
      enrolledCourses: [...DEFAULT_USER_COURSES],
      enrolledEvents: [...DEFAULT_USER_WORKSHOPS],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    memoryStore.users.set(userId, newUser);
    savePersistentUsers(memoryStore.users);
    return sanitizeCommunityUser(newUser);
  }

  // MySQL persistence
  const [existing] = await pool.query('SELECT id FROM community_users WHERE phone = ? LIMIT 1', [cleanPhone]);
  if (existing.length > 0) {
    throw new Error('A community account with this mobile number already exists. Please sign in.');
  }

  await pool.query(
    `INSERT INTO community_users (
      id, name, phone, email, passwordHash, avatarUrl, topics, token, tokenExpiresAt,
      enrolledEvents, enrolledCourses, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      name.trim(),
      cleanPhone,
      email?.trim() || '',
      passwordHash,
      avatarUrl?.trim() || null,
      JSON.stringify(userTopics),
      token,
      toDbDatetime(tokenExpiresAt),
      JSON.stringify(DEFAULT_USER_WORKSHOPS),
      JSON.stringify(DEFAULT_USER_COURSES),
      toDbDatetime(nowIso),
      toDbDatetime(nowIso)
    ]
  );

  return sanitizeCommunityUser({
    id: userId,
    name: name.trim(),
    phone: cleanPhone,
    email: email?.trim() || '',
    avatarUrl: avatarUrl?.trim() || null,
    topics: userTopics,
    token,
    tokenExpiresAt,
    enrolledCourses: DEFAULT_USER_COURSES,
    enrolledEvents: DEFAULT_USER_WORKSHOPS,
    createdAt: nowIso,
    updatedAt: nowIso
  });
}

export async function authenticateCommunityUser({ identifier, password }) {
  if (!identifier?.trim()) throw new Error('Mobile number or name is required.');
  if (!password) throw new Error('Password is required.');

  const trimmed = identifier.trim();
  const cleanPhone = normalizePhone(trimmed);
  const now = new Date();
  const newToken = crypto.randomBytes(32).toString('hex');
  const newTokenExpiresAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

  if (!pool) {
    let found = null;
    for (const u of memoryStore.users.values()) {
      if (phonesMatch(u.phone, trimmed)) {
        found = u;
        break;
      }
      if (u.name.toLowerCase() === trimmed.toLowerCase()) {
        found = u;
        break;
      }
    }

    if (!found || !verifyCommunityPassword(password, found.passwordHash)) {
      throw new Error('Invalid mobile number/name or password. Please verify your credentials.');
    }

    // Refresh 30-day session token
    found.token = newToken;
    found.tokenExpiresAt = newTokenExpiresAt;
    found.updatedAt = new Date().toISOString();
    return sanitizeCommunityUser(found);
  }

  // MySQL search by phone or name
  const phoneSuffix = cleanPhone.slice(-10);
  const [rows] = await pool.query(
    'SELECT * FROM community_users WHERE phone = ? OR phone LIKE ? OR LOWER(name) = LOWER(?) LIMIT 1',
    [cleanPhone, `%${phoneSuffix}`, trimmed]
  );

  if (rows.length === 0) {
    throw new Error('Invalid mobile number/name or password. Please verify your credentials.');
  }

  const userRow = rows[0];
  if (!verifyCommunityPassword(password, userRow.passwordHash)) {
    throw new Error('Invalid mobile number/name or password. Please verify your credentials.');
  }

  // Refresh token in DB
  await pool.query(
    'UPDATE community_users SET token = ?, tokenExpiresAt = ?, updatedAt = ? WHERE id = ?',
    [newToken, toDbDatetime(newTokenExpiresAt), toDbDatetime(new Date().toISOString()), userRow.id]
  );

  userRow.token = newToken;
  userRow.tokenExpiresAt = newTokenExpiresAt;
  return sanitizeCommunityUser(userRow);
}

export async function getCommunityUserByToken(token) {
  if (!token?.trim()) return null;
  const cleanToken = token.trim();
  const now = new Date();

  if (!pool) {
    for (const u of memoryStore.users.values()) {
      if (u.token === cleanToken) {
        const exp = new Date(u.tokenExpiresAt);
        if (exp > now) {
          return sanitizeCommunityUser(u);
        } else {
          // Expired after 30 days
          u.token = null;
          return null;
        }
      }
    }
    return null;
  }

  const [rows] = await pool.query('SELECT * FROM community_users WHERE token = ? LIMIT 1', [cleanToken]);
  if (rows.length === 0) return null;

  const user = rows[0];
  const exp = new Date(user.tokenExpiresAt);
  if (exp <= now) {
    // Expired
    await pool.query('UPDATE community_users SET token = NULL WHERE id = ?', [user.id]);
    return null;
  }

  return sanitizeCommunityUser(user);
}

export async function updateCommunityUserProfile(token, { name, avatarUrl, topics, email }) {
  const user = await getCommunityUserByToken(token);
  if (!user) throw new Error('Authentication required.');

  const nowIso = new Date().toISOString();

  if (!pool) {
    const raw = memoryStore.users.get(user.id);
    if (!raw) throw new Error('User not found.');
    if (name?.trim()) raw.name = name.trim();
    if (avatarUrl !== undefined) raw.avatarUrl = avatarUrl;
    if (topics !== undefined) raw.topics = Array.isArray(topics) ? topics : [];
    if (email !== undefined) raw.email = email.trim();
    raw.updatedAt = nowIso;
    return sanitizeCommunityUser(raw);
  }

  const updates = [];
  const params = [];

  if (name?.trim()) {
    updates.push('name = ?');
    params.push(name.trim());
  }
  if (avatarUrl !== undefined) {
    updates.push('avatarUrl = ?');
    params.push(avatarUrl);
  }
  if (topics !== undefined) {
    updates.push('topics = ?');
    params.push(JSON.stringify(Array.isArray(topics) ? topics : []));
  }
  if (email !== undefined) {
    updates.push('email = ?');
    params.push(email.trim());
  }

  if (updates.length > 0) {
    updates.push('updatedAt = ?');
    params.push(toDbDatetime(nowIso));
    params.push(user.id);

    await pool.query(`UPDATE community_users SET ${updates.join(', ')} WHERE id = ?`, params);
  }

  return getCommunityUserByToken(token);
}

export async function logoutCommunityUser(token) {
  if (!token) return true;
  if (!pool) {
    for (const u of memoryStore.users.values()) {
      if (u.token === token) {
        u.token = null;
        return true;
      }
    }
    return true;
  }
  await pool.query('UPDATE community_users SET token = NULL WHERE id = ?', [token]);
  return true;
}

export async function getCommunityUserLearning(userOrToken) {
  let user = null;
  if (typeof userOrToken === 'string') {
    user = await getCommunityUserByToken(userOrToken);
  } else {
    user = userOrToken;
  }

  if (!user) {
    return {
      enrolledCourses: DEFAULT_USER_COURSES,
      stats: { totalCourses: 2, completedLessons: 9, hoursInvested: 14.5 }
    };
  }

  const courses = user.enrolledCourses || DEFAULT_USER_COURSES;
  const totalCompleted = courses.reduce((acc, c) => acc + (c.completedLessons || 0), 0);

  return {
    enrolledCourses: courses,
    stats: {
      totalCourses: courses.length,
      completedLessons: totalCompleted,
      hoursInvested: Math.round(totalCompleted * 1.5 * 10) / 10
    }
  };
}

export async function getCommunityUserWorkshops(userOrToken) {
  let user = null;
  if (typeof userOrToken === 'string') {
    user = await getCommunityUserByToken(userOrToken);
  } else {
    user = userOrToken;
  }

  if (!user) {
    return {
      enrolledEvents: DEFAULT_USER_WORKSHOPS
    };
  }

  return {
    enrolledEvents: user.enrolledEvents || DEFAULT_USER_WORKSHOPS
  };
}

export async function getCommunityUsers({ status, search, sort = 'newest', fromDate, toDate } = {}) {
  let list = [];
  if (!pool) {
    memoryStore.users = loadPersistentUsers();
    list = Array.from(memoryStore.users.values()).map(sanitizeCommunityUser).filter(Boolean);
  } else {
    const [rows] = await pool.query('SELECT * FROM community_users ORDER BY createdAt DESC');
    list = rows.map(sanitizeCommunityUser).filter(Boolean);
  }

  // Pre-calculate full metrics across the entire user base before filters
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const stats = {
    total: list.length,
    active: list.filter(u => (u.status || 'active').toLowerCase() === 'active').length,
    inactive: list.filter(u => (u.status || 'active').toLowerCase() === 'inactive').length,
    newCount: list.filter(u => u.createdAt && (now - new Date(u.createdAt).getTime()) <= THIRTY_DAYS).length
  };

  // 1. Status Filter: active | inactive | new | all
  if (status && status !== 'all') {
    const s = status.toLowerCase();
    if (s === 'active') {
      list = list.filter(u => (u.status || 'active').toLowerCase() === 'active');
    } else if (s === 'inactive') {
      list = list.filter(u => (u.status || 'active').toLowerCase() === 'inactive');
    } else if (s === 'new') {
      list = list.filter(u => u.createdAt && (now - new Date(u.createdAt).getTime()) <= THIRTY_DAYS);
    }
  }

  // 2. Search Filter (by name, email, phone, topics)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(u => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const topicsStr = Array.isArray(u.topics) ? u.topics.join(' ').toLowerCase() : '';
      return name.includes(q) || email.includes(q) || phone.includes(q) || topicsStr.includes(q);
    });
  }

  // 3. Date Range Filter
  if (fromDate) {
    const fromTime = new Date(fromDate).getTime();
    if (!isNaN(fromTime)) {
      list = list.filter(u => new Date(u.createdAt).getTime() >= fromTime);
    }
  }
  if (toDate) {
    const toTime = new Date(toDate).getTime();
    if (!isNaN(toTime)) {
      // End of that day
      list = list.filter(u => new Date(u.createdAt).getTime() <= (toTime + 24 * 60 * 60 * 1000 - 1));
    }
  }

  // 4. Sort Filter: newest | oldest | name-asc | name-desc
  if (sort === 'oldest') {
    list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  } else if (sort === 'name-asc') {
    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sort === 'name-desc') {
    list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
  } else {
    // Default newest (new to old)
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return { users: list, stats };
}

export async function updateCommunityUserStatus(userId, status) {
  const cleanStatus = (status || 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active';
  const nowIso = new Date().toISOString();

  if (!pool) {
    const raw = memoryStore.users.get(userId);
    if (!raw) throw new Error('User not found.');
    raw.status = cleanStatus;
    raw.updatedAt = nowIso;
    savePersistentUsers(memoryStore.users);
    return sanitizeCommunityUser(raw);
  }

  await pool.query('UPDATE community_users SET status = ?, updatedAt = ? WHERE id = ?', [
    cleanStatus,
    toDbDatetime(nowIso),
    userId
  ]);

  const [rows] = await pool.query('SELECT * FROM community_users WHERE id = ? LIMIT 1', [userId]);
  if (rows.length === 0) throw new Error('User not found.');
  return sanitizeCommunityUser(rows[0]);
}

export async function deleteCommunityUser(userId) {
  if (!pool) {
    const deleted = memoryStore.users.delete(userId);
    if (deleted) savePersistentUsers(memoryStore.users);
    return true;
  }
  await pool.query('DELETE FROM community_users WHERE id = ?', [userId]);
  return true;
}

