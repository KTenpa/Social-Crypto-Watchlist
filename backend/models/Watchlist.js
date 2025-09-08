const pool = require('../config/db');

/**
 * Watchlist model for managing user coin watchlists.
 */
class Watchlist {
  /**
   * Add a coin to a user's watchlist.
   * @param {number} userId
   * @param {Object} coin - Coin object from CoinGecko
   * @returns {Promise<number>} Number of rows affected
   */
  static async add(userId, coin) {
    console.log("Raw coin object received in Watchlist.add:", coin);
    // Map CoinGecko fields into DB schema
    const coin_id = coin.id;  
    const symbol = coin.symbol;
    const name = coin.name;
    const image_url = coin.image_url || coin.large; // search API returns "large"
  
    try {
      // Ensure the coin exists in coins table
      await pool.query(
        `INSERT INTO coins (id, symbol, name, image_url)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [coin_id, symbol, name, image_url]
      );
  
      // Add to watchlist
      const result = await pool.query(
        `INSERT INTO watchlist (user_id, coin_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, coin_id) DO NOTHING`,
        [userId, coin_id]
      );
  
      return result.rowCount;
    } catch (err) {
      console.error("Error adding coin to watchlist:", err.message);
      throw err;
    }
  }
  
  /**
   * Remove a coin from a user's watchlist.
   * @param {number} userId
   * @param {string} coinId
   * @returns {Promise}
   */
  static async remove(userId, coinId) {
    return pool.query(
      `DELETE FROM watchlist WHERE user_id = $1 AND coin_id = $2`,
      [userId, coinId]
    );
  }

  /**
   * Get all coins in a user's watchlist.
   * @param {number} userId
   * @returns {Promise<Object[]>} Array of coins
   */
  static async getByUser(userId) {
    const { rows } = await pool.query(
      `SELECT coins.*
       FROM watchlist
       JOIN coins ON watchlist.coin_id = coins.id
       WHERE watchlist.user_id = $1`,
      [userId]
    );
    return rows;
  }
}

module.exports = Watchlist;
