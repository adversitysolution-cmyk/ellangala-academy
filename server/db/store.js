import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';
import { initialEvents } from '../../src/features/events/data/eventSeedData.js';
import { blogContent } from '../../src/contents/blog.content.js';
import { shopContent } from '../../src/contents/shop.content.js';
import { invalidateSitemapCache } from '../lib/sitemapGenerator.js';
import { computeDiscount, checkCouponUsable } from '../../src/shared/couponMath.js';
import { seedCertificateDefaults } from './certificateStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toIso = (val) => (val instanceof Date ? val.toISOString() : val);
const toBool = (val) => Boolean(val);

function toMysqlDatetime(iso) {
  return new Date(iso || Date.now()).toISOString().slice(0, 19).replace('T', ' ');
}

async function nextId(conn, table, prefix) {
  const year = new Date().getFullYear();
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS n FROM ${table} WHERE id LIKE ?`,
    [`${prefix}-${year}-%`]
  );
  return `${prefix}-${year}-${String(rows[0].n + 1).padStart(4, '0')}`;
}

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uniqueSlug(conn, table, baseSlug, excludeId = null) {
  let slug = baseSlug;
  const [rows] = await conn.query(
    excludeId ? `SELECT id FROM ${table} WHERE slug = ? AND id != ?` : `SELECT id FROM ${table} WHERE slug = ?`,
    excludeId ? [slug, excludeId] : [slug]
  );
  if (rows.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }
  return slug;
}

// --- SCHEMA + SEED (runs once on server start) ---
export async function ensureSchema() {
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  const statements = schemaSql.split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  // Add columns introduced after a DB was first created (CREATE TABLE IF NOT EXISTS skips them).
  for (const [table, ddl] of [
    ['orders', 'ADD COLUMN paymentRef VARCHAR(120)'],
    ['orders', 'ADD COLUMN couponCode VARCHAR(60)'],
    ['products', 'ADD COLUMN stock INT DEFAULT NULL'],
    ['events', 'ADD COLUMN endDate VARCHAR(20)']
  ]) {
    try {
      await pool.query(`ALTER TABLE ${table} ${ddl}`);
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
    }
  }
  await seedIfEmpty();
  await seedCertificateDefaults();
}

async function seedIfEmpty() {
  const [[{ n: eventCount }]] = await pool.query('SELECT COUNT(*) AS n FROM events');
  if (eventCount === 0) {
    const now = new Date().toISOString();
    for (const e of initialEvents || []) {
      await saveDbEvent({
        ...e,
        seo: { title: `${e.title} | Ellangala’s Academy`, description: e.shortDescription, image: e.image, noindex: false },
        createdAt: e.createdAt || now,
        publishedAt: e.createdAt || now
      });
    }
  }

  for (const b of (blogContent.list.posts || [])) {
    const [existing] = await pool.query('SELECT id FROM blogs WHERE id = ? OR slug = ? LIMIT 1', [b.id, b.slug || b.id]);
    if (existing.length === 0) {
      await saveDbBlog({
        id: b.id,
        slug: b.slug || b.id,
        title: b.title,
        excerpt: b.excerpt || '',
        content: b.details?.text1 ? `${b.details.text1}\n\n${b.details.text2 || ''}\n\n${b.details.text3 || ''}` : b.excerpt,
        category: b.category || 'Positive Psychology',
        image: b.image || b.img || '/assets/images/blog/blog-mind-gym.png',
        author: b.author ? b.author.replace(/^By\s+/, '') : 'Dr. Naveen Ellangala',
        status: 'published',
        readTime: b.readTime || '10 Mins Read',
        details: b.details || null,
        seo: { title: `${b.title} | Ellangala’s Academy`, description: b.excerpt, image: b.image || b.img || '/assets/images/blog/blog-mind-gym.png', noindex: false }
      });
    }
  }

  for (const p of (shopContent.shop.products || [])) {
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ? LIMIT 1', [p.id]);
    if (existing.length === 0) {
      await saveDbProduct({
        id: p.id,
        title: p.title,
        category: p.category || 'BOOKS',
        author: p.author || 'Dr. Naveen Ellangala',
        type: p.type || '',
        theme: p.theme || '',
        price: p.price || '',
        discount: p.discount || '',
        image: p.image || p.img || '',
        alt: p.alt || p.title,
        description: p.description || '',
        highlights: p.highlights || [],
        sale: Boolean(p.sale),
        stock: p.stock ?? (p.inStock === false ? 0 : null),
        status: 'published'
      });
    }
  }

  const [[{ n: couponCount }]] = await pool.query('SELECT COUNT(*) AS n FROM coupons');
  if (couponCount === 0) {
    await saveDbCoupon({ code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 200, description: 'New customer welcome offer' });
    await saveDbCoupon({ code: 'SAVE20', type: 'percent', value: 20, minSubtotal: 999, maxDiscount: 400, description: 'Bulk order discount' });
  }
}

// Used by the sitemap generator.
export async function getStore() {
  const [events] = await pool.query('SELECT * FROM events');
  const [blogs] = await pool.query('SELECT * FROM blogs');
  return { events: events.map(rowToEvent), blogs: blogs.map(rowToBlog) };
}

function rowToEvent(row) {
  return {
    ...row,
    registrationOpen: toBool(row.registrationOpen),
    featured: toBool(row.featured),
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
    publishedAt: toIso(row.publishedAt)
  };
}

function rowToBlog(row) {
  return {
    ...row,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
    publishedAt: toIso(row.publishedAt)
  };
}

function rowToOrder(row) {
  return { ...row, createdAt: toIso(row.createdAt), updatedAt: toIso(row.updatedAt) };
}

function rowToEnrollment(row) {
  return { ...row, submittedAt: toIso(row.submittedAt), updatedAt: toIso(row.updatedAt) };
}

function rowToMessage(row) {
  return { ...row, submittedAt: toIso(row.submittedAt) };
}

function rowToProduct(row) {
  return {
    ...row,
    sale: toBool(row.sale),
    stock: row.stock == null ? null : Number(row.stock),
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt)
  };
}

// --- EVENT DB OPERATIONS ---
export async function getDbEvents({ status } = {}) {
  const [rows] = status
    ? await pool.query('SELECT * FROM events WHERE status = ? ORDER BY pk DESC', [status])
    : await pool.query('SELECT * FROM events ORDER BY pk DESC');
  return rows.map(rowToEvent);
}

export async function getDbEventBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM events WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);
  return rows[0] ? rowToEvent(rows[0]) : null;
}

export async function getDbEventById(id) {
  const [rows] = await pool.query('SELECT * FROM events WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToEvent(rows[0]) : null;
}

export async function saveDbEvent(eventData) {
  const conn = pool;
  const now = new Date().toISOString();

  let existing = null;
  if (eventData.id) {
    const [rows] = await conn.query('SELECT * FROM events WHERE id = ? LIMIT 1', [eventData.id]);
    existing = rows[0] || null;
  }

  const baseSlug = slugify(eventData.slug || eventData.title || 'event');
  const slug = await uniqueSlug(conn, 'events', baseSlug, existing ? existing.id : null);

  if (existing) {
    const merged = {
      ...rowToEvent(existing),
      ...eventData,
      slug,
      updatedAt: now,
      publishedAt: eventData.status === 'published' && existing.status !== 'published' ? now : (toIso(existing.publishedAt) || now)
    };
    await conn.query(
      `UPDATE events SET slug=?, title=?, category=?, shortDescription=?, description=?, image=?, date=?, endDate=?, startTime=?, endTime=?, timezone=?, mode=?, venue=?, address=?, city=?, googleMeetLink=?, meetingLink=?, organizer=?, speaker=?, registrationOpen=?, capacity=?, availableSeats=?, priceType=?, price=?, razorpayLink=?, paymentLink=?, status=?, featured=?, seo=?, updatedAt=?, publishedAt=? WHERE id=?`,
      [merged.slug, merged.title, merged.category, merged.shortDescription, merged.description, merged.image, merged.date, merged.endDate || null, merged.startTime, merged.endTime, merged.timezone, merged.mode, merged.venue, merged.address, merged.city, merged.googleMeetLink, merged.meetingLink, merged.organizer, merged.speaker, Boolean(merged.registrationOpen), merged.capacity ?? null, merged.availableSeats ?? null, merged.priceType, merged.price, merged.razorpayLink, merged.paymentLink, merged.status, Boolean(merged.featured), JSON.stringify(merged.seo || {}), toMysqlDatetime(merged.updatedAt), merged.publishedAt ? toMysqlDatetime(merged.publishedAt) : null, existing.id]
    );
    invalidateSitemapCache();
    return merged;
  }

  const id = eventData.id || await nextId(conn, 'events', 'EVT');
  const record = {
    id,
    slug,
    title: eventData.title || 'Untitled Event',
    category: eventData.category || 'Positive Workshop',
    shortDescription: eventData.shortDescription || '',
    description: eventData.description || '',
    image: eventData.image || '/assets/images/blog/blog-positive-psychology.png',
    date: eventData.date || new Date().toISOString().split('T')[0],
    endDate: eventData.endDate || null,
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
    seo: eventData.seo || { title: '', description: '', image: '', noindex: false },
    createdAt: eventData.createdAt || now,
    updatedAt: now,
    publishedAt: eventData.status === 'published' ? (eventData.publishedAt || now) : null
  };

  await conn.query(
    `INSERT INTO events (id, slug, title, category, shortDescription, description, image, date, endDate, startTime, endTime, timezone, mode, venue, address, city, googleMeetLink, meetingLink, organizer, speaker, registrationOpen, capacity, availableSeats, priceType, price, razorpayLink, paymentLink, status, featured, seo, createdAt, updatedAt, publishedAt)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [record.id, record.slug, record.title, record.category, record.shortDescription, record.description, record.image, record.date, record.endDate, record.startTime, record.endTime, record.timezone, record.mode, record.venue, record.address, record.city, record.googleMeetLink, record.meetingLink, record.organizer, record.speaker, record.registrationOpen, record.capacity, record.availableSeats, record.priceType, record.price, record.razorpayLink, record.paymentLink, record.status, record.featured, JSON.stringify(record.seo), toMysqlDatetime(record.createdAt), toMysqlDatetime(record.updatedAt), record.publishedAt ? toMysqlDatetime(record.publishedAt) : null]
  );
  invalidateSitemapCache();
  return record;
}

