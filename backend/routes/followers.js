const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Follow a user
router.post("/:userId", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const { userId } = req.params;

  if (id == userId) return res.status(400).json({ error: "Cannot follow yourself" });

  try {
    await pool.query(
      "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [id, userId]
    );
    res.json({ message: "Followed user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unfollow a user
router.delete("/:userId", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const { userId } = req.params;

  try {
    await pool.query(
      "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
      [id, userId]
    );
    res.json({ message: "Unfollowed user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get following list
router.get("/following/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.id, u.username 
       FROM followers f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get followers list
router.get("/followers/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.id, u.username 
       FROM followers f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
