import {
  getDbBlogs,
  getDbBlogBySlug,
  getDbBlogById,
  saveDbBlog,
  deleteDbBlog
} from '../db/store.js';
import { generateContentSeo } from '../lib/seoGenerator.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// Public: GET /api/blogs (Returns published blogs by default)
router.get('/blogs', async (req, res) => {
  const { status, all } = req.query;
  if (all === 'true' || status === 'all') {
    return res.json(await getDbBlogs());
  }
  const statusFilter = status || 'published';
  const blogs = (await getDbBlogs()).filter(b => b.status === statusFilter);
  res.json(blogs);
});

// Public: GET /api/blogs/:slug
router.get('/blogs/:slug', async (req, res) => {
  const { slug } = req.params;
  const blog = await getDbBlogBySlug(slug);

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
