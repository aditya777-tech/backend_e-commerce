const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  handle: { type: String, required: true, unique: true },
  title: { type: String, required: true },

  price: {
    type: Number,
    required: true
  },

  images: [
    {
      main: { type: String, required: true },
      hover: { type: String }
    }
  ],

  gallery: {
    type: [String], // array of URLs
    default: []
  },

  description: { type: String },

  parentCategory: {
    type: String,
    required: true // e.g., 'Men', 'Women'
  },

  category: {
    type: String,
    required: true
  },


  tags: [String],
  countInStock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  sizes: [String],
  colors: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
