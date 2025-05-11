// const express = require('express');
// const router = express.Router();
// const {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   updateOrderStatus,
//   getAllOrders,
//   cancelOrder,
//   verifyPayment
// } = require('../controllers/orderController');

// const { protect } = require('../middleware/authMiddleware');

// const adminOnly = (req, res, next) => {
//   if (req.user?.isAdmin) next();
//   else res.status(403).json({ message: 'Admin access only' });
// };

// // Admin-only
// router.get('/admin/orders', protect, adminOnly, getAllOrders); 
// router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// // Authenticated routes
// router.post('/', protect, createOrder);
// router.get('/', protect, getMyOrders);
// router.get('/:id', protect, getOrderById);
// router.put('/:id/cancel', protect, cancelOrder);
// router.post('/payment/verify', protect, verifyPayment)



// module.exports = router;






const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  verifyPayment,       // <-- This is the old verification function
  webhookPaymentVerification // <-- Add this for Razorpay Webhook
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');

const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.status(403).json({ message: 'Admin access only' });
};

// Admin-only
router.get('/admin/orders', protect, adminOnly, getAllOrders); 
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// Authenticated routes
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// 🛡️ **Webhook route doesn't need `protect` middleware**
// It should be a raw body parser to handle Razorpay's payload
router.post(
  '/payment/verify',
  bodyParser.raw({ type: 'application/json' }), // <-- Razorpay requires raw JSON for HMAC verification
  webhookPaymentVerification
);

module.exports = router;

