// controllers/categoryController.js
const Category = require('../models/categoryModel');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};