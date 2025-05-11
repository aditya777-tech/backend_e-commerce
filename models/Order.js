// const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true },
//   size: { type: String },
//   color: { type: String }
// });

// const orderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },

//   items: [orderItemSchema],

//   shippingInfo: {
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     country: { type: String, required: true }
//   },

//   paymentMethod: {
//     type: String,
//     enum: ['COD', 'Online'],
//     required: true
//   },

//   paymentStatus: {
//     type: String,
//     enum: ['Pending', 'Paid', 'Failed'],
//     default: 'Pending'
//   },

//   totalAmount: {
//     type: Number,
//     required: true
//   },

//   status: {
//     type: String,
//     enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
//     default: 'Processing'
//   }

// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);







// changes while payment integraion :


const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  size: { type: String },
  color: { type: String }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [orderItemSchema],

  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },

  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },

  razorpayOrderId: { // Add this field to store Razorpay order ID
    type: String,
    required: false
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);



