import { blogContent } from '../../contents/blog.content.js';
import { adminAuthService } from './adminAuthService';

const API_BASE = '/api';
const STORAGE_KEY = 'ellangala_blogs';

function authHeaders() {
  const token = adminAuthService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function initialSeedBlogs() {
  return (blogContent.list?.posts || []).map(b => ({
    id: b.id,
    slug: b.slug || b.id,
    title: b.title,
    excerpt: b.excerpt || '',
    content: b.details?.text1 ? `${b.details.text1}\n\n${b.details.text2 || ''}\n\n${b.details.text3 || ''}` : b.excerpt,
    category: b.category || 'Positive Psychology',
    image: b.img || '/assets/images/blog/blog-mind-gym.png',
    author: b.author ? b.author.replace(/^By\s+/, '') : 'Dr. Naveen Ellangala',
    status: 'published',
    readTime: b.readTime || '8 Mins Read',
    details: b.details || null,
    seo: {
      title: `${b.title} | Ellangala’s Academy`,
      description: b.excerpt,
      image: b.img,
      noindex: false
    },
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
}

function getLocalBlogs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = initialSeedBlogs();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw);
  } catch {
    const seeded = initialSeedBlogs();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function saveLocalBlogs(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const blogService = {
  getBlogs() {
    return getLocalBlogs();
  },

  async getBlogsAsync() {
    try {
      const res = await fetch(`${API_BASE}/blogs?all=true`);
      if (res.ok) {
        const data = await res.json();
        saveLocalBlogs(data);
        return data;
      }
    } catch {
      // Fallback to local
    }
    return getLocalBlogs();
  },

  getPublishedBlogs() {
    const blogs = this.getBlogs();
    return blogs.filter(b => b.status === 'published');
  },

  getBlogById(id) {
    const blogs = this.getBlogs();
    return blogs.find(b => String(b.id) === String(id)) || null;
  },

  getBlogBySlug(slug) {
    const blogs = this.getBlogs();
    return blogs.find(b => b.slug === slug || String(b.id) === String(slug)) || null;
  },

  createBlog(data) {
    const blogs = this.getBlogs();
    const nextNum = blogs.length + 1;
    const year = new Date().getFullYear();
    const id = data.id || `BLOG-${year}-${String(nextNum).padStart(4, '0')}`;

    let slug = (data.slug || data.title || 'article')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (blogs.some(b => b.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newRecord = {
      ...data,
      id,
      slug,
      status: data.status || 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: data.status === 'published' ? new Date().toISOString() : null
    };

    const updated = [newRecord, ...blogs];
    saveLocalBlogs(updated);

    fetch(`${API_BASE}/admin/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(newRecord)
    }).catch(() => {});

    return newRecord;
  },

  updateBlog(id, data) {
    const blogs = this.getBlogs();
    const index = blogs.findIndex(b => String(b.id) === String(id));
    if (index === -1) return null;

    const updated = {
      ...blogs[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    blogs[index] = updated;
    saveLocalBlogs(blogs);

    fetch(`${API_BASE}/admin/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updated)
    }).catch(() => {});

    return updated;
  },

  deleteBlog(id) {
    const blogs = this.getBlogs();
    const filtered = blogs.filter(b => String(b.id) !== String(id));
    saveLocalBlogs(filtered);

    fetch(`${API_BASE}/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).catch(() => {});

    return true;
  },

  publishBlog(id) {
    return this.updateBlog(id, { status: 'published' });
  },

  unpublishBlog(id) {
    return this.updateBlog(id, { status: 'draft' });
  },

  archiveBlog(id) {
    return this.updateBlog(id, { status: 'archived' });
  }
};
