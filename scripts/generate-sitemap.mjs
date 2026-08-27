// Dynamic Sitemap Helper Script
import { getDynamicSitemapXml } from '../server/lib/sitemapGenerator.js';
import { ensureSchema } from '../server/db/store.js';

console.log('⚡ Dynamic Sitemap Architecture active (Option B).');
console.log('🌐 /sitemap.xml is generated dynamically from the database at runtime.');
await ensureSchema();
const xml = await getDynamicSitemapXml();
console.log(`✅ Current dynamic sitemap length: ${xml.length} bytes.`);
process.exit(0);
