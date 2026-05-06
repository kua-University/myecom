// models/productModel.js
const pool = require('../db');

const Product = {
  async findAll({ search, category, minPrice, maxPrice, page = 1, limit = 10 }) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    if (category) {
      query += ' AND category_id = ?';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const [rows] = await pool.execute(query, params);
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  },
  async create({ name, description, price, stock_quantity, category_id, image_url }) {
    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock_quantity, category_id, image_url]
    );
    return result.insertId;
  },
  async update(id, fields) {
    const allowed = ['name', 'description', 'price', 'stock_quantity', 'category_id', 'image_url'];
    const setClauses = [];
    const values = [];
    for (const key of Object.keys(fields)) {
      if (allowed.includes(key)) {
        setClauses.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }
    if (setClauses.length === 0) return false;
    values.push(id);
    await pool.execute(`UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`, values);
    return true;
  },
  async delete(id) {
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
  },
  // For inventory operations
  async decrementStock(id, quantity) {
    await pool.execute('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?', [quantity, id, quantity]);
  },
  async incrementStock(id, quantity) {
    await pool.execute('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [quantity, id]);
  },
  async getStockQuantity(id) {
    const [rows] = await pool.execute('SELECT stock_quantity FROM products WHERE id = ?', [id]);
    return rows[0] ? rows[0].stock_quantity : 0;
  }
};

module.exports = Product;