import {
  getDbBlogs,
  getDbBlogBySlug,
  getDbBlogById,
  saveDbBlog,
  deleteDbBlog
} from '../db/store.js';
import { blogContent } from '../../src/contents/blog.content.js';
import { generateContentSeo } from '../lib/seoGenerator.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// Public: GET /api/blogs (Returns published blogs by default)
router.get('/blogs', async (req, res) => {
  const { status, all } = req.query;
  let dbBlogs = [];
  try {
    dbBlogs = await getDbBlogs();
  } catch (_) {}

  const staticBlogs = (blogContent.list?.posts || []).map((b) => ({
    id: b.id,
    slug: b.slug || b.id,
    title: b.title,
    excerpt: b.excerpt || '',
    content: b.details?.text1 ? `${b.details.text1}\n\n${b.details.text2 || ''}\n\n${b.details.text3 || ''}` : b.excerpt,
    category: b.category || 'Positive Psychology',
    image: b.image || b.img || '/assets/images/blog/blog-mind-gym.png',
    author: b.author ? b.author.replace(/^By\s+/, '') : 'Dr. Naveen Ellangala',
    status: 'published',
    readTime: b.readTime || '8 Mins Read',
    details: b.details || null,
    seo: { title: `${b.title} | Ellangala’s Academy`, description: b.excerpt, image: b.image || b.img || '/assets/images/blog/blog-mind-gym.png', noindex: false }
  }));

  const allMerged = [];
  const seen = new Set();

  for (const b of dbBlogs) {
    allMerged.push(b);
    seen.add(b.id);
    if (b.slug) seen.add(b.slug);
  }

  for (const sb of staticBlogs) {
    if (!seen.has(sb.id) && !seen.has(sb.slug)) {
      allMerged.push(sb);
      seen.add(sb.id);
      seen.add(sb.slug);
    }
  }

  if (all === 'true' || status === 'all') {
    return res.json(allMerged);
  }
  const statusFilter = status || 'published';
  const blogs = allMerged.filter(b => (b.status || 'published') === statusFilter);
  res.json(blogs);
});

// Public: GET /api/blogs/:slug
router.get('/blogs/:slug', async (req, res) => {
  const { slug } = req.params;
  let blog = null;
  try {
    blog = await getDbBlogBySlug(slug);
  } catch (_) {}

  if (!blog) {
    const match = (blogContent.list?.posts || []).find(
      (b) => b.slug === slug || b.id === slug || String(b.id) === String(slug)
    );
    if (match) {
      blog = {
        id: match.id,
        slug: match.slug || match.id,
        title: match.title,
        excerpt: match.excerpt || '',
        content: match.details?.text1 ? `${match.details.text1}\n\n${match.details.text2 || ''}\n\n${match.details.text3 || ''}` : match.excerpt,
        category: match.category || 'Positive Psychology',
        image: match.image || match.img || '/assets/images/blog/blog-mind-gym.png',
        author: match.author ? match.author.replace(/^By\s+/, '') : 'Dr. Naveen Ellangala',
        status: 'published',
        readTime: match.readTime || '8 Mins Read',
        details: match.details || null,
        seo: { title: `${match.title} | Ellangala’s Academy`, description: match.excerpt, image: match.image || match.img || '/assets/images/blog/blog-mind-gym.png', noindex: false }
      };
    }
  }

  if (!blog) {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  if (blog.status !== 'published' && req.query.admin !== 'true') {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  const generatedSeo = generateContentSeo({
    type: 'blog',
    title: blog.title,
    slug: blog.slug,
    description: blog.excerpt,
    image: blog.image,
    customSeo: blog.seo
  });

  res.json({
    ...blog,
    seo: generatedSeo
  });
});

// Admin: POST /api/admin/blogs
router.post('/admin/blogs', async (req, res) => {
  try {
    const newRecord = await saveDbBlog(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: PUT /api/admin/blogs/:id
router.put('/admin/blogs/:id', async (req, res) => {
  try {
    const updated = await saveDbBlog({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: DELETE /api/admin/blogs/:id
router.delete('/admin/blogs/:id', async (req, res) => {
  const success = await deleteDbBlog(req.params.id);
  if (success) {
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } else {
    res.status(404).json({ error: 'Blog post not found' });
  }
});

// Admin: PATCH /api/admin/blogs/:id/publish
router.patch('/admin/blogs/:id/publish', async (req, res) => {
  const existing = await getDbBlogById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Blog post not found' });

  const updated = await saveDbBlog({ ...existing, status: 'published' });
  res.json(updated);
});

// Admin: PATCH /api/admin/blogs/:id/unpublish
router.patch('/admin/blogs/:id/unpublish', async (req, res) => {
  const existing = await getDbBlogById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Blog post not found' });

  const updated = await saveDbBlog({ ...existing, status: 'draft' });
  res.json(updated);
});

export default router;
