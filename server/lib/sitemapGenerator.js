import { siteConfig } from '../../src/seo/siteConfig.js';
import { getStore } from '../db/store.js';
import { shopContent } from '../../src/contents/shop.content.js';
import { programsData } from '../../src/contents/programsData.content.js';
import { blogContent } from '../../src/contents/blog.content.js';

let cachedXml = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export function escapeXml(unsafe = '') {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function formatIsoDate(dateVal) {
  if (!dateVal) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export function invalidateSitemapCache() {
  cachedXml = null;
  lastCacheTime = 0;
  console.log('🔄 Sitemap cache invalidated on content mutation');
}

export function generateSitemapXml(urls = []) {
  const seenUrls = new Set();
  const uniqueUrlNodes = [];

  for (const u of urls) {
    if (!u.loc || seenUrls.has(u.loc)) continue;
    seenUrls.add(u.loc);

    const loc = escapeXml(u.loc);
    const lastmod = u.lastmod ? `\n    <lastmod>${escapeXml(formatIsoDate(u.lastmod))}</lastmod>` : '';
    const changefreq = u.changefreq ? `\n    <changefreq>${escapeXml(u.changefreq)}</changefreq>` : '';
    const priority = u.priority ? `\n    <priority>${escapeXml(u.priority)}</priority>` : '';

    uniqueUrlNodes.push(`  <url>\n    <loc>${loc}</loc>${lastmod}${changefreq}${priority}\n  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrlNodes.join('\n')}\n</urlset>`;
}

export async function getDynamicSitemapXml() {
  const now = Date.now();
  if (cachedXml && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedXml;
  }

  const baseDomain = siteConfig.url || 'https://ellangala.com';

  // 1. Core Primary Static Routes
  const staticRoutes = [
    { loc: `${baseDomain}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseDomain}/founder`, priority: '0.95', changefreq: 'weekly' },
    { loc: `${baseDomain}/research`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${baseDomain}/about`, priority: '0.85', changefreq: 'monthly' },
    { loc: `${baseDomain}/positive-workshops`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseDomain}/positive-mentoring`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseDomain}/mindgym`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseDomain}/mindgym/app`, priority: '0.85', changefreq: 'monthly' },
    { loc: `${baseDomain}/resources`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseDomain}/shop`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseDomain}/resources/videos`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseDomain}/resources/meditation`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseDomain}/resources/free-downloads`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseDomain}/events`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseDomain}/blog`, priority: '0.85', changefreq: 'weekly' },
    { loc: `${baseDomain}/insights`, priority: '0.85', changefreq: 'weekly' },
    { loc: `${baseDomain}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseDomain}/faq`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseDomain}/verify-certificate`, priority: '0.7', changefreq: 'monthly' }
  ];

  // 2. Program Details Routes
  const programSlugs = Object.keys(programsData || {});
  const programRoutes = programSlugs.map(slug => ({
    loc: `${baseDomain}/programs/${slug}`,
    changefreq: 'monthly',
    priority: '0.85'
  }));

  // 3. Shop & Book Products Routes (All 17 books and publications)
  const products = shopContent?.shop?.products || [];
  const productRoutes = products.map(prod => ({
    loc: `${baseDomain}/shop/${prod.id}`,
    changefreq: 'monthly',
    priority: '0.8'
  }));

  // 4. Dynamic Published Events from DB
  let eventUrls = [];
  let blogUrls = [];

  try {
    const store = await getStore();
    const events = store.events || [];
    const blogs = store.blogs || [];

    const publishedEvents = events.filter(e => e.status === 'published' && e.seo?.noindex !== true);
    eventUrls = publishedEvents.map(e => ({
      loc: `${baseDomain}/events/${e.slug}`,
      lastmod: e.updatedAt || e.publishedAt || e.createdAt || e.date,
      changefreq: 'weekly',
      priority: '0.85'
    }));

    const publishedBlogs = blogs.filter(b => b.status === 'published' && b.seo?.noindex !== true);
    blogUrls = publishedBlogs.map(b => ({
      loc: `${baseDomain}/insights/${b.slug}`,
      lastmod: b.updatedAt || b.publishedAt || b.createdAt,
      changefreq: 'weekly',
      priority: '0.85'
    }));
  } catch (err) {
    console.warn('⚠️ Sitemap generator using static fallback for events/blogs:', err.message);
  }

  // 5. Fallback Static Blogs if DB has no blogs
  if (blogUrls.length === 0 && blogContent?.list?.posts) {
    blogUrls = blogContent.list.posts.map(post => ({
      loc: `${baseDomain}/insights/${post.slug || post.id}`,
      changefreq: 'weekly',
      priority: '0.85'
    }));
  }

  const allUrls = [
    ...staticRoutes,
    ...programRoutes,
    ...productRoutes,
    ...eventUrls,
    ...blogUrls
  ];

  cachedXml = generateSitemapXml(allUrls);
  lastCacheTime = now;

  return cachedXml;
}
