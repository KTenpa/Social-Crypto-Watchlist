const express = require("express");
const axios = require("axios");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Search coins from CoinGecko
router.get("/search/:query", authenticateToken, async (req, res) => {
  try {
    const { query } = req.params;
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/search?query=${query}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
