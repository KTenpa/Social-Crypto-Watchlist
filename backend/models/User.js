const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load env vars
process.env.NODE_ENV === 'test' 
  ? dotenv.config({ path: '.env.test' })
  : dotenv.config();

class User {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async create({ name, email, password }) {
    const hashedPassword = await this.hashPassword(password);
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;
    const values = [name, email, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static getSignedJwtToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  // search method
  static async search(query) {
    const { rows } = await pool.query(
      `SELECT id, name, email FROM users WHERE name ILIKE $1 OR email ILIKE $1 LIMIT 20`,
      [`%${query}%`]
    );
    return rows;
  }
}

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table created or already exists');
    } catch (err) {
      console.error('Error creating users table:', err);
    }
  })();
}

module.exports = User;
