const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load env vars
process.env.NODE_ENV === 'test' 
  ? dotenv.config({ path: '.env.test' })
  : dotenv.config();

/**
 * User model for managing users in the database.
 */
class User {
  /**
   * Hash a password using bcrypt.
   * @param {string} password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Create a new user.
   * @param {Object} data
   * @param {string} data.name
   * @param {string} data.email
   * @param {string} data.password
   * @returns {Promise<Object>} Created user
   */
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

  /**
   * Find a user by email.
   * @param {string} email
   * @returns {Promise<Object|null>} User or null if not found
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  /**
   * Find a user by ID.
   * @param {number} id
   * @returns {Promise<Object|null>} User or null
   */
  static async findById(id) {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  /**
   * Compare a plain password with a hashed password.
   * @param {string} candidatePassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>} True if match
   */
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Generate a JWT for the user.
   * @param {Object} user
   * @returns {string} JWT token
   */
  static getSignedJwtToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  /**
   * Search users by name or email.
   * @param {string} query
   * @returns {Promise<Object[]>} Array of users
   */
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
