// models/userModel.js
const pool = require('../db');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  async findById(id) {
    const [rows] = await pool.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  async create({ name, email, passwordHash, role = 'user' }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return result.insertId;
  },
  async updateProfile(id, { name, passwordHash }) {
    if (name && passwordHash) {
      await pool.execute('UPDATE users SET name = ?, password_hash = ? WHERE id = ?', [name, passwordHash, id]);
    } else if (name) {
      await pool.execute('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    } else if (passwordHash) {
      await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
    }
  },
  async getAll() {
    const [rows] = await pool.execute('SELECT id, name, email, role, created_at FROM users');
    return rows;
  }
};

module.exports = User;