export async function deleteDbEvent(id) {
  const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
  if (result.affectedRows > 0) {
    invalidateSitemapCache();
    return true;
  }
  return false;
}

// --- BLOG DB OPERATIONS ---
export async function getDbBlogs({ status } = {}) {
  const [rows] = status
    ? await pool.query('SELECT * FROM blogs WHERE status = ? ORDER BY pk DESC', [status])
    : await pool.query('SELECT * FROM blogs ORDER BY pk DESC');
  return rows.map(rowToBlog);
}

export async function getDbBlogBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);
  return rows[0] ? rowToBlog(rows[0]) : null;
}

export async function getDbBlogById(id) {
  const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToBlog(rows[0]) : null;
}

export async function saveDbBlog(blogData) {
  const conn = pool;
  const now = new Date().toISOString();

  let existing = null;
  if (blogData.id) {
    const [rows] = await conn.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [blogData.id]);
    existing = rows[0] || null;
  }

  const baseSlug = slugify(blogData.slug || blogData.title || 'blog');
  const slug = await uniqueSlug(conn, 'blogs', baseSlug, existing ? existing.id : null);

  if (existing) {
    const merged = {
      ...rowToBlog(existing),
      ...blogData,
      slug,
      updatedAt: now,
      publishedAt: blogData.status === 'published' && existing.status !== 'published' ? now : (toIso(existing.publishedAt) || now)
    };
    await conn.query(
      `UPDATE blogs SET slug=?, title=?, excerpt=?, content=?, category=?, image=?, author=?, status=?, readTime=?, details=?, seo=?, updatedAt=?, publishedAt=? WHERE id=?`,
      [merged.slug, merged.title, merged.excerpt, merged.content, merged.category, merged.image, merged.author, merged.status, merged.readTime, JSON.stringify(merged.details || null), JSON.stringify(merged.seo || {}), toMysqlDatetime(merged.updatedAt), merged.publishedAt ? toMysqlDatetime(merged.publishedAt) : null, existing.id]
    );
    return merged;
  }

  const id = blogData.id || await nextId(conn, 'blogs', 'BLOG');
  const record = {
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
    seo: blogData.seo || { title: '', description: '', image: '', noindex: false },
    createdAt: now,
    updatedAt: now,
    publishedAt: blogData.status === 'published' ? now : null
  };

  await conn.query(
    `INSERT INTO blogs (id, slug, title, excerpt, content, category, image, author, status, readTime, details, seo, createdAt, updatedAt, publishedAt)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [record.id, record.slug, record.title, record.excerpt, record.content, record.category, record.image, record.author, record.status, record.readTime, JSON.stringify(record.details), JSON.stringify(record.seo), toMysqlDatetime(record.createdAt), toMysqlDatetime(record.updatedAt), record.publishedAt ? toMysqlDatetime(record.publishedAt) : null]
  );
  return record;
}

export async function deleteDbBlog(id) {
  const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// --- ORDER DB OPERATIONS ---
export async function getDbOrders() {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY pk DESC');
  return rows.map(rowToOrder);
}

export async function getDbOrderById(id) {
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function createDbOrder(orderData) {
  const now = new Date().toISOString();
  const id = await nextId(pool, 'orders', 'ORD');

  const record = {
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
    // 'online' orders stay Pending until Razorpay signature is verified (markDbOrderPaid).
    paymentStatus: 'Pending',
    paymentRef: null,
    couponCode: orderData.couponCode || null,
    status: 'New',
    internalNotes: orderData.orderNotes || '',
    createdAt: now,
    updatedAt: now
  };

  await pool.query(
    `INSERT INTO orders (id, customerName, phone, email, address, city, state, zipcode, country, items, subtotal, shipping, discount, totalAmount, paymentMethod, paymentStatus, paymentRef, couponCode, status, internalNotes, createdAt, updatedAt)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [record.id, record.customerName, record.phone, record.email, record.address, record.city, record.state, record.zipcode, record.country, JSON.stringify(record.items), record.subtotal, record.shipping, record.discount, record.totalAmount, record.paymentMethod, record.paymentStatus, record.paymentRef, record.couponCode, record.status, record.internalNotes, toMysqlDatetime(record.createdAt), toMysqlDatetime(record.updatedAt)]
  );
  return record;
}

