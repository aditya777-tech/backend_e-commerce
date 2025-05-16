const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const Razorpay = require("razorpay");
const dotenv = require("dotenv");
// const Product = require('../models/Product');
// const Order = require('../models/Order');
// const Cart = require('../models/Cart');
dotenv.config();  // Load environment variables
const crypto = require('crypto');


// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Your Razorpay key ID
  key_secret: process.env.RAZORPAY_SECRET,  // Your Razorpay key secret
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (User)

//             :--------------> changes related to cart system new ones where count in stock is changed after the order is created  <----------------------:


// exports.createOrder = async (req, res) => {
//   const { items, shippingInfo, fromCart, paymentMethod } = req.body;

//   if (!items || items.length === 0) {
//     return res.status(400).json({ message: 'No order items provided' });
//   }

//   try {
//     let totalAmount = 0;
//     const outOfStockItems = [];
//     const lowStockItems = [];

//     // Check each item in the cart
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res.status(404).json({ message: `Product not found: ${item.product}` });
//       }

//       // If the product is out of stock
//       if (product.countInStock === 0) {
//         outOfStockItems.push({ product: product.title, stock: product.countInStock });
//         continue; // Skip this item, don't add to order
//       }

//       // If the product is in low stock, adjust the quantity to match the available stock
//       if (product.countInStock < item.quantity) {
//         lowStockItems.push({ product: product.title, availableStock: product.countInStock });
//         item.quantity = product.countInStock; // Adjust quantity to available stock
//       }

//       totalAmount += product.price * item.quantity;
//     }

//     // If there are any out-of-stock or low-stock items, notify the user
//     if (outOfStockItems.length > 0 || lowStockItems.length > 0) {
//       return res.status(400).json({
//         message: 'Some items in your cart are unavailable or have limited stock.',
//         outOfStockItems,
//         lowStockItems
//       });
//     }

//     // Create new order only if all items are available and quantities adjusted
//     const order = new Order({
//       user: req.user._id,
//       items,
//       shippingInfo,
//       paymentMethod, 
//       paymentStatus:'Pending', // we set status to pending before payment.
//     //  paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
//       totalAmount
//     });

//     const createdOrder = await order.save();

