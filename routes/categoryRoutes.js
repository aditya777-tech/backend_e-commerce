const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { protect } = require('../middleware/authMiddleware');

const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.status(403).json({ message: 'Admin access only' });
};

router.get('/', getCategories);
router.post('/', protect, adminOnly, createCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