// Stores the Razorpay order id we opened checkout with, so verify can confirm
// the returned payment belongs to THIS order (not a replayed cheaper one).
export async function setDbOrderPaymentRef(id, paymentRef) {
  await pool.query(
    'UPDATE orders SET paymentRef = ?, updatedAt = ? WHERE id = ?',
    [paymentRef, toMysqlDatetime(new Date().toISOString()), id]
  );
}

// Marks an order paid after its Razorpay payment signature is verified server-side.
export async function markDbOrderPaid(id, paymentRef) {
  const existing = await getDbOrderById(id);
  if (!existing) return null;
  await pool.query(
    "UPDATE orders SET paymentStatus = 'Paid', paymentMethod = 'online', paymentRef = ?, updatedAt = ? WHERE id = ?",
    [paymentRef, toMysqlDatetime(new Date().toISOString()), id]
  );
  return getDbOrderById(id);
}

export async function updateDbOrderStatus(id, { status, internalNotes } = {}) {
  const existing = await getDbOrderById(id);
  if (!existing) return null;
  const updatedAt = new Date().toISOString();
  await pool.query(
    'UPDATE orders SET status = COALESCE(?, status), internalNotes = COALESCE(?, internalNotes), updatedAt = ? WHERE id = ?',
    [status ?? null, internalNotes ?? null, toMysqlDatetime(updatedAt), id]
  );
  return getDbOrderById(id);
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

export async function getDbEnrollments() {
  const [rows] = await pool.query('SELECT * FROM enrollments ORDER BY pk DESC');
  return rows.map(rowToEnrollment);
}

export async function getDbEnrollmentById(id) {
  const [rows] = await pool.query('SELECT * FROM enrollments WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToEnrollment(rows[0]) : null;
}

export async function createDbEnrollment(formData) {
  const now = new Date().toISOString();
  const id = await nextId(pool, 'enrollments', 'ENR');
  const isEvent = formData.sourceType === 'Event' || (formData.program || '').toLowerCase().includes('event');

  const record = {
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

  await pool.query(
    `INSERT INTO enrollments (id, fullName, phone, email, city, interest, type, sourceType, eventId, eventTitle, message, status, internalNotes, submittedAt, updatedAt)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [record.id, record.fullName, record.phone, record.email, record.city, record.interest, record.type, record.sourceType, record.eventId, record.eventTitle, record.message, record.status, record.internalNotes, toMysqlDatetime(record.submittedAt), toMysqlDatetime(record.updatedAt)]
  );
  return record;
}

export async function updateDbEnrollmentStatus(id, { status, internalNotes } = {}) {
  const existing = await getDbEnrollmentById(id);
  if (!existing) return null;
  const updatedAt = new Date().toISOString();
  await pool.query(
    'UPDATE enrollments SET status = COALESCE(?, status), internalNotes = COALESCE(?, internalNotes), updatedAt = ? WHERE id = ?',
    [status ?? null, internalNotes ?? null, toMysqlDatetime(updatedAt), id]
  );
  return getDbEnrollmentById(id);
}

// --- CONTACT MESSAGE DB OPERATIONS ---
export async function getDbMessages() {
  const [rows] = await pool.query('SELECT * FROM messages ORDER BY pk DESC');
  return rows.map(rowToMessage);
}

export async function createDbMessage(data) {
  const now = new Date().toISOString();
  const id = await nextId(pool, 'messages', 'MSG');

  const record = {
    id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    subject: data.subject || '',
    message: data.message || '',
    status: 'New',
    submittedAt: now
  };

  await pool.query(
    `INSERT INTO messages (id, name, email, phone, subject, message, status, submittedAt) VALUES (?,?,?,?,?,?,?,?)`,
    [record.id, record.name, record.email, record.phone, record.subject, record.message, record.status, toMysqlDatetime(record.submittedAt)]
  );
  return record;
}

// --- PRODUCT DB OPERATIONS ---
export async function getDbProducts({ status } = {}) {
  const [rows] = status
    ? await pool.query('SELECT * FROM products WHERE status = ? ORDER BY pk DESC', [status])
    : await pool.query('SELECT * FROM products ORDER BY pk DESC');
  return rows.map(rowToProduct);
}

export async function getDbProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function saveDbProduct(productData) {
  const now = new Date().toISOString();

  let existing = null;
  if (productData.id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [productData.id]);
    existing = rows[0] || null;
  }

  const normalizeStock = (val) => (val === '' || val == null ? null : Number(val));

  if (existing) {
    const merged = { ...rowToProduct(existing), ...productData, updatedAt: now };
    merged.stock = normalizeStock(merged.stock);
    await pool.query(
      `UPDATE products SET title=?, category=?, author=?, type=?, theme=?, price=?, discount=?, image=?, alt=?, description=?, highlights=?, sale=?, stock=?, status=?, updatedAt=? WHERE id=?`,
      [merged.title, merged.category, merged.author, merged.type, merged.theme, merged.price, merged.discount, merged.image, merged.alt, merged.description, JSON.stringify(merged.highlights || []), Boolean(merged.sale), merged.stock, merged.status, toMysqlDatetime(merged.updatedAt), existing.id]
    );
    return merged;
  }

  const id = productData.id || slugify(productData.title || 'product') + '-' + Date.now().toString().slice(-5);
  const record = {
    id,
    title: productData.title || 'Untitled Product',
    category: productData.category || 'BOOKS',
    author: productData.author || 'Dr. Naveen Ellangala',
    type: productData.type || '',
    theme: productData.theme || '',
    price: productData.price || '',
    discount: productData.discount || '',
    image: productData.image || '',
    alt: productData.alt || productData.title || '',
    description: productData.description || '',
    highlights: productData.highlights || [],
    sale: Boolean(productData.sale),
    stock: normalizeStock(productData.stock),
    status: productData.status || 'published',
    createdAt: now,
    updatedAt: now
  };

  await pool.query(
    `INSERT INTO products (id, title, category, author, type, theme, price, discount, image, alt, description, highlights, sale, stock, status, createdAt, updatedAt)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [record.id, record.title, record.category, record.author, record.type, record.theme, record.price, record.discount, record.image, record.alt, record.description, JSON.stringify(record.highlights), record.sale, record.stock, record.status, toMysqlDatetime(record.createdAt), toMysqlDatetime(record.updatedAt)]
  );
  return record;
}

export async function deleteDbProduct(id) {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// --- COUPON DB OPERATIONS ---
function rowToCoupon(row) {
  return {
    ...row,
    value: Number(row.value),
    minSubtotal: Number(row.minSubtotal),
    maxDiscount: Number(row.maxDiscount),
    usageLimit: Number(row.usageLimit),
    usedCount: Number(row.usedCount),
    active: toBool(row.active),
    expiresAt: row.expiresAt ? toIso(row.expiresAt).slice(0, 10) : null,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt)
  };
}

export async function getDbCoupons() {
  const [rows] = await pool.query('SELECT * FROM coupons ORDER BY pk DESC');
  return rows.map(rowToCoupon);
}

export async function getDbCouponByCode(code) {
  const [rows] = await pool.query('SELECT * FROM coupons WHERE code = ? LIMIT 1', [String(code || '').trim().toUpperCase()]);
  return rows[0] ? rowToCoupon(rows[0]) : null;
}

export async function saveDbCoupon(data) {
  const now = new Date().toISOString();
  const code = String(data.code || '').trim().toUpperCase();
  if (!code) throw new Error('Coupon code is required.');
  const type = data.type === 'fixed' ? 'fixed' : 'percent';
  const value = Number(data.value) || 0;
  if (value <= 0) throw new Error('Coupon value must be greater than zero.');
  if (type === 'percent' && value > 100) throw new Error('Percentage discount cannot exceed 100.');

  const fields = {
    code,
    type,
    value,
    minSubtotal: Number(data.minSubtotal) || 0,
    maxDiscount: Number(data.maxDiscount) || 0,
    usageLimit: Number(data.usageLimit) || 0,
    active: data.active === undefined ? true : Boolean(data.active),
    description: data.description || '',
    expiresAt: data.expiresAt ? toMysqlDatetime(data.expiresAt).slice(0, 10) : null
  };

  let existing = null;
  if (data.id) {
    const [rows] = await pool.query('SELECT * FROM coupons WHERE id = ? LIMIT 1', [data.id]);
    existing = rows[0] || null;
  }

  const [dup] = await pool.query(
    existing ? 'SELECT id FROM coupons WHERE code = ? AND id != ?' : 'SELECT id FROM coupons WHERE code = ?',
    existing ? [code, existing.id] : [code]
  );
  if (dup.length) throw new Error(`A coupon with code "${code}" already exists.`);

  if (existing) {
    await pool.query(
      'UPDATE coupons SET code=?, type=?, value=?, minSubtotal=?, maxDiscount=?, usageLimit=?, active=?, description=?, expiresAt=?, updatedAt=? WHERE id=?',
      [fields.code, fields.type, fields.value, fields.minSubtotal, fields.maxDiscount, fields.usageLimit, fields.active, fields.description, fields.expiresAt, toMysqlDatetime(now), existing.id]
    );
    return getDbCouponByCode(code);
  }

  const id = await nextId(pool, 'coupons', 'CPN');
  await pool.query(
    'INSERT INTO coupons (id, code, type, value, minSubtotal, maxDiscount, usageLimit, usedCount, active, description, expiresAt, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,0,?,?,?,?,?)',
    [id, fields.code, fields.type, fields.value, fields.minSubtotal, fields.maxDiscount, fields.usageLimit, fields.active, fields.description, fields.expiresAt, toMysqlDatetime(now), toMysqlDatetime(now)]
  );
  return getDbCouponByCode(code);
}

export async function deleteDbCoupon(id) {
  const [result] = await pool.query('DELETE FROM coupons WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// Validates a code against a cart subtotal. Returns { ok, error, coupon, discount }.
export async function validateDbCoupon(code, subtotal) {
  const coupon = await getDbCouponByCode(code);
  const usable = checkCouponUsable(coupon);
  if (!usable.ok) return { ok: false, error: usable.error };
  if (subtotal < coupon.minSubtotal) {
    return { ok: false, error: `Add ₹${Math.ceil(coupon.minSubtotal - subtotal)} more to use this coupon.` };
  }
  const discount = computeDiscount(coupon, subtotal);
  if (discount <= 0) return { ok: false, error: 'This coupon gives no discount on your cart.' };
  return { ok: true, coupon, discount };
}

export async function incrementCouponUsage(code) {
  await pool.query('UPDATE coupons SET usedCount = usedCount + 1 WHERE code = ?', [String(code || '').trim().toUpperCase()]);
}
