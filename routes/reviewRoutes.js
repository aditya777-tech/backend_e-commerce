const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createReview,
  getProductReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get all reviews for a product
router.get('/:id/reviews', getProductReviews);

// Post a review (logged-in users only)
router.post('/:id/reviews', protect, createReview);

// Delete a review (only author or admin)
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

module.exports = router;
