const Product = require('../models/Product');

// @desc    Get all products (with search + sorting)
exports.getProducts = async (req, res) => {
  try {
    const keyword = req.query.search || '';
    const sortBy = req.query.sort || 'newest';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = {
      $and: [
        {
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { handle: { $regex: keyword, $options: 'i' } }
          ]
        }
      ]
    };

    //  Added support for parentCategory and category filtering
    if (req.query.parentCategory) {
      filters.$and.push({ parentCategory: req.query.parentCategory });
    }
    if (req.query.category) {
      filters.$and.push({ category: req.query.category });
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'price-asc') sortOption = { price: 1 };
    if (sortBy === 'price-desc') sortOption = { price: -1 };
    if (sortBy === 'oldest') sortOption = { createdAt: 1 };

    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select('id handle title price images');

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// @desc    Create a new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Product creation failed', error: err.message });
  }
};

// @desc    Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// @desc    Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// @desc    Get products by category
// @desc Get products by category (string-based)
// exports.getProductsByCategory = async (req, res) => {
//   try {
//     const parent = req.query.parentCategory; //  Added
//     const sub = req.params.categoryName;

//     const query = parent
//       ? { parentCategory: parent, category: sub } //  Combined filtering
//       : { category: sub }; //  Default behavior if parent not provided

//     const products = await Product.find(query);
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching products by category' });
//   }
// };

  

// modified getProductsbyCategories with more features :





exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const keyword = req.query.search || '';
    const sortBy = req.query.sort || 'newest';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const searchFilter = {
      category: categoryName,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { handle: { $regex: keyword, $options: 'i' } }
      ]
    };

    let sortOption = { createdAt: -1 }; // default newest first
    if (sortBy === 'price-asc') sortOption = { price: 1 };
    if (sortBy === 'price-desc') sortOption = { price: -1 };
    if (sortBy === 'oldest') sortOption = { createdAt: 1 };

    const total = await Product.countDocuments(searchFilter);
    const products = await Product.find(searchFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select('id handle title price images');

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
};



  // to get best seller 

  exports.getBestSellers = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 4;
  
      const bestSellers = await Product.find()
        .sort({ sold: -1, createdAt: -1 }) // Descending by sold, then newest first
        .limit(limit);
  
      res.json(bestSellers);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch best sellers' });
    }
  };
  
