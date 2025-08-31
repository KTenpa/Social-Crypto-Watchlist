const pool = require('../config/db');

class Watchlist {
  static async add(userId, coin) {
    const { coin_id, symbol, name, image_url } = coin;

    await pool.query(
      `INSERT INTO coins (id, symbol, name, image_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [coin_id, symbol, name, image_url]
    );

    const result = await pool.query(
      `INSERT INTO watchlist (user_id, coin_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, coin_id) DO NOTHING`,
      [userId, coin_id]
    );

    return result.rowCount;
  }

  static async remove(userId, coinId) {
    return pool.query(
      `DELETE FROM watchlist WHERE user_id = $1 AND coin_id = $2`,
      [userId, coinId]
    );
  }

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
