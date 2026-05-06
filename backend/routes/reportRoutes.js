// routes/reportRoutes.js
const router = require('express').Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/sales-report', authMiddleware, adminMiddleware, reportController.salesReport);

module.exports = router;