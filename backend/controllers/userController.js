// controllers/userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.getProfile = async (req, res, next) => {
  // req.user.id is set by auth middleware (target user if admin, else self)
  try {
    const userId = req.params.id || req.user.id;
    // Non-admin can only view own profile
    if (req.user.role !== 'admin' && userId != req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    if (req.user.role !== 'admin' && userId != req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { name, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: 'Password too short' });
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    if (Object.keys(updateData).length === 0) return res.status(400).json({ message: 'Nothing to update' });
    await User.updateProfile(userId, updateData);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};