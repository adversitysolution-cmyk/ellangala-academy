import { getDynamicSitemapXml } from '../lib/sitemapGenerator.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  const xml = await getDynamicSitemapXml();
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).send(xml);
});

export default router;
