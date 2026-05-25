const express    = require('express');
const router     = express.Router();
const MenuItem   = require('../models/MenuItem');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/menu — get all available menu items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { available: true };
    if (category) filter.category = category;
    const items = await MenuItem.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/menu/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/menu — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/menu/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/menu/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
