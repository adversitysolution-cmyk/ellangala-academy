import {
  getDbProducts,
  getDbProductById,
  saveDbProduct,
  deleteDbProduct
} from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// Public: GET /api/products (Returns published products by default)
router.get('/products', async (req, res) => {
  const { status, all } = req.query;
  if (all === 'true' || status === 'all') {
    return res.json(await getDbProducts());
  }
  res.json(await getDbProducts({ status: status || 'published' }));
});

// Public: GET /api/products/:id
router.get('/products/:id', async (req, res) => {
  const product = await getDbProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  if (product.status !== 'published' && req.query.admin !== 'true') {
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
