import { getDynamicSitemapXml, invalidateSitemapCache } from '../server/lib/sitemapGenerator.js';
import { ensureSchema, saveDbEvent, deleteDbEvent, saveDbBlog, deleteDbBlog } from '../server/db/store.js';

console.log('🧪 Starting Dynamic SEO & Dynamic Sitemap Automation Tests...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

try {
  await ensureSchema();
  // Test 1: Initial sitemap validity
  const initialXml = await getDynamicSitemapXml();
  assert(initialXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Sitemap starts with XML header');
  assert(initialXml.includes('<urlset'), 'Sitemap contains <urlset> tag');
  assert(!initialXml.includes('/admin'), 'Sitemap excludes /admin routes');
  assert(!initialXml.includes('/cart'), 'Sitemap excludes /cart routes');
  assert(!initialXml.includes('/checkout'), 'Sitemap excludes /checkout routes');

  // Test 2: Draft Event exclusion
  const draftEvent = await saveDbEvent({
    title: 'Automated Draft Event Test',
    slug: 'automated-draft-event-test',
    status: 'draft'
  });
  invalidateSitemapCache();
  const xmlAfterDraft = await getDynamicSitemapXml();
  assert(!xmlAfterDraft.includes('automated-draft-event-test'), 'Draft Event is EXCLUDED from sitemap');

  // Test 3: Published Event inclusion
  const publishedEvent = await saveDbEvent({
    title: 'Automated Live Event Test',
    slug: 'automated-live-event-test',
    status: 'published',
    shortDescription: 'Test event description for automated SEO test'
  });
  invalidateSitemapCache();
  const xmlAfterPublish = await getDynamicSitemapXml();
  assert(xmlAfterPublish.includes('https://ellangala.com/events/automated-live-event-test'), 'Published Event is INCLUDED in sitemap with canonical URL');

  // Test 4: Draft Blog exclusion
  const draftBlog = await saveDbBlog({
    title: 'Automated Draft Blog Test',
    slug: 'automated-draft-blog-test',
    status: 'draft'
  });
  invalidateSitemapCache();
  const xmlAfterDraftBlog = await getDynamicSitemapXml();
  assert(!xmlAfterDraftBlog.includes('automated-draft-blog-test'), 'Draft Blog is EXCLUDED from sitemap');

  // Test 5: Published Blog inclusion
  const publishedBlog = await saveDbBlog({
    title: 'Automated Live Blog Test',
    slug: 'automated-live-blog-test',
    status: 'published',
    excerpt: 'Test article excerpt for automated SEO test'
  });
  invalidateSitemapCache();
  const xmlAfterPublishBlog = await getDynamicSitemapXml();
  assert(xmlAfterPublishBlog.includes('https://ellangala.com/insights/automated-live-blog-test'), 'Published Blog is INCLUDED in sitemap with canonical URL');

  // Test 6: Unpublish / Delete invalidation
  await deleteDbEvent(publishedEvent.id);
  await deleteDbBlog(publishedBlog.id);
  await deleteDbEvent(draftEvent.id);
  await deleteDbBlog(draftBlog.id);
  invalidateSitemapCache();

  const xmlAfterCleanup = await getDynamicSitemapXml();
  assert(!xmlAfterCleanup.includes('automated-live-event-test'), 'Deleted Event is REMOVED from sitemap immediately');
  assert(!xmlAfterCleanup.includes('automated-live-blog-test'), 'Deleted Blog is REMOVED from sitemap immediately');

} catch (err) {
  console.error('Test execution error:', err);
  failed++;
}

console.log(`\n--- TEST SUMMARY ---`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL DYNAMIC SEO & SITEMAP TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
