// controllers/orderController.js
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.createOrder = async (req, res, next) => {
  try {
    const { shipping_address } = req.body;
    if (!shipping_address) {
      return res.status(400).json({ message: 'Shipping address required' });
    }
    const cart = await Cart.getByUserId(req.user.id);
    const items = await Cart.getCartItems(cart.id);
    if (items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check final stock availability
    for (const item of items) {
      if (item.quantity > item.stock_quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const shipping = subtotal >= 50 ? 0 : 5.00;
    const total = subtotal + tax + shipping;

    // Create order (transaction handles stock decrement)
    const orderId = await Order.create(req.user.id, total, shipping_address, items.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price })));

    // Clear cart
    await Cart.clearCart(cart.id);

    res.status(201).json({ orderId, total: total.toFixed(2), message: 'Order placed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.getUserOrders(req.user.id);
    for (let order of orders) {
      order.items = []; // optionally fetch items
    }
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Ensure order belongs to user unless admin
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    await Order.updateStatus(req.params.id, status);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    next(err);
  }
};

// controllers/orderController.js (add this exported function)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.getAllOrders(); // uses the model method
    res.json(orders);
  } catch (err) {
    next(err);
  }
};