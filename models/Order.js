const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // allow guest orders
  },
  items:       [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['COD', 'GCash'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  },
  // For GCash via PayMongo
  paymentIntentId: { type: String, default: '' },
  referenceNumber: { type: String, default: '' },

  // Customer info for guest orders
  customerName:  { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
