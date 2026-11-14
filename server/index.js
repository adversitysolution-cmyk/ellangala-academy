import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import eventsApi from './routes/eventsApi.js';
import blogsApi from './routes/blogsApi.js';
import ordersApi from './routes/ordersApi.js';
import productsApi from './routes/productsApi.js';
import enrollmentsApi from './routes/enrollmentsApi.js';
import paymentsApi from './routes/paymentsApi.js';
import couponsApi from './routes/couponsApi.js';
import contactApi from './routes/contactApi.js';
import adminAuthApi from './routes/adminAuthApi.js';
import uploadApi, { uploadsDir } from './routes/uploadApi.js';
import certificatesApi from './routes/certificatesApi.js';
import communityApi from './routes/communityApi.js';
import notificationsApi from './routes/notificationsApi.js';
import adminUsersApi from './routes/adminUsersApi.js';
import sitemapRoute from './routes/sitemapRoute.js';
import { requireAdminAuth } from './middleware/adminAuth.js';
import { ensureSchema } from './db/store.js';
import { ensureCommunitySchema } from './db/communityStore.js';
import { startCertificateWorker } from './lib/certificateWorker.js';
import { resolvePageMetadata, buildHeadTagsHtml } from './lib/pageMetadataResolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
// Keep the raw body: the Razorpay webhook signature is computed over it.
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));

// 1. API Endpoints (always uncached)
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use('/api', adminAuthApi); // POST /api/admin/login (public)
app.use('/api/admin', requireAdminAuth); // everything else under /api/admin/* requires a session
app.use('/api', eventsApi);
app.use('/api', blogsApi);
app.use('/api', ordersApi);
app.use('/api', productsApi);
app.use('/api', enrollmentsApi);
app.use('/api', paymentsApi);
app.use('/api', couponsApi);
app.use('/api', contactApi);
app.use('/api', uploadApi);
app.use('/api', certificatesApi);
app.use('/api', communityApi);
app.use('/api', notificationsApi);
app.use('/api', adminUsersApi);

// 2. Dynamic Sitemap Endpoint (Handled BEFORE SPA catch-all)
app.use('/', sitemapRoute);

