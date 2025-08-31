const pool = require('../config/db');

class Coin {
  static async create({ id, symbol, name, image_url }) {
    const query = `
      INSERT INTO coins (id, symbol, name, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [id, symbol, name, image_url];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM coins WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM coins';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async search(query) {
    // This will be implemented in the controller using the CoinGecko API
    // We keep this method here for consistency
    throw new Error('Use the controller method for CoinGecko API searches');
  }
}

// Create coins table if it doesn't exist (only in development)
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS coins (
          id TEXT PRIMARY KEY,
          symbol VARCHAR(20) NOT NULL,
          name VARCHAR(100) NOT NULL,
          image_url TEXT
        )
      `);
      console.log('Coins table created or already exists');
    } catch (err) {
      console.error('Error creating coins table:', err);
    }
  })();
}

module.exports = Coin;