const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect); // all routes require user login

// Shopping Cart Routes under /api/user
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart', updateCartItem);
router.delete('/cart/item/:itemId', removeCartItem);

module.exports = router;
