import { siteConfig } from '../../src/seo/siteConfig.js';
import { getStore } from '../db/store.js';

let cachedXml = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

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
  const urlNodes = urls.map((u) => {
    const loc = escapeXml(u.loc);
    const lastmod = u.lastmod ? `<lastmod>${escapeXml(formatIsoDate(u.lastmod))}</lastmod>` : '';
    const changefreq = u.changefreq ? `<changefreq>${escapeXml(u.changefreq)}</changefreq>` : '';
    const priority = u.priority ? `<priority>${escapeXml(u.priority)}</priority>` : '';

    return `  <url>
    <loc>${loc}</loc>${lastmod ? '\n    ' + lastmod : ''}${changefreq ? '\n    ' + changefreq : ''}${priority ? '\n    ' + priority : ''}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>`;
}

export function getDynamicSitemapXml() {
  const now = Date.now();
  if (cachedXml && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedXml;
  }

  const store = getStore();
  const events = store.events || [];
  const blogs = store.blogs || [];

  // Static Indexable Routes
  const staticRoutes = [
    { loc: `${siteConfig.url}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteConfig.url}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/founder`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/positive-workshops`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/positive-mentoring`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/mindgym`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/mindgym/app`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/team`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/shop`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/shop/book-1`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/shop/book-2`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/shop/book-3`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/resources/videos`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/resources/meditation`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/resources/free-downloads`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/events`, priority: '0.9', changefreq: 'daily' },
    { loc: `${siteConfig.url}/blog`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/insights`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteConfig.url}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/faq`, priority: '0.7', changefreq: 'monthly' }
  ];

  // Dynamic Published Events
  const publishedEvents = events.filter(e => e.status === 'published' && e.seo?.noindex !== true);
  const eventUrls = publishedEvents.map(e => ({
    loc: `${siteConfig.url}/events/${e.slug}`,
    lastmod: e.updatedAt || e.publishedAt || e.createdAt || e.date,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  // Dynamic Published Blogs
  const publishedBlogs = blogs.filter(b => b.status === 'published' && b.seo?.noindex !== true);
  const blogUrls = publishedBlogs.map(b => ({
    loc: `${siteConfig.url}/insights/${b.slug}`,
    lastmod: b.updatedAt || b.publishedAt || b.createdAt,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  const allUrls = [...staticRoutes, ...eventUrls, ...blogUrls];

  cachedXml = generateSitemapXml(allUrls);
  lastCacheTime = now;

  return cachedXml;
}