// 3. Permanent (301) Redirects for Legacy / Old WordPress & Team URLs
const legacyRedirects = [
  { pattern: /^\/our-team(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/team\/mr-naveen-ellangala(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/team\/dr-naveen-ellangala(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/team\/naveen-ellangala(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/mr-naveen-ellangala(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/dr-naveen-ellangala(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/naveen-ellangala(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/about\/founder(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/about\/dr-naveen-ellangala(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/about\/naveen-ellangala(\/.*)?$/i, target: '/founder' },
  { pattern: /^\/founder\.html$/i, target: '/founder' },
  // Old WordPress site structure (404s surfaced in Search Console after migration)
  { pattern: /^\/about\/approach(\/.*)?$/i, target: '/about' },
  { pattern: /^\/collabs(\/.*)?$/i, target: '/' },
  { pattern: /^\/events\/-\/?$/i, target: '/events' }
];

app.use((req, res, next) => {
  const reqPath = req.path;
  for (const r of legacyRedirects) {
    if (r.pattern.test(reqPath)) {
      return res.redirect(301, r.target);
    }
  }
  next();
});

// 3c. Trailing-slash normalization (301): /founder/ -> /founder, /blog-details/x/ -> /blog-details/x
// Keeps one canonical URL per page instead of Google indexing both forms.
app.use((req, res, next) => {
  const reqPath = req.path;
  const isApiOrAsset = reqPath.startsWith('/api/') || reqPath.startsWith('/assets/') || reqPath.startsWith('/uploads/');
  if (req.method === 'GET' && !isApiOrAsset && reqPath.length > 1 && reqPath.endsWith('/')) {
    const stripped = reqPath.replace(/\/+$/, '') || '/';
    const query = req._parsedUrl?.search || '';
    return res.redirect(301, stripped + query);
  }
  next();
});

// 3b. Canonicalization (www -> non-www, HTTP -> HTTPS) & Security Headers (HSTS)
app.use((req, res, next) => {
  const host = req.headers.host || '';
  const hostname = host.split(':')[0].toLowerCase();
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
  const proto = req.headers['x-forwarded-proto'] || req.protocol;

  // Enforce HSTS (Strict-Transport-Security) & Security Headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (!isLocalHost) {
    // Redirect www.ellangala.com to ellangala.com (301 Permanent Redirect)
    if (host.startsWith('www.')) {
      const cleanHost = host.replace(/^www\./i, '');
      return res.redirect(301, `https://${cleanHost}${req.originalUrl}`);
    }

    // Redirect HTTP to HTTPS in production
    if (process.env.NODE_ENV === 'production' && proto === 'http') {
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    }
  }

  next();
});

// 4. Serve Static Assets from Dist (Production) + persistent uploaded images
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
const manifestPath = path.join(distDir, '.vite', 'manifest.json');
let cachedHashedAssetSet = new Set();
let cachedManifestMtime = 0;

function getHashedAssetSet() {
  try {
    if (!fs.existsSync(manifestPath)) {
      cachedHashedAssetSet = new Set();
      cachedManifestMtime = 0;
      return cachedHashedAssetSet;
    }
    const stat = fs.statSync(manifestPath);
    if (stat.mtimeMs !== cachedManifestMtime) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const nextSet = new Set();
      for (const entry of Object.values(manifest)) {
        if (entry?.file) nextSet.add(`/${entry.file.replace(/^\/+/, '')}`);
        for (const cssFile of entry?.css || []) nextSet.add(`/${cssFile.replace(/^\/+/, '')}`);
        for (const assetFile of entry?.assets || []) nextSet.add(`/${assetFile.replace(/^\/+/, '')}`);
      }
      cachedHashedAssetSet = nextSet;
      cachedManifestMtime = stat.mtimeMs;
    }
  } catch {
    // Keep last valid set if manifest is briefly unavailable during rebuild
  }
  return cachedHashedAssetSet;
}

const staticDirToServe = fs.existsSync(distDir) ? distDir : publicDir;

// 4a. /assets: long-term immutable ONLY for content-hashed Vite bundles or ?v= versioned assets;
// all other unhashed static assets (images, fonts, vendor files) revalidate via ETag cleanly.
app.use('/assets', express.static(path.join(staticDirToServe, 'assets'), {
  etag: true,
  lastModified: true,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    const req = res.req;
    const reqPath = `/assets${req?.path || ''}`;
    const hasVersionQuery = Boolean(req?.query?.v && /^[a-z0-9_-]{6,}$/i.test(String(req.query.v)));
    const isHashedBundle = getHashedAssetSet().has(reqPath) ||
      (/[/\\]dist[/\\]assets[/\\][^/\\]+$/i.test(filePath) && /-[A-Za-z0-9_-]{8}\.(?:js|mjs|css)$/i.test(filePath));

    if (hasVersionQuery || isHashedBundle) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// 4b. Root static files in dist (robots.txt, etc.) — index: false ensures `/` goes through dynamic SSR metadata & no-store headers
app.use(express.static(staticDirToServe, {
  index: false,
  etag: true,
  lastModified: true,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// Block internal JSON auth/session/profile stores inside uploadsDir from public HTTP access
app.use('/uploads', (req, res, next) => {
  if (/\.json$/i.test(req.path)) {
    return res.status(404).end();
  }
  next();
});

app.use('/uploads', express.static(uploadsDir, {
  etag: true,
  lastModified: true,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }
}));
// NOTE: certificate PDFs in certificatesDir are deliberately NOT served statically —
// access only via token-gated /api/certificates/file/:token or admin download.

// 5. Dynamic Metadata & SPA Fallback Router (SSR Metadata & Schema Injection)
app.get('*', async (req, res) => {
  if (!req.accepts('html')) {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const indexPath = fs.existsSync(path.join(distDir, 'index.html'))
      ? path.join(distDir, 'index.html')
      : path.join(rootDir, 'index.html');

    if (!fs.existsSync(indexPath)) {
      return res.status(404).send('Not Found');
    }

    const htmlTemplate = fs.readFileSync(indexPath, 'utf-8');
    const pageMeta = await resolvePageMetadata(req.path);
    const headInjection = buildHeadTagsHtml(pageMeta);

    // Replace the SEO injection block
    let finalHtml = htmlTemplate;
    const injectionRegex = /<!-- SEO_HEAD_INJECTION -->[\s\S]*?<!-- \/SEO_HEAD_INJECTION -->/;

    if (injectionRegex.test(finalHtml)) {
      finalHtml = finalHtml.replace(injectionRegex, headInjection);
    } else {
      // Fallback: insert right after <head>
      finalHtml = finalHtml.replace('<head>', `<head>\n    ${headInjection}`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Vary', 'Accept-Encoding');
    if (pageMeta.is404) {
      res.status(404).send(finalHtml);
    } else {
      res.status(200).send(finalHtml);
    }
  } catch (err) {
    console.error('Error serving dynamic HTML:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 5. Error handler (catches rejected promises forwarded by asyncRouter)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Ellangala’s Academy Server running on http://localhost:${PORT}`);
  console.log(`🌐 Dynamic Sitemap available at http://localhost:${PORT}/sitemap.xml`);

  ensureSchema()
    .then(async () => {
      await ensureCommunitySchema().catch((err) => console.error('Community schema notice:', err.message));
      startCertificateWorker().catch((err) => console.error('Certificate worker failed to start:', err.message));
      console.log('✅ Database schema verified and initialized.');
    })
    .catch((err) => {
      console.warn('⚠️ Database connection notice (server still serving static files & fallback cache):', err.message);
    });
});

export default app;
