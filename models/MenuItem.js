const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Signature', 'Add ons', 'Non-Coffee', 'Espresso', 'Blended (Frappe)', 'Refreshers'],
    required: true,
  },
  image: {
    type: String, // URL or filename
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
