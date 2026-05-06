// routes/userRoutes.js
const router = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.use(authMiddleware);
router.get('/', adminMiddleware, userController.getAllUsers); // admin only
router.get('/:id', userController.getProfile);
router.put('/:id', userController.updateProfile);

module.exports = router;