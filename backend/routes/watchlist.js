const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get user's watchlist
router.get("/", authenticateToken, async (req, res) => {
  const { id } = req.user;
  try {
    const result = await pool.query(
      `SELECT coins.* 
       FROM watchlist 
       JOIN coins ON watchlist.coin_id = coins.id 
       WHERE watchlist.user_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add coin to watchlist
router.post("/", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const { coin_id, symbol, name, image_url } = req.body;

  try {
    // Insert coin if not exists
    await pool.query(
      "INSERT INTO coins (id, symbol, name, image_url) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
      [coin_id, symbol, name, image_url]
    );

    // Add to watchlist
    await pool.query(
      "INSERT INTO watchlist (user_id, coin_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [id, coin_id]
    );

    res.json({ message: "Coin added to watchlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove coin from watchlist
router.delete("/:coin_id", authenticateToken, async (req, res) => {
  const { id } = req.user;
  const { coin_id } = req.params;

  try {
    await pool.query(
      "DELETE FROM watchlist WHERE user_id = $1 AND coin_id = $2",
      [id, coin_id]
    );
    res.json({ message: "Coin removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
