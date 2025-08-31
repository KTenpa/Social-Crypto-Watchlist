const pool = require('../config/db');

class Follower {
  static async follow(followerId, followingId) {
    const query = `
      INSERT INTO followers (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
    return pool.query(query, [followerId, followingId]);
  }

  static async unfollow(followerId, followingId) {
    const query = `
      DELETE FROM followers
      WHERE follower_id = $1 AND following_id = $2
    `;
    return pool.query(query, [followerId, followingId]);
  }

  static async getFollowing(userId) {
    const query = `
      SELECT u.id, u.name, u.email
      FROM followers f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async getFollowers(userId) {
    const query = `
      SELECT u.id, u.name, u.email
      FROM followers f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }
}

module.exports = Follower;
