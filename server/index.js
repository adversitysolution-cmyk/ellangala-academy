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
import sitemapRoute from './routes/sitemapRoute.js';
import { requireAdminAuth } from './middleware/adminAuth.js';
import { ensureSchema } from './db/store.js';
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

// 1. API Endpoints
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
  { pattern: /^\/founder\.html$/i, target: '/founder' }
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

// 4. Serve Static Assets from Dist (Production) + public assets + persistent uploaded images
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
app.use(express.static(distDir));
app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadsDir));
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
    res.status(200).send(finalHtml);
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
    .then(() => {
      startCertificateWorker().catch((err) => console.error('Certificate worker failed to start:', err.message));
      console.log('✅ Database schema verified and initialized.');
    })
    .catch((err) => {
      console.warn('⚠️ Database connection notice (server still serving static files & fallback cache):', err.message);
    });
});

export default app;
