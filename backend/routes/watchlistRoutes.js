const express = require('express');
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} = require('../controllers/watchlistController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   GET /api/v1/watchlist
 * @desc    Get current user's watchlist
 * @access  Private
 */
router.get('/', protect, getWatchlist);

/**
 * @route   POST /api/v1/watchlist
 * @desc    Add a coin to the current user's watchlist
 * @access  Private
 */
router.post('/', protect, addToWatchlist);

/**
 * @route   DELETE /api/v1/watchlist/:coin_id
 * @desc    Remove a coin from the current user's watchlist
 * @access  Private
 */
router.delete('/:coin_id', protect, removeFromWatchlist);

module.exports = router;
