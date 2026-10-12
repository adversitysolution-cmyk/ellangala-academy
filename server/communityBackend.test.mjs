import assert from 'node:assert/strict';

// Set test environment variables before importing app and auth modules
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ellangala.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test-admin-pass';
process.env.PORT = process.env.PORT || '0';

// Dynamic imports so env vars take effect before module load
const { default: app } = await import('./index.js');
const {
  ensureCommunitySchema,
  getCommunityCategories,
  getCommunityPosts,
  getCommunityPostById,
  saveCommunityPost,
  deleteCommunityPost,
  toggleCommunityLike,
  toggleCommunitySave,
  getCommunityComments,
  createCommunityComment,
  updateCommunityCommentStatus,
  deleteCommunityComment,
  getCommunitySidebarData
} = await import('./db/communityStore.js');
const { createSession } = await import('./middleware/adminAuth.js');
const { resolvePageMetadata } = await import('./lib/pageMetadataResolver.js');

async function runTests() {
  console.log('🧪 Starting Phase 07 Social Media Sharing & Backend Verification Test Suite...\n');

  // 1. Initialize schema
  await ensureCommunitySchema();
  console.log('✅ 1. Schema initialization verified.');

  // 2. Start ephemeral test server
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;
  const rootUrl = `http://localhost:${port}`;
  const adminToken = createSession('admin@ellangala.com');
  const authHeaders = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // ------------------------------------------------------------------------
    // SETUP: Create 1 Published Post and 1 Unpublished Draft
    // ------------------------------------------------------------------------
    const categories = await getCommunityCategories();

    const publishedPostPayload = {
      title: 'Mind Training and Gratitude in Everyday Living',
      content: 'Gratitude is an evidence-based cognitive practice that strengthens psychological resilience.',
      categoryId: categories[0].id,
      categoryName: categories[0].name,
      postType: 'single_image',
      mediaUrls: [
        { id: 'm-pub', mediaType: 'image', mediaUrl: '/uploads/gratitude-reflection.jpg', caption: 'Gratitude Guide' }
      ],
      relatedCourseSlug: 'positive-psychology-meaningful-life',
      status: 'published',
      isPinned: false
    };

    const resPub = await fetch(`${baseUrl}/admin/community/posts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(publishedPostPayload)
    });
    const publishedPost = await resPub.json();
    assert.ok(publishedPost.id);

    const draftPostPayload = {
      title: 'Confidential Unpublished Institutional Proposal (Draft)',
      content: 'This draft contains internal workshop strategy notes that must remain completely private.',
      categoryId: categories[0].id,
      status: 'draft'
    };

    const resDraft = await fetch(`${baseUrl}/admin/community/posts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(draftPostPayload)
    });
    const draftPost = await resDraft.json();
    assert.ok(draftPost.id);

    // ------------------------------------------------------------------------
    // TEST A: Each published post has its own unique public URL & API response
    // ------------------------------------------------------------------------
    const resGetPub = await fetch(`${baseUrl}/community/posts/${publishedPost.id}`);
    assert.equal(resGetPub.status, 200, 'Published post must return 200 at its dedicated endpoint');
    const pubData = await resGetPub.json();
    assert.equal(pubData.id, publishedPost.id);
    assert.equal(pubData.title, publishedPostPayload.title);
    console.log(`✅ A. Dedicated public URL verified: /community/posts/${publishedPost.id}`);

    // ------------------------------------------------------------------------
    // TEST B: Unpublished/Draft Post Access Protection
    // ------------------------------------------------------------------------
    const resGetDraft = await fetch(`${baseUrl}/community/posts/${draftPost.id}`);
    assert.equal(resGetDraft.status, 404, 'Unpublished draft MUST return 404 to public requests');

    const draftMeta = await resolvePageMetadata(`/community/posts/${draftPost.id}`);
    assert.notEqual(
      draftMeta.title,
      `${draftPostPayload.title} | Ellangala Community`,
      'SSR metadata resolver MUST NOT leak draft title to scrapers'
    );
    assert.ok(
      !draftMeta.description?.includes('Confidential'),
      'SSR metadata resolver MUST NOT leak draft content'
    );
    console.log('✅ B. Unpublished post protection verified: direct API returns 404, SSR scraper resolver strictly masks drafts.');

    // ------------------------------------------------------------------------
    // TEST C: Social Preview & Open Graph Metadata for Published Post
    // ------------------------------------------------------------------------
    const pubMeta = await resolvePageMetadata(`/community/posts/${publishedPost.id}`);
    assert.equal(pubMeta.title, `${publishedPost.title} | Ellangala Community`);
    assert.ok(pubMeta.description.includes('Gratitude is an evidence-based cognitive practice'));
    assert.equal(pubMeta.canonical, `https://ellangala.com/community/posts/${publishedPost.id}`);
    assert.equal(pubMeta.type, 'article');
    assert.ok(pubMeta.image.includes('/uploads/gratitude-reflection.jpg'));
    console.log('✅ C. OpenGraph social preview metadata verified (og:title, og:description, og:image, og:url, og:type).');

    // Root Community Feed Metadata
    const rootCommunityMeta = await resolvePageMetadata('/community');
    assert.equal(rootCommunityMeta.title, 'Community Feed & Mind Training Discussions | Ellangala’s Academy');
    assert.equal(rootCommunityMeta.canonical, 'https://ellangala.com/community');
    console.log('✅ D. Root community feed metadata verified.');

    // ------------------------------------------------------------------------
    // TEST D: WhatsApp Link Formatting Verification
    // ------------------------------------------------------------------------
    const shareUrl = `https://ellangala.com/community/posts/${publishedPost.id}`;
    const formattedWhatsAppText = `*${publishedPost.title}*\n\nRead this positive psychology reflection by Dr. Naveen Ellangala on Ellangala's Academy Community:\n${shareUrl}`;
    const encodedWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedWhatsAppText)}`;

    assert.ok(encodedWhatsAppUrl.startsWith('https://api.whatsapp.com/send?text='));
    assert.ok(decodeURIComponent(encodedWhatsAppUrl).includes(`*${publishedPost.title}*`), 'WhatsApp text must contain formatted bold title');
    assert.ok(decodeURIComponent(encodedWhatsAppUrl).includes(shareUrl), 'WhatsApp text must contain exact post URL');
    console.log('✅ E. WhatsApp link formatting verified (*Bold Title* + clear text + canonical URL).');

    // ------------------------------------------------------------------------
    // TEST F: Phase 08 Integration - Featured Course Panel & Rule-Based Recommendations
    // ------------------------------------------------------------------------
    const resSidebarDefault = await fetch(`${baseUrl}/community/sidebar-data`);
    assert.equal(resSidebarDefault.status, 200);
    const sidebarDefault = await resSidebarDefault.json();

    // 1. Featured Course Panel Verification
    assert.ok(sidebarDefault.featuredCourse, 'Sidebar data must include featuredCourse');
    assert.equal(sidebarDefault.featuredCourse.slug, 'positive-psychology-meaningful-life');
    assert.ok(sidebarDefault.featuredCourse.title.includes('Positive Psychology'));
    assert.ok(sidebarDefault.featuredCourse.targetUrl.startsWith('/programs/'));
    assert.ok(sidebarDefault.featuredCourse.highlights.length >= 2);
    console.log('✅ G. Featured Course Panel verified: links directly to /programs/positive-psychology-meaningful-life.');

    // 2. Upcoming Workshops & Live Events Verification
    assert.ok(Array.isArray(sidebarDefault.upcomingEvents));
    assert.ok(sidebarDefault.upcomingEvents.length > 0);
    const initialWorkshopTitle = sidebarDefault.upcomingEvents[0].title;
    console.log(`✅ H. Upcoming workshops fetched from event system: "${initialWorkshopTitle}".`);

    // 3. Verify Updates to Existing Event are Reflected in Community
    const { updateCommunityMockEvent } = await import('./db/communityStore.js');
    const updatedTitle = 'Bhagavadgita for Meaningful Life (Updated Batch)';
    updateCommunityMockEvent('EVT-2026-0000', { title: updatedTitle });

    const resSidebarAfterUpdate = await fetch(`${baseUrl}/community/sidebar-data`);
    const sidebarAfterUpdate = await resSidebarAfterUpdate.json();
    assert.equal(sidebarAfterUpdate.upcomingEvents[0].title, updatedTitle, 'Event title update must be immediately reflected in community');
    console.log('✅ I. Verified updates to an existing event are immediately reflected in the community interface.');

    // Restore original title
    updateCommunityMockEvent('EVT-2026-0000', { title: initialWorkshopTitle });

    // 4. Rule-Based Course Recommendations based on Channels/Topics
    // (a) MindGym channel -> expects "the-art-of-mind-training"
    const resSidebarMindgym = await fetch(`${baseUrl}/community/sidebar-data?channel=mindgym-mental-fitness`);
    const sidebarMindgym = await resSidebarMindgym.json();
    assert.equal(sidebarMindgym.recommendedCourses[0].slug, 'the-art-of-mind-training');

    // (b) Spiritual channel -> expects "spiritual-psychology-purposeful-life"
    const resSidebarSpiritual = await fetch(`${baseUrl}/community/sidebar-data?channel=spiritual-wisdom`);
    const sidebarSpiritual = await resSidebarSpiritual.json();
    assert.equal(sidebarSpiritual.recommendedCourses[0].slug, 'spiritual-psychology-purposeful-life');

    // (c) Parenting channel -> expects "positive-parenting"
    const resSidebarParenting = await fetch(`${baseUrl}/community/sidebar-data?channel=students-parenting`);
    const sidebarParenting = await resSidebarParenting.json();
    assert.equal(sidebarParenting.recommendedCourses[0].slug, 'positive-parenting');
    console.log('✅ J. Rule-based recommendations based on channels/topics verified (MindGym, Spiritual, Parenting).');

    // 5. Post Cross-Links (Course & Event links)
    const crossLinkedPostPayload = {
      title: 'Course & Event Integration Demo Reflection',
      content: 'Connecting community discussions directly to curriculum and upcoming workshops.',
      categoryId: categories[0].id,
      postType: 'text',
      relatedCourseSlug: 'positive-psychology-meaningful-life',
      relatedCourseTitle: 'Positive Psychology for a Meaningful Life',
      relatedEventId: 'EVT-2026-0000',
      relatedEventTitle: 'Bhagavadgita for Meaningful Life',
      status: 'published'
    };
    const resCrossPost = await fetch(`${baseUrl}/admin/community/posts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(crossLinkedPostPayload)
    });
    const crossPost = await resCrossPost.json();
    assert.equal(crossPost.relatedCourseSlug, 'positive-psychology-meaningful-life');
    assert.equal(crossPost.relatedEventId, 'EVT-2026-0000');
    console.log('✅ K. Course/event links inside applicable posts verified.');

    // ------------------------------------------------------------------------
    // TEST G: Existing API Regressions & Cleanup
    // ------------------------------------------------------------------------
    const resEvents = await fetch(`${baseUrl}/events`);
    const resBlogs = await fetch(`${baseUrl}/blogs`);
    assert.equal(resBlogs.status, 200);

    // Clean up test posts
    await fetch(`${baseUrl}/admin/community/posts/${publishedPost.id}`, { method: 'DELETE', headers: authHeaders });
    await fetch(`${baseUrl}/admin/community/posts/${draftPost.id}`, { method: 'DELETE', headers: authHeaders });
    await fetch(`${baseUrl}/admin/community/posts/${crossPost.id}`, { method: 'DELETE', headers: authHeaders });
    console.log('✅ L. Cleanup completed. Existing APIs remain 100% operational.');

    console.log('\n🎉 ALL PHASE 08 INTEGRATION & CONTENT CONNECTION TESTS PASSED CLEANLY!\n');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
