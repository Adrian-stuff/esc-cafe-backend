const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/menu',    require('./routes/menu'));
app.use('/api/orders',  require('./routes/orders'));
app.use('/api/cart',    require('./routes/cart'));
app.use('/api/payment', require('./routes/payment'));

// ── Health check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'ESC Cafe API is running ☕' });
});

// ── Connect to MongoDB + Start server ────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });