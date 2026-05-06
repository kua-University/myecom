// controllers/productController.js
const Product = require('../models/productModel');

exports.getAll = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, page, limit } = req.query;
    const products = await Product.findAll({
      search,
      category,
      minPrice,
      maxPrice,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;
    if (!name || price === undefined || stock_quantity === undefined) {
      return res.status(400).json({ message: 'Name, price, and stock required' });
    }
    if (price <= 0) return res.status(400).json({ message: 'Price must be > 0' });
    if (stock_quantity < 0) return res.status(400).json({ message: 'Stock cannot be negative' });
    const id = await Product.create({ name, description, price, stock_quantity, category_id, image_url });
    res.status(201).json({ id, message: 'Product created' });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { price, stock_quantity } = req.body;
    if (price !== undefined && price <= 0) return res.status(400).json({ message: 'Invalid price' });
    if (stock_quantity !== undefined && stock_quantity < 0) return res.status(400).json({ message: 'Invalid stock quantity' });
    await Product.update(req.params.id, req.body);
    res.json({ message: 'Product updated' });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};