// controllers/cartController.js
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.getByUserId(req.user.id);
    const items = await Cart.getCartItems(cart.id);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ cartId: cart.id, items, subtotal: subtotal.toFixed(2) });
  } catch (err) {
    next(err);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid product_id and positive quantity required' });
    }
    // Check stock
    const stock = await Product.getStockQuantity(product_id);
    if (stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    const cart = await Cart.getByUserId(req.user.id);
    await Cart.addItem(cart.id, product_id, quantity);
    // Return updated cart
    const items = await Cart.getCartItems(cart.id);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.status(201).json({ message: 'Item added to cart', items, subtotal: subtotal.toFixed(2) });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Positive quantity required' });
    }
    // Check stock again? Not strictly required for item already in cart, but good practice
    // We'll trust, but could add check
    await Cart.updateItemQuantity(req.params.id, quantity);
    const cart = await Cart.getByUserId(req.user.id);
    const items = await Cart.getCartItems(cart.id);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items, subtotal: subtotal.toFixed(2) });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    await Cart.removeItem(req.params.id);
    const cart = await Cart.getByUserId(req.user.id);
    const items = await Cart.getCartItems(cart.id);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items, subtotal: subtotal.toFixed(2) });
  } catch (err) {
    next(err);
  }
};