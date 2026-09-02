import express from 'express';
import cors from 'cors';
import path from 'path';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

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

// 3. Serve Static Assets from Dist (Production) + public assets + persistent uploaded images
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
app.use(express.static(distDir));
app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadsDir));
// NOTE: certificate PDFs in certificatesDir are deliberately NOT served statically —
// access only via token-gated /api/certificates/file/:token or admin download.

// 4. SPA Fallback Router
app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (req.accepts('html')) {
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).send('Not Found');
      }
    });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// 5. Error handler (catches rejected promises forwarded by asyncRouter)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

ensureSchema()
  .then(() => {
    startCertificateWorker().catch((err) => console.error('Certificate worker failed to start:', err.message));
    app.listen(PORT, () => {
      console.log(`🚀 Ellangala’s Academy Server running on http://localhost:${PORT}`);
      console.log(`🌐 Dynamic Sitemap available at http://localhost:${PORT}/sitemap.xml`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

export default app;
