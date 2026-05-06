// models/cartModel.js
const pool = require('../db');

const Cart = {
  async getByUserId(userId) {
    let [rows] = await pool.execute('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      // Create cart if not exists
      await pool.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      [rows] = await pool.execute('SELECT * FROM carts WHERE user_id = ?', [userId]);
    }
    return rows[0];
  },
  async getCartItems(cartId) {
    const [rows] = await pool.execute(
      `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url, p.stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    return rows;
  },
  async addItem(cartId, productId, quantity) {
    // Check if item already exists
    const [existing] = await pool.execute('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
    if (existing.length > 0) {
      const newQty = existing[0].quantity + quantity;
      await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
    } else {
      await pool.execute('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
    }
  },
  async updateItemQuantity(cartItemId, quantity) {
    await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, cartItemId]);
  },
  async removeItem(cartItemId) {
    await pool.execute('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
  },
  async clearCart(cartId) {
    await pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }
};

module.exports = Cart;