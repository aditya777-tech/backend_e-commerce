const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/user/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

// POST /api/user/cart
exports.addToCart = async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (quantity > product.countInStock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      item =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.countInStock) {
        return res.status(400).json({ message: 'Exceeds available stock' });
      }
      existingItem.quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Add to cart failed' });
  }
};

// PUT /api/user/cart
exports.updateCartItem = async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(
      item =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (quantity > product.countInStock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    item.quantity = quantity;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Update cart item failed' });
  }
};

// DELETE /api/user/cart/item/:itemId
exports.removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Remove cart item failed' });
  }
};
