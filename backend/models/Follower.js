const pool = require('../config/db');

/**
 * Follower model for managing user follow relationships.
 */
class Follower {
  /**
   * Follow a user.
   * @param {number} followerId - ID of the user following
   * @param {number} followingId - ID of the user being followed
   * @returns {Promise}
   */
  static async follow(followerId, followingId) {
    const query = `
      INSERT INTO followers (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
    return pool.query(query, [followerId, followingId]);
  }

  /**
   * Unfollow a user.
   * @param {number} followerId
   * @param {number} followingId
   * @returns {Promise}
   */
  static async unfollow(followerId, followingId) {
    const query = `
      DELETE FROM followers
      WHERE follower_id = $1 AND following_id = $2
    `;
    return pool.query(query, [followerId, followingId]);
  }

  /**
   * Get users that a user is following.
   * @param {number} userId
   * @returns {Promise<Object[]>} Array of users
   */
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

  /**
   * Get followers of a user.
   * @param {number} userId
   * @returns {Promise<Object[]>} Array of users
   */
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
