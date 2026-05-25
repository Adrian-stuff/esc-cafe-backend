const express  = require('express');
const router   = express.Router();
const MenuItem = require('../models/MenuItem');

// POST /api/cart/validate
// Validates cart items against the database (prices, availability)
router.post('/validate', async (req, res) => {
  try {
    const { items } = req.body; // [{ menuItemId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);

      if (!menuItem) {
        return res.status(404).json({ message: `Item not found: ${item.menuItemId}` });
      }

      if (!menuItem.available) {
        return res.status(400).json({ message: `${menuItem.name} is no longer available` });
      }

      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;

      validatedItems.push({
        menuItem:  menuItem._id,
        name:      menuItem.name,
        price:     menuItem.price,
        quantity:  item.quantity,
        subtotal,
      });
    }

    res.json({ validatedItems, totalAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
