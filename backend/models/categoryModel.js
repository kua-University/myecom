// models/categoryModel.js
const pool = require('../db');

const Category = {
  async getAll() {
    const [rows] = await pool.execute('SELECT * FROM categories');
    return rows;
  }
};

module.exports = Category;