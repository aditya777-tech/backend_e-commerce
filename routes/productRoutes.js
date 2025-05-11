const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getBestSellers
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');

// Inline admin check middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else res.status(403).json({ message: 'Access denied' });
};

// Public routes
router.get('/', getProducts);
router.get('/category/:categoryName', getProductsByCategory);
router.get('/best-sellers', getBestSellers);
router.get('/:id', getProductById);


// Admin-only routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
