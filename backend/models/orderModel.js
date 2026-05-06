// models/orderModel.js
const pool = require('../db');

const Order = {
  async create(userId, totalAmount, shippingAddress, items) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [orderResult] = await conn.execute(
        'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
        [userId, totalAmount, shippingAddress]
      );
      const orderId = orderResult.insertId;

      for (const item of items) {
        await conn.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
        // Decrement stock
        await conn.execute(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
        await conn.execute(
          'INSERT INTO inventory_logs (product_id, change_type, quantity_change) VALUES (?, ?, ?)',
          [item.product_id, 'order_placed', -item.quantity]
        );
      }
      await conn.commit();
      return orderId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
  async getUserOrders(userId) {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return orders;
  },
  async getOrderById(orderId) {
    const [orders] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) return null;
    const order = orders[0];
    const [items] = await pool.execute(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    order.items = items;
    return order;
  },
  async getAllOrders() {
    const [orders] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    return orders;
  },
  async updateStatus(orderId, status) {
    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) throw new Error('Invalid status');
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    if (status === 'cancelled') {
      // Restock items
      const [items] = await pool.execute('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
      for (const item of items) {
        await pool.execute('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [item.quantity, item.product_id]);
        await pool.execute('INSERT INTO inventory_logs (product_id, change_type, quantity_change) VALUES (?, ?, ?)', [item.product_id, 'order_cancelled', item.quantity]);
      }
    }
  }
};

module.exports = Order;