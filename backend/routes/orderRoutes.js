// backend/routes/orderRoutes.js
const router = require('express').Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// ADMIN ONLY – Get all orders (must be placed before parameterized routes)
router.get('/all', authMiddleware, adminMiddleware, orderController.getAllOrders);

// All routes below require authentication
router.use(authMiddleware);

// Create a new order from cart (POST /api/orders)
router.post('/', orderController.createOrder);

// Get current user's orders (GET /api/orders)
router.get('/', orderController.getUserOrders);

// Get a specific order by ID (GET /api/orders/:id)
router.get('/:id', orderController.getOrderById);

// Admin: Update order status (PUT /api/orders/:id/status)
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);

module.exports = router;