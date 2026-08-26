import { Router } from 'express';
import { getDynamicSitemapXml } from '../lib/sitemapGenerator.js';

const router = Router();

// GET /sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  const xml = getDynamicSitemapXml();
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).send(xml);
});

export default router;
