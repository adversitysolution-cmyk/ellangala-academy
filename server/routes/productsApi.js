import {
  getDbProducts,
  getDbProductById,
  saveDbProduct,
  deleteDbProduct
} from '../db/store.js';
import { shopContent } from '../../src/contents/shop.content.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// Public: GET /api/products (Returns published products by default)
router.get('/products', async (req, res) => {
  const { status, all } = req.query;
  let dbProducts = [];
  try {
    dbProducts = await getDbProducts();
  } catch (_) {}

  const staticProducts = (shopContent.shop?.products || []).map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category || 'BOOKS',
    author: p.author || 'Dr. Naveen Ellangala',
    language: p.language || '',
    type: p.type || '',
    theme: p.theme || '',
    price: p.price || '',
    originalPrice: p.originalPrice || '',
    numericPrice: p.numericPrice || null,
    discount: p.discount || '',
    image: p.image || p.img || '',
    img: p.image || p.img || '',
    alt: p.alt || p.title,
    description: p.description || '',
    highlights: p.highlights || [],
    sale: Boolean(p.sale),
    inStock: p.inStock !== undefined ? p.inStock : true,
    stock: p.stock ?? (p.inStock === false ? 0 : null),
    status: 'published'
  }));

  const allMerged = [];
  const seen = new Set();

  for (const p of dbProducts) {
    allMerged.push(p);
    seen.add(p.id);
  }

  for (const sp of staticProducts) {
    if (!seen.has(sp.id)) {
      allMerged.push(sp);
      seen.add(sp.id);
    }
  }

  if (all === 'true' || status === 'all') {
    return res.json(allMerged);
  }
  const statusFilter = status || 'published';
  const filtered = allMerged.filter(p => (p.status || 'published') === statusFilter);
  res.json(filtered);
});

// Public: GET /api/products/:id
router.get('/products/:id', async (req, res) => {
  let product = null;
  try {
    product = await getDbProductById(req.params.id);
  } catch (_) {}

  if (!product) {
    product = (shopContent.shop?.products || []).find(
      (p) => p.id === req.params.id || String(p.id) === String(req.params.id)
    ) || null;
  }

  if (!product) return res.status(404).json({ error: 'Product not found' });

  if (product.status && product.status !== 'published' && req.query.admin !== 'true') {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Admin: POST /api/admin/products
router.post('/admin/products', async (req, res) => {
  try {
    const newRecord = await saveDbProduct(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: PUT /api/admin/products/:id
router.put('/admin/products/:id', async (req, res) => {
  try {
    const updated = await saveDbProduct({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: DELETE /api/admin/products/:id
router.delete('/admin/products/:id', async (req, res) => {
  const success = await deleteDbProduct(req.params.id);
  if (success) {
    res.json({ success: true, message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

export default router;
