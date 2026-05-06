// models/inventoryModel.js
const pool = require('../db');

const Inventory = {
  async logChange(productId, changeType, quantityChange) {
    await pool.execute(
      'INSERT INTO inventory_logs (product_id, change_type, quantity_change) VALUES (?, ?, ?)',
      [productId, changeType, quantityChange]
    );
  }
};

module.exports = Inventory;