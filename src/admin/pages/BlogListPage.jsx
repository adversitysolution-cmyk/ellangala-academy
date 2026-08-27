import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import { blogService } from '../services/blogService';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Edit,
  Trash2,
  Globe,
  Eye
} from 'lucide-react';

export default function BlogListPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalId, setDeleteModalId] = useState(null);

  const loadBlogs = async () => {
    const list = await blogService.getBlogsAsync();
    setBlogs(list);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handlePublishToggle = (blog) => {
    if (blog.status === 'published') {
      blogService.unpublishBlog(blog.id);
    } else {
      blogService.publishBlog(blog.id);
    }
    loadBlogs();
  };

  const handleArchive = (id) => {
    blogService.archiveBlog(id);
    loadBlogs();
  };

  const handleDelete = (id) => {
    blogService.deleteBlog(id);
    setDeleteModalId(null);
    loadBlogs();
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = blogs.length;
  const publishedCount = blogs.filter(b => b.status === 'published').length;
  const draftCount = blogs.filter(b => b.status === 'draft').length;
  const archivedCount = blogs.filter(b => b.status === 'archived').length;

  return (
    <AdminLayout
      title="Blogs & Insights Management"
      subtitle="Publish articles, manage SEO meta descriptions, dynamic sitemap entries, and editorial content"
      actionSlot={
        <button
          type="button"
          onClick={() => navigate('/admin/blogs/new')}
          className="admin-btn admin-btn--primary"
        >
          <Plus size={18} /> Create Article
        </button>
      }
    >
      {/* Stat Summary Cards */}
      <div className="admin-grid admin-grid--4" style={{ marginBottom: '24px' }}>
        <StatCard title="Total Articles" value={totalCount} icon={FileText} color="blue" />
        <StatCard title="Published (Indexed)" value={publishedCount} icon={CheckCircle2} color="green" />
        <StatCard title="Drafts (Unindexed)" value={draftCount} icon={Clock} color="amber" />
        <StatCard title="Archived" value={archivedCount} icon={Archive} color="slate" />
      </div>

      {/* Table Container */}
      <div className="admin-card">
        {/* Filters & Search */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Search by article title, category, or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Blog Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Sitemap / SEO</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((b) => {
                  const isPublished = b.status === 'published';
                  const isNoindex = b.seo?.noindex;
                  const inSitemap = isPublished && !isNoindex;

                  return (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>
                          {b.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                          /insights/{b.slug}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569', backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px' }}>
                          {b.category}
                        </span>
                      </td>

                      <td style={{ fontSize: '13px', color: '#334155' }}>
                        {b.author || 'Dr. Naveen Ellangala'}
                      </td>

                      <td>
                        <StatusBadge status={b.status} />
                      </td>

                      <td>
                        {inSitemap ? (
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Globe size={12} /> In Sitemap
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>
                            {isNoindex ? 'Noindex' : 'Excluded'}
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <ActionMenu
                          actions={[
                            {
                              label: 'Edit Article',
                              icon: Edit,
                              onClick: () => navigate(`/admin/blogs/${b.id}/edit`)
                            },
                            {
                              label: isPublished ? 'Unpublish (Draft)' : 'Publish (Live)',
                              icon: isPublished ? Clock : CheckCircle2,
                              onClick: () => handlePublishToggle(b)
                            },
                            {
                              label: 'Archive',
                              icon: Archive,
                              onClick: () => handleArchive(b.id)
                            },
                            {
                              label: 'Delete',
                              icon: Trash2,
                              variant: 'danger',
                              onClick: () => setDeleteModalId(b.id)
                            }
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                    No blog posts found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}
        >
          <div className="admin-card" style={{ maxWidth: '400px', width: '90%' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '12px' }}>
              Confirm Article Deletion
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
              Are you sure you want to delete this blog post? It will be removed from public listings and the dynamic sitemap immediately.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                className="admin-btn admin-btn--secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteModalId)}
                className="admin-btn admin-btn--danger"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
