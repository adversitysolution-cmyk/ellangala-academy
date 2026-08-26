import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialEvents } from '../../src/features/events/data/eventSeedData.js';
import { blogContent } from '../../src/contents/blog.content.js';
import { invalidateSitemapCache } from '../lib/sitemapGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initialSeed() {
  const seededBlogs = (blogContent.list.posts || []).map(b => ({
    id: b.id,
    slug: b.slug || b.id,
    title: b.title,
    excerpt: b.excerpt || '',
    content: b.details?.text1 ? `${b.details.text1}\n\n${b.details.text2 || ''}\n\n${b.details.text3 || ''}` : b.excerpt,
    category: b.category || 'Positive Psychology',
    image: b.img || '/assets/images/blog/blog-mind-gym.png',
    author: b.author ? b.author.replace(/^By\s+/, '') : 'Dr. Naveen Ellangala',
    status: 'published',
    readTime: b.readTime || '10 Mins Read',
    details: b.details || null,
    seo: {
      title: `${b.title} | Ellangala’s Academy`,
      description: b.excerpt,
      image: b.img,
      noindex: false
    },
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  const seededEvents = (initialEvents || []).map(e => ({
    ...e,
    status: e.status || 'published',
    seo: {
      title: `${e.title} | Ellangala’s Academy`,
      description: e.shortDescription,
      image: e.image,
      noindex: false
    },
    publishedAt: e.createdAt || new Date().toISOString(),
    createdAt: e.createdAt || new Date().toISOString(),
    updatedAt: e.updatedAt || new Date().toISOString()
  }));

  return {
    events: seededEvents,
    blogs: seededBlogs,
    orders: [],
    enrollments: [],
    messages: []
  };
}

export function getStore() {
  ensureDataDir();
  if (!fs.existsSync(STORE_PATH)) {
    const data = initialSeed();
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const data = JSON.parse(raw);
    // Backfill collections added after this store.json was first created.
    data.orders = data.orders || [];
    data.enrollments = data.enrollments || [];
    data.messages = data.messages || [];
    return data;
  } catch (err) {
    console.error('Error reading store.json, re-seeding:', err);
    const data = initialSeed();
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  }
}

export function saveStore(data) {
  ensureDataDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  invalidateSitemapCache();
}

// --- EVENT DB OPERATIONS ---
export function getDbEvents({ status } = {}) {
  const store = getStore();
  if (status) {
    return store.events.filter(e => e.status === status);
  }
  return store.events;
}

export function getDbEventBySlug(slug) {
  const events = getDbEvents();
  return events.find(e => e.slug === slug || String(e.id) === String(slug)) || null;
}

export function getDbEventById(id) {
  const events = getDbEvents();
  return events.find(e => String(e.id) === String(id)) || null;
}

export function saveDbEvent(eventData) {
  const store = getStore();
  const now = new Date().toISOString();

  let slug = (eventData.slug || eventData.title || 'event')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  // Existing check
  let existingIndex = -1;
  if (eventData.id) {
    existingIndex = store.events.findIndex(e => String(e.id) === String(eventData.id));
  }

  if (existingIndex >= 0) {
    const existing = store.events[existingIndex];
    if (existing.slug !== slug && store.events.some((e, idx) => idx !== existingIndex && e.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    const updated = {
      ...existing,
      ...eventData,
      slug,
      updatedAt: now,
      publishedAt: eventData.status === 'published' && existing.status !== 'published' ? now : (existing.publishedAt || now)
    };
    store.events[existingIndex] = updated;
    saveStore(store);
    return updated;
  } else {
    // New Event
    const nextNum = store.events.length + 1;
    const year = new Date().getFullYear();
    const id = eventData.id || `EVT-${year}-${String(nextNum).padStart(4, '0')}`;

    if (store.events.some(e => e.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newRecord = {
      id,
      slug,
      title: eventData.title || 'Untitled Event',
      category: eventData.category || 'Positive Workshop',
      shortDescription: eventData.shortDescription || '',
      description: eventData.description || '',
      image: eventData.image || '/assets/images/blog/blog-positive-psychology.png',
      date: eventData.date || new Date().toISOString().split('T')[0],
      startTime: eventData.startTime || '10:00',
      endTime: eventData.endTime || '12:00',
      timezone: eventData.timezone || 'Asia/Kolkata',
      mode: eventData.mode || 'Offline',
      venue: eventData.venue || 'Ellangala’s Academy',
      address: eventData.address || '',
      city: eventData.city || 'Bengaluru',
      googleMeetLink: eventData.googleMeetLink || eventData.meetingLink || '',
      meetingLink: eventData.googleMeetLink || eventData.meetingLink || '',
      organizer: eventData.organizer || 'Ellangala’s Academy',
      speaker: eventData.speaker || 'Dr. Naveen Ellangala',
      registrationOpen: eventData.registrationOpen !== undefined ? Boolean(eventData.registrationOpen) : true,
      capacity: eventData.capacity ? Number(eventData.capacity) : null,
      availableSeats: eventData.capacity ? Number(eventData.capacity) : null,
      priceType: eventData.priceType || 'Free',
      price: eventData.price || null,
      razorpayLink: eventData.razorpayLink || eventData.paymentLink || '',
      paymentLink: eventData.razorpayLink || eventData.paymentLink || '',
      status: eventData.status || 'published',
      featured: Boolean(eventData.featured),
      seo: eventData.seo || {
        title: '',
        description: '',
        image: '',
        noindex: false
      },
      createdAt: now,
      updatedAt: now,
      publishedAt: eventData.status === 'published' ? now : null
    };

    store.events.unshift(newRecord);
    saveStore(store);
    return newRecord;
  }
}

export function deleteDbEvent(id) {
  const store = getStore();
  const initialLen = store.events.length;
  store.events = store.events.filter(e => String(e.id) !== String(id));
  if (store.events.length !== initialLen) {
    saveStore(store);
    return true;
  }
  return false;
}

// --- BLOG DB OPERATIONS ---
export function getDbBlogs({ status } = {}) {
  const store = getStore();
  if (status) {
    return store.blogs.filter(b => b.status === status);
  }
  return store.blogs;
}

export function getDbBlogBySlug(slug) {
  const blogs = getDbBlogs();
  return blogs.find(b => b.slug === slug || String(b.id) === String(slug)) || null;
}

export function getDbBlogById(id) {
  const blogs = getDbBlogs();
  return blogs.find(b => String(b.id) === String(id)) || null;
}

export function saveDbBlog(blogData) {
  const store = getStore();
  const now = new Date().toISOString();

  let slug = (blogData.slug || blogData.title || 'blog')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  let existingIndex = -1;
  if (blogData.id) {
    existingIndex = store.blogs.findIndex(b => String(b.id) === String(blogData.id));
  }

  if (existingIndex >= 0) {
    const existing = store.blogs[existingIndex];
    if (existing.slug !== slug && store.blogs.some((b, idx) => idx !== existingIndex && b.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    const updated = {
      ...existing,
      ...blogData,
      slug,
      updatedAt: now,
      publishedAt: blogData.status === 'published' && existing.status !== 'published' ? now : (existing.publishedAt || now)
    };
    store.blogs[existingIndex] = updated;
    saveStore(store);
    return updated;
  } else {
    // New Blog
    const nextNum = store.blogs.length + 1;
    const year = new Date().getFullYear();
    const id = blogData.id || `BLOG-${year}-${String(nextNum).padStart(4, '0')}`;

    if (store.blogs.some(b => b.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newRecord = {
      id,
      slug,
      title: blogData.title || 'Untitled Article',
      excerpt: blogData.excerpt || '',
      content: blogData.content || '',
      category: blogData.category || 'Positive Psychology',
      image: blogData.image || '/assets/images/blog/blog-mind-gym.png',
      author: blogData.author || 'Dr. Naveen Ellangala',
      status: blogData.status || 'published',
      readTime: blogData.readTime || '8 Mins Read',
      details: blogData.details || {
        headerTitle: blogData.title,
        category: blogData.category || 'Positive Psychology',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: blogData.author || 'Dr. Naveen Ellangala',
        title: blogData.title,
        text1: blogData.content || blogData.excerpt,
        articleImage: blogData.image || '/assets/images/blog/blog-mind-gym.png'
      },
      seo: blogData.seo || {
        title: '',
        description: '',
        image: '',
        noindex: false
      },
      createdAt: now,
      updatedAt: now,
      publishedAt: blogData.status === 'published' ? now : null
    };

    store.blogs.unshift(newRecord);
    saveStore(store);
    return newRecord;
  }
}

export function deleteDbBlog(id) {
  const store = getStore();
  const initialLen = store.blogs.length;
  store.blogs = store.blogs.filter(b => String(b.id) !== String(id));
  if (store.blogs.length !== initialLen) {
    saveStore(store);
    return true;
  }
  return false;
}

// --- ORDER DB OPERATIONS ---
export function getDbOrders() {
  return getStore().orders;
}

export function getDbOrderById(id) {
  return getDbOrders().find(o => String(o.id) === String(id)) || null;
}

export function createDbOrder(orderData) {
  const store = getStore();
  const now = new Date().toISOString();
  const nextNum = store.orders.length + 1;
  const year = new Date().getFullYear();
  const id = `ORD-${year}-${String(nextNum).padStart(4, '0')}`;

  const newRecord = {
    id,
    customerName: `${orderData.firstName || ''} ${orderData.lastName || ''}`.trim() || 'Guest',
    phone: orderData.phone || '',
    email: orderData.email || '',
    address: orderData.streetAddress || '',
    city: orderData.city || '',
    state: orderData.state || '',
    zipcode: orderData.zipcode || '',
    country: orderData.country || 'India',
    items: orderData.cartItems || [],
    subtotal: orderData.subtotal || 0,
    shipping: orderData.shipping || 0,
    discount: orderData.discountAmount || 0,
    totalAmount: orderData.total || 0,
    paymentMethod: orderData.paymentMethod || 'cod',
    paymentStatus: orderData.paymentMethod === 'online' ? 'Paid' : 'Pending',
    status: 'New',
    internalNotes: orderData.orderNotes || '',
    createdAt: now,
    updatedAt: now
  };

  store.orders.unshift(newRecord);
  saveStore(store);
  return newRecord;
}

export function updateDbOrderStatus(id, { status, internalNotes } = {}) {
  const store = getStore();
  const index = store.orders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;

  store.orders[index] = {
    ...store.orders[index],
    ...(status !== undefined ? { status } : {}),
    ...(internalNotes !== undefined ? { internalNotes } : {}),
    updatedAt: new Date().toISOString()
  };
  saveStore(store);
  return store.orders[index];
}

// --- ENROLLMENT DB OPERATIONS ---
export function deriveProgramType(programTitle = '') {
  const lower = (programTitle || '').toLowerCase();
  if (lower.includes('mentoring')) return 'Mentoring';
  if (lower.includes('workshop') || lower.includes('psychology') || lower.includes('mindset') || lower.includes('art of mind') || lower.includes('gita') || lower.includes('wellness') || lower.includes('parenting') || lower.includes('teaching')) return 'Workshop';
  if (lower.includes('app')) return 'MindGym App';
  if (lower.includes('centre') || lower.includes('center') || lower.includes('mindgym')) return 'MindGym Centre';
  return 'General Enquiry';
}

export function getDbEnrollments() {
  return getStore().enrollments;
}

export function getDbEnrollmentById(id) {
  return getDbEnrollments().find(e => String(e.id) === String(id)) || null;
}

export function createDbEnrollment(formData) {
  const store = getStore();
  const now = new Date().toISOString();
  const nextNum = store.enrollments.length + 1;
  const year = new Date().getFullYear();
  const id = `ENR-${year}-${String(nextNum).padStart(4, '0')}`;

  const isEvent = formData.sourceType === 'Event' || (formData.program || '').toLowerCase().includes('event');

  const newRecord = {
    id,
    fullName: formData.fullName || formData.name || 'Anonymous',
    phone: formData.phone || '',
    email: formData.email || '',
    city: formData.city || formData.areaCity || '',
    interest: formData.program || formData.interest || 'General Inquiry / Consultation',
    type: isEvent ? 'Event' : deriveProgramType(formData.program || formData.interest),
    sourceType: formData.sourceType || (isEvent ? 'Event' : 'Program'),
    eventId: formData.eventId || null,
    eventTitle: formData.eventTitle || null,
    message: formData.message || '',
    status: formData.status || 'New',
    internalNotes: '',
    submittedAt: now,
    updatedAt: now
  };

  store.enrollments.unshift(newRecord);
  saveStore(store);
  return newRecord;
}

export function updateDbEnrollmentStatus(id, { status, internalNotes } = {}) {
  const store = getStore();
  const index = store.enrollments.findIndex(e => String(e.id) === String(id));
  if (index === -1) return null;

  store.enrollments[index] = {
    ...store.enrollments[index],
    ...(status !== undefined ? { status } : {}),
    ...(internalNotes !== undefined ? { internalNotes } : {}),
    updatedAt: new Date().toISOString()
  };
  saveStore(store);
  return store.enrollments[index];
}

// --- CONTACT MESSAGE DB OPERATIONS ---
export function getDbMessages() {
  return getStore().messages;
}

export function createDbMessage(data) {
  const store = getStore();
  const now = new Date().toISOString();
  const nextNum = store.messages.length + 1;
  const year = new Date().getFullYear();
  const id = `MSG-${year}-${String(nextNum).padStart(4, '0')}`;

  const newRecord = {
    id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    subject: data.subject || '',
    message: data.message || '',
    status: 'New',
    submittedAt: now
  };

  store.messages.unshift(newRecord);
  saveStore(store);
  return newRecord;
}
