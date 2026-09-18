import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDynamicSitemapXml } from '../server/lib/sitemapGenerator.js';
import { ensureSchema } from '../server/db/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('⚡ Generating Production Sitemap for https://ellangala.com ...');

try {
  await ensureSchema();
} catch (err) {
  console.warn('⚠️ Schema notice during sitemap generation:', err.message);
}

const xml = await getDynamicSitemapXml();

// 1. Write to public/sitemap.xml (source of static build assets)
const publicPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, xml, 'utf-8');
console.log(`✅ Saved sitemap to: ${publicPath} (${xml.length} bytes)`);

// 2. Write to dist/sitemap.xml (if dist directory exists)
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  const distPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(distPath, xml, 'utf-8');
  console.log(`✅ Saved sitemap to: ${distPath}`);
}

console.log('🎉 Production sitemap generation completed successfully.');
process.exit(0);
