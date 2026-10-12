import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';
import { getDbEvents } from './store.js';
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

// In-memory fallback for local DB-free / demo mode
const memoryStore = {
  categories: [],
  posts: [],
  likes: new Map(), // key: postId:visitorId
  saved: new Map(), // key: postId:visitorId
  comments: [],
  users: new Map(), // key: user.id
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
    if (memoryStore.posts.length === 0) {
      memoryStore.posts = [...SEED_POSTS];
    }
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

  console.log('✅ Community Feed schema verified and initialized.');
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
    let posts = [...memoryStore.posts];

    // Filter by visibility / status
    if (!includeDrafts) {
      posts = posts.filter(p => {
        if (p.status === 'published') return true;
        if (p.status === 'scheduled' && p.scheduledFor && p.scheduledFor <= nowIso) return true;
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

  if (!pool) {
    const post = memoryStore.posts.find(p => p.id === id);
    if (!post) return null;
    if (!includeDrafts && post.status !== 'published') return null;
    return {
      ...post,
      hasLiked: visitorId ? memoryStore.likes.has(`${post.id}:${visitorId}`) : false,
      hasSaved: visitorId ? memoryStore.saved.has(`${post.id}:${visitorId}`) : false
    };
  }

  const [rows] = await pool.query('SELECT * FROM community_posts WHERE id = ? LIMIT 1', [id]);
  if (rows.length === 0) return null;

  const r = rows[0];
  if (!includeDrafts) {
    const isScheduledVisible = r.status === 'scheduled' && r.scheduledFor && new Date(r.scheduledFor) <= new Date();
    if (r.status !== 'published' && !isScheduledVisible) return null;
  }

  let hasLiked = false;
  let hasSaved = false;
  if (visitorId) {
    const [[likeRow]] = await pool.query('SELECT 1 FROM community_likes WHERE postId = ? AND visitorId = ? LIMIT 1', [id, visitorId]);
    hasLiked = Boolean(likeRow);
    const [[savedRow]] = await pool.query('SELECT 1 FROM community_saved_posts WHERE postId = ? AND visitorId = ? LIMIT 1', [id, visitorId]);
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
    } catch (_) {}
  }

  const postRecord = {
    id,
    title: postData.title.trim(),
    content: postData.content.trim(),
    categoryId: postData.categoryId || 'cat-mindgym',
    categoryName: postData.categoryName || 'Positive MindGym',
    authorName: postData.authorName || 'Dr. Naveen Ellangala',
    authorRole: postData.authorRole || 'Founder & Positive Psychologist',
    authorAvatar: postData.authorAvatar || '/assets/images/resources/founder-avatar.png',
    postType: postData.postType || 'text',
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
    return postRecord;
  }

  const [existing] = await pool.query('SELECT id, createdAt, likesCount, commentsCount, sharesCount FROM community_posts WHERE id = ? LIMIT 1', [id]);
  if (existing.length > 0) {
    await pool.query(
      `UPDATE community_posts SET
        title = ?, content = ?, categoryId = ?, categoryName = ?,
        authorName = ?, authorRole = ?, authorAvatar = ?, postType = ?,
        mediaUrls = ?, relatedCourseSlug = ?, relatedCourseTitle = ?,
        relatedEventId = ?, relatedEventTitle = ?, status = ?, isPinned = ?,
        pinnedAt = ?, scheduledFor = ?, publishedAt = ?, updatedAt = ?
      WHERE id = ?`,
      [
        postRecord.title, postRecord.content, postRecord.categoryId, postRecord.categoryName,
        postRecord.authorName, postRecord.authorRole, postRecord.authorAvatar, postRecord.postType,
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
        postType, mediaUrls, relatedCourseSlug, relatedCourseTitle, relatedEventId, relatedEventTitle,
        status, isPinned, pinnedAt, scheduledFor, publishedAt, likesCount, commentsCount, sharesCount,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postRecord.id, postRecord.title, postRecord.content, postRecord.categoryId, postRecord.categoryName,
        postRecord.authorName, postRecord.authorRole, postRecord.authorAvatar, postRecord.postType,
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

export async function deleteCommunityPost(id) {
  if (!id) return false;
  if (!pool) {
    const initialLen = memoryStore.posts.length;
    memoryStore.posts = memoryStore.posts.filter(p => p.id !== id);
    return memoryStore.posts.length < initialLen;
  }
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

export async function getAdminCommunityComments({ status = 'all', page = 1, limit = 30 } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 30));
  const offset = (pageNum - 1) * limitNum;

  if (!pool) {
    let comments = [...memoryStore.comments];
    if (status !== 'all') comments = comments.filter(c => c.status === status);
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
      comments: comments.slice(offset, offset + limitNum),
      total: comments.length
    };
  }

  const whereClause = status !== 'all' ? 'WHERE status = ?' : '';
  const params = status !== 'all' ? [status] : [];

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM community_comments ${whereClause}`, params);
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
export async function getCommunitySidebarData(channelId = 'all') {
  let events = [];
  try {
    events = await getDbEvents();
  } catch (_) {}

  // Filter ONLY real upcoming published events (date >= today) — never display demo data
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = (events || [])
    .filter(e => (e.status === 'published' || !e.status) && e.status !== 'completed' && Boolean(e.date) && e.date >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)
    .map(e => ({
      id: e.id,
      slug: e.slug || e.id,
      title: e.title,
      date: e.date,
      dayDisplay: e.dayDisplay || (e.date ? e.date.split('-')[2] : ''),
      monthDisplay: e.monthDisplay || (e.date ? new Date(e.date).toLocaleString('en-US', { month: 'short' }).toUpperCase() : ''),
      dayOfWeek: e.dayOfWeek || (e.date ? new Date(e.date).toLocaleString('en-US', { weekday: 'short' }).toUpperCase() : ''),
      startTime: e.startTime || '18:30',
      timeDisplay: e.timeDisplay || '6:30 PM – 7:30 PM (IST)',
      mode: e.mode || 'Online (Zoom)',
      venue: e.venue || 'Online (Zoom)',
      image: e.image || '/assets/images/services/Positive Workshop.png',
      registrationOpen: e.registrationOpen !== false
    }));

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
      title: 'The Science of Mindfulness',
      subtitle: 'A practical course for modern life.',
      category: 'MINDFULNESS',
      lessons: '8 Lessons',
      rating: '4.8',
      image: '/assets/images/community/science-of-mindfulness-thumb.jpg'
    },
    {
      slug: 'positive-psychology-meaningful-life',
      title: 'Personal Growth Blueprint',
      subtitle: 'Tools for a more intentional life.',
      category: 'GROWTH',
      lessons: '10 Lessons',
      rating: '4.7',
      image: '/assets/images/community/personal-growth-thumb.jpg'
    }
  ];

  if (channelId === 'spiritual-wisdom') {
    recommendedCourses = [
      {
        slug: 'spiritual-psychology-purposeful-life',
        title: 'Spiritual Psychology for Modern Life',
        subtitle: 'Ancient insight meets modern psychology.',
        category: 'WISDOM',
        lessons: '12 Lessons',
        rating: '4.9',
        image: '/assets/images/community/science-of-mindfulness-thumb.jpg'
      },
      ...recommendedCourses
    ];
  }

  const dailyQuote = {
    quote: 'Real learning transforms not just what you know, but how you live.',
    author: 'DR. NAVEEN ELLANGALA'
  };

  return {
    featuredCourse,
    upcomingEvents,
    recommendedCourses,
    dailyQuote
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
    title: 'The Science of Mindfulness',
    subtitle: 'Evidence-based tools for mental resilience and emotional balance.',
    progress: 25,
    totalLessons: 8,
    completedLessons: 2,
    currentLesson: 'Lesson 3: Somatic Anchoring & Breath Regulation',
    thumbnail: '/assets/images/community/science-of-mindfulness-thumb.jpg',
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
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email || '',
    avatarUrl: u.avatarUrl || null,
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
      topics: userTopics,
      token,
      tokenExpiresAt,
      enrolledCourses: [...DEFAULT_USER_COURSES],
      enrolledEvents: [...DEFAULT_USER_WORKSHOPS],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    memoryStore.users.set(userId, newUser);
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
