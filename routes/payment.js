const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');

const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_BASE   = 'https://api.paymongo.com/v1';

// Helper — base64 encode for PayMongo auth
const authHeader = () =>
  'Basic ' + Buffer.from(PAYMONGO_SECRET + ':').toString('base64');

// POST /api/payment/gcash — create a GCash payment link
router.post('/gcash', async (req, res) => {
  try {
    const { orderId, amount, description } = req.body;

    // Amount must be in centavos (multiply by 100)
    const amountInCentavos = Math.round(amount * 100);

    const response = await fetch(`${PAYMONGO_BASE}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader(),
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount:      amountInCentavos,
            description: description || 'ESC Cafe Order',
            remarks:     `Order ID: ${orderId}`,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ message: 'PayMongo error', details: data });
    }

    const checkoutUrl = data.data.attributes.checkout_url;
    const linkId      = data.data.id;

    // Save payment link ID to order
    await Order.findByIdAndUpdate(orderId, { paymentIntentId: linkId });

    res.json({ checkoutUrl, linkId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payment/webhook — PayMongo webhook for payment confirmation
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = JSON.parse(req.body);
    const { type, data } = event.data.attributes;

    if (type === 'link.payment.paid') {
      const linkId = data.attributes.links[0];

      // Find order by paymentIntentId and mark as paid
      await Order.findOneAndUpdate(
        { paymentIntentId: linkId },
        { paymentStatus: 'paid', orderStatus: 'confirmed' }
      );
    }

    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
