const Review = require('../models/Review');
const Product = require('../models/Product');


// @desc    Create a review
// @route   POST /api/products/:id/reviews
// @access  Private




// exports.createReview = async (req, res) => {
//   const { rating, comment } = req.body;
//   const productId = req.params.id;
  

//   try {
   
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const existing = await Review.findOne({ user: req.user._id, product: productId });
//     if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

//     const review = new Review({
//       user: req.user._id,
//       product: productId,
//       rating,
//       comment
//     });

//     const saved = await review.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create review' });
//   }
// };

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public




// just adding new feilds while creating products 





// @desc    Create a review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createReview = async (req, res) => {
  const { rating, comment, name, email } = req.body;  // Extract name and email from the body
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

    const review = new Review({
      user: req.user._id,   // User ID from authentication
      product: productId,
      rating,
      comment,
      name,   // Storing the name provided by the user
      email,  // Storing the email provided by the user
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};



//    Previous One

// exports.getProductReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch reviews' });
//   }
// };






//    New one with Pagination : ----------->

exports.getProductReviews = async (req, res) => {
  const productId = req.params.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const total = await Review.countDocuments({ product: productId });
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      reviews
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};


// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private (user who posted or admin)
exports.deleteReview = async (req, res) => {
    const { id: productId, reviewId } = req.params;
  
    try {
      const product = await Product.findById(productId);
      if (!product) {
       // console.log(' Product not found');
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const review = await Review.findById(reviewId);
      if (!review) {
       // console.log(' Review not found');
        return res.status(404).json({ message: 'Review not found' });
      }
  
      if (
        review.user.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
      ) {
       // console.log(' Not authorized');
        return res.status(403).json({ message: 'Not authorized to delete this review' });
      }
  
      await review.deleteOne();
     // console.log(' Review deleted');
      res.json({ message: 'Review deleted successfully' });
  
    } catch (err) {
      console.error(' Delete review error:', err);
      res.status(500).json({ message: 'Failed to delete review' });
    }
  };
  
