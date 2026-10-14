import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'notifications.json');

const INITIAL_SEEDS = [
  {
    id: 'notif-seed-001',
    type: 'user_register',
    title: 'New Member Registered',
    message: 'Ananya Rao registered a new account on Ellangala Academy',
    authorName: 'Ananya Rao',
    authorEmail: 'ananya.rao@example.com',
    authorAvatar: '/assets/images/team/member-avatar.png',
    targetUrl: '/admin/feed',
    metadata: { userId: 'usr-seed-01' },
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago
  },
  {
    id: 'notif-seed-002',
    type: 'comment',
    title: "New Comment on 'A Thought for Today'",
    message: 'Kavitha Menon: "This perspective on mindfulness completely changed my morning routine. Thank you Dr. Naveen!"',
    authorName: 'Kavitha Menon',
    authorEmail: 'kavitha.m@example.com',
    authorAvatar: '',
    targetUrl: '/admin/feed',
    metadata: { postId: 'post-seed-002' },
    isRead: false,
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString() // 42 mins ago
  },
  {
    id: 'notif-seed-003',
    type: 'like',
    title: 'New Post Like',
    message: "Rahul Verma liked post 'Guided Meditation - Inner Stillness (17 mins)'",
    authorName: 'Rahul Verma',
    authorEmail: 'rahul.v@example.com',
    authorAvatar: '',
    targetUrl: '/admin/feed',
    metadata: { postId: 'post-seed-003' },
    isRead: false,
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString() // 1h 15m ago
  },
  {
    id: 'notif-seed-004',
    type: 'enrollment',
    title: 'New Workshop Enrollment',
    message: 'Vikram Shenoy enrolled for Positive MindGym Experiential Circle (1 Seat, ₹999)',
    authorName: 'Vikram Shenoy',
    authorEmail: 'vikram.s@example.com',
    authorAvatar: '',
    targetUrl: '/admin/enrollments',
    metadata: { enrollmentId: 'ENR-9042' },
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() // 2h ago
  },
  {
    id: 'notif-seed-005',
    type: 'order',
    title: 'New Book Order #ORD-7821',
    message: "Sneha Patel placed an order for 'Bhagavad Gita for Modern Life' handbook (Total: ₹499)",
    authorName: 'Sneha Patel',
    authorEmail: 'sneha.patel@example.com',
    authorAvatar: '',
    targetUrl: '/admin/orders',
    metadata: { orderId: 'ORD-7821' },
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString() // 5h ago
  },
  {
    id: 'notif-seed-006',
    type: 'like',
    title: 'New Community Interaction',
    message: "Deepa Nair liked post 'Welcome to the Ellangala Community!'",
    authorName: 'Deepa Nair',
    authorEmail: 'deepa.nair@example.com',
    authorAvatar: '',
    targetUrl: '/admin/feed',
    metadata: { postId: 'post-seed-001' },
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString() // 8h ago
  },
  {
    id: 'notif-seed-007',
    type: 'contact',
    title: 'New Contact Inquiry',
    message: 'Dr. Ramesh Joshi: "Interested in organizing a Positive Psychology corporate workshop for our university leadership team."',
    authorName: 'Dr. Ramesh Joshi',
    authorEmail: 'r.joshi@university.edu',
    authorAvatar: '',
    targetUrl: '/admin/dashboard',
    metadata: { messageId: 'MSG-301' },
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() // 1 day ago
  }
];

function loadNotificationsFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read notifications from disk, falling back to seeds:', err.message);
  }
  saveNotificationsToDisk(INITIAL_SEEDS);
  return [...INITIAL_SEEDS];
}

function saveNotificationsToDisk(items) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write notifications to disk:', err.message);
  }
}

let inMemoryNotifications = loadNotificationsFromDisk();

export async function getNotifications({ type = 'all', unreadOnly = false, page = 1, limit = 50 } = {}) {
  let list = [...inMemoryNotifications];

  if (type === 'likes_comments') {
    list = list.filter(n => n.type === 'like' || n.type === 'comment');
  } else if (type === 'registrations') {
    list = list.filter(n => n.type === 'user_register');
  } else if (type === 'orders_enrollments') {
    list = list.filter(n => n.type === 'order' || n.type === 'enrollment');
  } else if (type !== 'all') {
    list = list.filter(n => n.type === type);
  }

  if (unreadOnly) {
    list = list.filter(n => !n.isRead);
  }

  // Sort descending by date
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unreadCount = inMemoryNotifications.filter(n => !n.isRead).length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const offset = (pageNum - 1) * limitNum;

  return {
    notifications: list.slice(offset, offset + limitNum),
    total: list.length,
    unreadCount
  };
}

export async function getUnreadNotificationCount() {
  return inMemoryNotifications.filter(n => !n.isRead).length;
}

export async function createNotification({
  type = 'system',
  title,
  message,
  authorName = 'Website Visitor',
  authorEmail = '',
  authorAvatar = '',
  targetUrl = '/admin/feed',
  metadata = {}
} = {}) {
  const id = 'notif-' + crypto.randomBytes(6).toString('hex');
  const record = {
    id,
    type,
    title: title || 'New Website Activity',
    message: message || '',
    authorName,
    authorEmail,
    authorAvatar,
    targetUrl,
    metadata,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  inMemoryNotifications.unshift(record);
  saveNotificationsToDisk(inMemoryNotifications);
  return record;
}

export async function markNotificationAsRead(id) {
  const item = inMemoryNotifications.find(n => n.id === id);
  if (item) {
    item.isRead = true;
    saveNotificationsToDisk(inMemoryNotifications);
    return item;
  }
  return null;
}

export async function markAllNotificationsAsRead() {
  for (const item of inMemoryNotifications) {
    item.isRead = true;
  }
  saveNotificationsToDisk(inMemoryNotifications);
  return { success: true, count: inMemoryNotifications.length };
}

export async function deleteNotification(id) {
  const beforeLen = inMemoryNotifications.length;
  inMemoryNotifications = inMemoryNotifications.filter(n => n.id !== id);
  saveNotificationsToDisk(inMemoryNotifications);
  return { success: true, deleted: beforeLen > inMemoryNotifications.length };
}

export async function clearReadNotifications() {
  const beforeLen = inMemoryNotifications.length;
  inMemoryNotifications = inMemoryNotifications.filter(n => !n.isRead);
  saveNotificationsToDisk(inMemoryNotifications);
  return { success: true, removedCount: beforeLen - inMemoryNotifications.length };
}
