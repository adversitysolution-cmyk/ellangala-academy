import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let errors = [];
let warnings = [];

console.log('🔍 Running SEO / AEO / GEO / HEO Pre-Launch Validation Script...\n');

// 1. Check siteConfig.js
const siteConfigPath = path.join(rootDir, 'src', 'seo', 'siteConfig.js');
if (!fs.existsSync(siteConfigPath)) {
  errors.push('CRITICAL: siteConfig.js does not exist at src/seo/siteConfig.js');
} else {
  const content = fs.readFileSync(siteConfigPath, 'utf-8');
  if (!content.includes('https://ellangala.com')) {
    errors.push('CRITICAL: siteConfig.js does not specify canonical production origin https://ellangala.com');
  }
}

// 2. Check Dynamic Sitemap XML Generator
try {
  const { getDynamicSitemapXml } = await import('../server/lib/sitemapGenerator.js');
  const { ensureSchema } = await import('../server/db/store.js');
  await ensureSchema();
  const dynamicXml = await getDynamicSitemapXml();

  if (dynamicXml.includes('localhost') || dynamicXml.includes('127.0.0.1')) {
    errors.push('CRITICAL: Dynamic sitemap contains localhost or local dev IP addresses.');
  }
  if (dynamicXml.includes('/admin') || dynamicXml.includes('/login') || dynamicXml.includes('/cart')) {
    errors.push('CRITICAL: Dynamic sitemap contains private or admin URLs (/admin, /login, /cart).');
  }
  if (!dynamicXml.includes('https://ellangala.com')) {
    errors.push('CRITICAL: Dynamic sitemap does not use production domain https://ellangala.com.');
  }
  console.log('  ✅ Dynamic sitemap XML generator validation passed.');
} catch (err) {
  errors.push(`CRITICAL: Failed to generate dynamic sitemap XML: ${err.message}`);
}

// 3. Check robots.txt
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  errors.push('CRITICAL: public/robots.txt does not exist.');
} else {
  const content = fs.readFileSync(robotsPath, 'utf-8');
  if (!content.includes('Sitemap: https://ellangala.com/sitemap.xml')) {
    warnings.push('WARNING: public/robots.txt is missing Sitemap directive pointing to https://ellangala.com/sitemap.xml');
  }
  if (!content.includes('Disallow: /admin')) {
    warnings.push('WARNING: public/robots.txt is missing Disallow directive for /admin/');
  }
}

// 4. Report Summary
console.log('--- SEO VALIDATION SUMMARY ---');
if (errors.length > 0) {
  console.error(`❌ FOUND ${errors.length} CRITICAL SEO ERRORS:`);
  errors.forEach(e => console.error(`  - ${e}`));
} else {
  console.log('✅ ZERO CRITICAL SEO ERRORS FOUND!');
}

if (warnings.length > 0) {
  console.warn(`⚠️ FOUND ${warnings.length} WARNINGS:`);
  warnings.forEach(w => console.warn(`  - ${w}`));
}

if (errors.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
