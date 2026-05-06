// controllers/reportController.js
const pool = require('../db');

exports.salesReport = async (req, res, next) => {
  try {
    // Total revenue (sum of total_amount from non-cancelled orders)
    const [revenueRows] = await pool.execute(
      "SELECT SUM(total_amount) as total_revenue FROM orders WHERE status != 'cancelled'"
    );
    const [orderCount] = await pool.execute(
      "SELECT COUNT(*) as total_orders FROM orders WHERE status != 'cancelled'"
    );
    const [topProducts] = await pool.execute(
      `SELECT p.id, p.name, SUM(oi.quantity) as total_sold
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status != 'cancelled'
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT 5`
    );
    res.json({
      total_revenue: revenueRows[0].total_revenue || 0,
      total_orders: orderCount[0].total_orders,
      top_products: topProducts
    });
  } catch (err) {
    next(err);
  }
};