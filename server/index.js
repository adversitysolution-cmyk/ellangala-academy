import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import eventsApi from './routes/eventsApi.js';
import blogsApi from './routes/blogsApi.js';
import ordersApi from './routes/ordersApi.js';
import enrollmentsApi from './routes/enrollmentsApi.js';
import contactApi from './routes/contactApi.js';
import adminAuthApi from './routes/adminAuthApi.js';
import sitemapRoute from './routes/sitemapRoute.js';
import { requireAdminAuth } from './middleware/adminAuth.js';

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
app.use('/api', enrollmentsApi);
app.use('/api', contactApi);

// 2. Dynamic Sitemap Endpoint (Handled BEFORE SPA catch-all)
app.use('/', sitemapRoute);

// 3. Serve Static Assets from Dist (Production)
const distDir = path.join(rootDir, 'dist');
app.use(express.static(distDir));

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

app.listen(PORT, () => {
  console.log(`🚀 Ellangala’s Academy Server running on http://localhost:${PORT}`);
  console.log(`🌐 Dynamic Sitemap available at http://localhost:${PORT}/sitemap.xml`);
});

export default app;
