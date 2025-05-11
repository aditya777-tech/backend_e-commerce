const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  createBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.status(403).json({ message: 'Admin access only' });
};

// Public Routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin Routes
router.post('/', protect, adminOnly, createBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