//     // Reduce stock for each item only after order creation
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (product) {
//         product.countInStock -= item.quantity; // Reduce stock
//         product.sold += item.quantity; // Increase sold count
//         await product.save();
//       }
//     }

//     // Clear cart only if the order was placed from the cart
//     if (fromCart) {
//       await Cart.findOneAndUpdate(
//         { user: req.user._id },
//         { $set: { items: [] } }
//       );
//     }

//     res.status(201).json(createdOrder);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create order', error: err.message });
//   }
// };




// the one above is fully functional , this one contains payment integration

// exports.createOrder = async (req, res) => {
//   const { items, shippingInfo, fromCart, paymentMethod } = req.body;

//   if (!items || items.length === 0) {
//     return res.status(400).json({ message: 'No order items provided' });
//   }

//   try {
//     let totalAmount = 0;
//     const outOfStockItems = [];
//     const lowStockItems = [];

//     // Step 1: Check inventory, calculate total amount, and adjust stock
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res.status(404).json({ message: `Product not found: ${item.product}` });
//       }

//       // If the product is out of stock
//       if (product.countInStock === 0) {
//         outOfStockItems.push({ product: product.title, stock: product.countInStock });
//         continue; // Skip this item, don't add to order
//       }

//       // If the product is in low stock, adjust the quantity to match the available stock
//       if (product.countInStock < item.quantity) {
//         lowStockItems.push({ product: product.title, availableStock: product.countInStock });
//         item.quantity = product.countInStock; // Adjust quantity to available stock
//       }

//       totalAmount += product.price * item.quantity;
//     }

//     // If there are any out-of-stock or low-stock items, notify the user
//     if (outOfStockItems.length > 0 || lowStockItems.length > 0) {
//       return res.status(400).json({
//         message: 'Some items in your cart are unavailable or have limited stock.',
//         outOfStockItems,
//         lowStockItems
//       });
//     }

//     // Step 2: Create order record (initially marked as 'Pending')
//     const order = new Order({
//       user: req.user._id,
//       items,
//       shippingInfo,
//       paymentMethod,
//       paymentStatus: 'Pending', // Set status to Pending until payment is verified
//       totalAmount
//     });

//     const createdOrder = await order.save();

//     // Step 3: Create Razorpay order
//     const options = {
//       amount: totalAmount * 100,  // Convert amount to paise
//       currency: "INR",
//       receipt: createdOrder._id.toString(),
//       payment_capture: 1,  // Auto-capture after payment
//     };

//     razorpayInstance.orders.create(options, async (err, razorpayOrder) => {
//       if (err) {
//         return res.status(500).json({ message: "Failed to create Razorpay order", error: err });
//       }

//       // Save Razorpay order ID to the database to link with the order
//       createdOrder.paymentStatus = 'Pending';
//       createdOrder.paymentOrderId = razorpayOrder.id;
//       await createdOrder.save();

//       // Step 4: Return Razorpay order details to the frontend
//       res.status(200).json({ order: createdOrder, razorpayOrder });
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create order', error: err.message });
//   }
// };






// apparently   razorpay order id 


exports.createOrder = async (req, res) => {
  const { items, shippingInfo, fromCart, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }

  try {
    let totalAmount = 0;
    const outOfStockItems = [];
    const lowStockItems = [];

    // Step 1: Check inventory, calculate total amount, and adjust stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      // If the product is out of stock
      if (product.countInStock === 0) {
        outOfStockItems.push({ product: product.title, stock: product.countInStock });
        continue; // Skip this item, don't add to order
      }

      // If the product is in low stock, adjust the quantity to match the available stock
      if (product.countInStock < item.quantity) {
        lowStockItems.push({ product: product.title, availableStock: product.countInStock });
     // right now there is no point of changing the quantity of items since order wont be created anyway , until user sends valid quantities of particular items.
      //  item.quantity = product.countInStock;
      }

      totalAmount += product.price * item.quantity;
    }

    // If there are any out-of-stock or low-stock items, notify the user
    if (outOfStockItems.length > 0 || lowStockItems.length > 0) {
      return res.status(400).json({
        message: 'Some items in your cart are unavailable or have limited stock.',
        outOfStockItems,
        lowStockItems
      });
    }

    // Step 2: Create order record (initially marked as 'Pending')
    const order = new Order({
      user: req.user._id,
      items,
      shippingInfo,
      paymentMethod,
      paymentStatus: 'Pending', // Set status to Pending until payment is verified
      totalAmount
    });

    const createdOrder = await order.save();

    // Step 3: Create Razorpay order
    const options = {
      amount: totalAmount * 100,  // Convert amount to paise
      currency: "INR",
      receipt: createdOrder._id.toString(),
      payment_capture: 1,  // Auto-capture after payment
    };

    razorpayInstance.orders.create(options, async (err, razorpayOrder) => {
      if (err) {
        return res.status(500).json({ message: "Failed to create Razorpay order", error: err });
      }

      // Step 4: Save Razorpay order ID to the database to link with the order
      createdOrder.paymentStatus = 'Pending';
      createdOrder.razorpayOrderId = razorpayOrder.id; // Save Razorpay order ID
      await createdOrder.save();


      // for (const item of items) {
      //   const product = await Product.findById(item.product);
      //   if (product) {
      //     product.countInStock -= item.quantity;  // Decrease the stock
      //     await product.save();  // Save the updated product stock
      //   }
      // }

      // Step 5: Return Razorpay order details to the frontend
      res.status(200).json({ order: createdOrder, razorpayOrder });
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};






// verifying the order 




// exports.verifyPayment = async (req, res) => {
//   const { payment_id, order_id, signature } = req.body;

//   if (!payment_id || !order_id || !signature) {
//     return res.status(400).json({ message: "Missing required parameters" });
//   }

//   const secret = process.env.RAZORPAY_SECRET; // Razorpay secret key

//   // Generate signature from the Razorpay order ID and payment ID
//   const crypto = require("crypto");
//   const hmac = crypto.createHmac("sha256", secret);
//   hmac.update(order_id + "|" + payment_id);
//   const generatedSignature = hmac.digest("hex");

//   if (generatedSignature === signature) {
//     try {
//       const order = await Order.findById(order_id);

//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }

//       // Update order status to 'Paid'
//       order.paymentStatus = "Paid";
//       await order.save();

//       // If the order was from cart, clear the cart
//       if (order.paymentStatus === 'Paid') {
//         await Cart.findOneAndUpdate(
//           { user: order.user },
//           { $set: { items: [] } } // Clear the cart after successful payment
//         );
//       }

//       res.status(200).json({ message: "Payment successful! Order status updated to Paid." });
//     } catch (err) {
//       res.status(500).json({ message: "Failed to update order status", error: err.message });
//     }
//   } else {
//     res.status(400).json({ message: "Payment verification failed!" });
//   }
// };




// debugging :

// Payment verification endpoint on the backend
// exports.verifyPayment = async (req, res) => {
//   const { payment_id, order_id, signature } = req.body;

//   if (!payment_id || !order_id || !signature) {
//     return res.status(400).json({ message: "Missing required parameters" });
//   }

//   const secret = process.env.RAZORPAY_SECRET; // Razorpay secret key

//   // Generate signature from Razorpay order ID and payment ID
//   const crypto = require("crypto");
//   const hmac = crypto.createHmac("sha256", secret);
//   hmac.update(order_id + "|" + payment_id);
//   const generatedSignature = hmac.digest("hex");

//   console.log("Generated Signature:", generatedSignature); // Log the generated signature
//   console.log("Received Signature:", signature); // Log the received signature

//   if (generatedSignature === signature) {
//     try {
//       const order = await Order.findOne({ razorpayOrderId: order_id }); // Fetch by razorpayOrderId instead of _id

//       if (!order) {
//         return res.status(404).json({ message: `Order with ID ${order_id} not found.` });
//       }

//       // Update the payment status and mark the order as 'Paid'
//       order.paymentStatus = "Paid";
//       await order.save();

//       console.log("Order updated to Paid:", order);


//       // modifying stock after payment verification :



//       for (const item of order.items) {
//         const product = await Product.findById(item.product); // Get the product details

//         if (product) {
//           // Reduce the stock based on the quantity in the order
//           product.countInStock -= item.quantity;
//           await product.save(); // Save the updated product
//           console.log(`Product stock updated for ${product.title}: ${product.countInStock}`);
//         }
//       }



      

//       // Clear cart if the order is placed from the cart
//       if (order.paymentStatus === "Paid") {
//         await Cart.findOneAndUpdate(
//           { user: order.user },
//           { $set: { items: [] } } // Clear cart
//         );
//         console.log("Cart cleared after payment");
//       }

//       res.status(200).json({ message: "Payment successful! Order status updated to Paid." });
//     } catch (err) {
//       console.error("Error updating order status:", err);
//       res.status(500).json({ message: "Failed to update order status", error: err.message });
//     }
//   } else {
//     console.log("Signature mismatch:", { generatedSignature, signature });
//     return res.status(400).json({ message: "Payment verification failed. Signature mismatch." });
//   }
// };



// exports.webhookPaymentVerification = async (req, res) => {
//   try {
//     const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//     const razorpaySignature = req.headers['x-razorpay-signature'];
//     const rawBody = JSON.stringify(req.body); // Convert to string
    
//     // ✅ Generate HMAC signature
//     const hmac = crypto.createHmac('sha256', secret);
//     hmac.update(rawBody, 'utf-8');
//     const generatedSignature = hmac.digest('hex');

//     console.log("🔄 Generated Signature:", generatedSignature);
//     console.log("📝 Received Signature:", razorpaySignature);

//     if (generatedSignature !== razorpaySignature) {
//       console.log("❌ Signature mismatch.");
//       return res.status(400).json({ message: "Signature mismatch" });
//     }

//     // ✅ Extract information
//     const razorpayOrderId = req.body.payload.payment.entity.order_id;
//     console.log("✅ Webhook received for Order ID:", razorpayOrderId);

//     const order = await Order.findOne({ razorpayOrderId });

//     if (!order) {
//       return res.status(404).json({ message: `Order with ID ${razorpayOrderId} not found.` });
//     }

//     // ✅ Update order status to "Paid"
//     order.paymentStatus = "Paid";
//     await order.save();
//     console.log("✅ Order updated to Paid:", order);

//     // ✅ Modify stock for each item in the order
//     for (const item of order.items) {
//       const product = await Product.findById(item.product);

//       if (product) {
//         product.countInStock -= item.quantity;
//         await product.save();
//         console.log(`✅ Product stock updated for ${product.title}: ${product.countInStock}`);
//       }
//     }

//     // ✅ Clear cart if the order is placed from the cart
//     await Cart.findOneAndUpdate(
//       { user: order.user },
//       { $set: { items: [] } }
//     );
//     console.log("✅ Cart cleared after payment");

//     res.status(200).json({ message: "Payment verified and order updated." });

//   } catch (err) {
//     console.error("❌ Error verifying payment:", err.message);
//     res.status(500).json({ message: "Payment verification failed" });
//   }
// };



// new one with event check :


exports.webhookPaymentVerification = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const rawBody = JSON.stringify(req.body); // Convert to string

    // ✅ Generate HMAC signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBody, 'utf-8');
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      console.log("❌ Signature mismatch.");
      return res.status(400).json({ message: "Signature mismatch" });
    }

    const event = req.body.event;
    console.log("📢 Webhook Event:", event);

    // 🚫 Ignore other events except 'payment.captured'
    // if (event !== 'payment.captured') {
    //   console.log(`ℹ️ Ignoring event: ${event}`);
    //   return res.status(200).json({ message: `Ignored event: ${event}` });
    // }


        if (event !== 'payment.captured') {
       const razorpayOrderId = req.body.payload.payment.entity.order_id;
  console.log(`⚠️ Non-capture event (${event}) received for Razorpay Order ID: ${razorpayOrderId}`);

  const order = await Order.findOne({ razorpayOrderId });

  if (order) {
    order.paymentStatus = "Failed";
    await order.save();
    console.log("❌ Order marked as Failed:", order);
  }

    const razorpayOrderId = req.body.payload.payment.entity.order_id;
    console.log("✅ Webhook received for Razorpay Order ID:", razorpayOrderId);

    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(404).json({ message: `Order with ID ${razorpayOrderId} not found.` });
    }

    // ✅ Only now — mark as paid
    order.paymentStatus = "Paid";
    await order.save();
    console.log("✅ Order updated to Paid:", order);

    // ✅ Update stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
        console.log(`✅ Stock updated: ${product.title} - New stock: ${product.countInStock}`);
      }
    }

    // ✅ Clear user's cart
    await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
    console.log("✅ Cart cleared");

    res.status(200).json({ message: "Payment captured and order processed." });

  } catch (err) {
    console.error("❌ Webhook processing failed:", err.message);
    res.status(500).json({ message: "Webhook error" });
  }
};







// @desc    Get current user's orders
// @route   GET /api/orders
// @access  Private (User)
// exports.getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// };




// implementation of pagination for fetching user specific orders :



exports.getMyOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from query params (defaults to 1 if not provided)
  const limit = 10; // Set the number of orders per page

  try {
    // Calculate the number of orders to skip
    const skip = (page - 1) * limit;

    // Fetch orders for the user with pagination (skip and limit)
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip) // Skip the previous pages
      .limit(limit); // Limit to the number of orders per page

    // Get the total number of orders for pagination purposes
    const totalOrders = await Order.countDocuments({ user: req.user._id });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalOrders / limit);

    // Send the paginated response
    res.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};




// @desc    Get specific order by ID
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'title price');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user._id.toString() !== order.user.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// @desc    Admin: Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const total = await Order.countDocuments();
      const orders = await Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      res.json({
        page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        orders
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching all orders' });
    }
  };
  

// @desc    Admin: Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
// @desc Admin: Update order status or payment status
// @route PUT /api/orders/:id/status
// @access Private/Admin
// @desc    Admin: Update order status and payment status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
// @desc    Admin: Update order status or payment status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    const { status, paymentStatus } = req.body;
  
    try {
      const updates = {};
      if (status) updates.status = status;
      if (paymentStatus) updates.paymentStatus = paymentStatus;
  
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true } // return the updated order
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json(updatedOrder);
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ message: 'Failed to update order status' });
    }
  };


  exports.cancelOrder = async (req, res) => {
    const orderId = req.params.id;
  
    try {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      if (order.status !== 'Processing') {
        return res.status(400).json({ message: 'Cannot cancel after order is shipped or delivered' });
      }
  
      // Restore product stock only if it has already been paid for , because we have not reduced it countinstock in the first place if its status is something other than paid :-------->
      
      if (order.paymentStatus === 'Paid') {
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            product.countInStock += item.quantity;
            await product.save();
          }
        }
      }
  
      order.status = 'Cancelled';
      await order.save();
  
      res.json({ message: 'Order cancelled successfully' });
    } catch (err) {
      console.error('Cancel error:', err);
      res.status(500).json({ message: 'Failed to cancel order' });
    }
  };
  
  
  
  
  
  
